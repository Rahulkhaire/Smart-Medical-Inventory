




document.addEventListener('DOMContentLoaded', async function () {
  const API_URL = 'http://localhost:8000/api/product';

  // ✅ Fetch all products from backend
  async function fetchProductsFromBackend() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      // Store in global appState
      window.appState = window.appState || {};
      window.appState.products = data.map(p => ({
        id: p._id,
        name: p.name,
        description: p.description || 'No description available',
        price: p.price || 0,
        image: p.images?.[0] || 'assets/default-product.png',
        inStock: p.quantity > 0,
        category: p.category || 'Uncategorized'
      }));

      // ✅ Extract unique categories
      const categories = [...new Set(window.appState.products.map(p => p.category))].filter(Boolean);

      // Render dynamic categories
      populateCategoryFilter(categories);
      populateFooterCategories(categories);
    } catch (err) {
      console.error('❌ Failed to fetch products:', err);
      window.appState = { products: [] };
    }
  }

  // ✅ Populate category dropdown dynamically
  function populateCategoryFilter(categories) {
    const categorySelect = document.getElementById('category-filter');
    if (!categorySelect) return;

    categorySelect.innerHTML = `
      <option value="">All Categories</option>
      ${categories.map(cat => `<option value="${cat}">${formatCategoryName(cat)}</option>`).join('')}
    `;
  }

  // ✅ Populate footer category list dynamically
  function populateFooterCategories(categories) {
    const footerList = document.getElementById('footer-category-list');
    if (!footerList) return;

    footerList.innerHTML = categories
      .map(
        cat => `
        <li>
          <a href="products.html#category=${encodeURIComponent(cat)}">${formatCategoryName(cat)}</a>
        </li>
      `
      )
      .join('');
  }

  // ✅ Format category names
  function formatCategoryName(cat) {
    return cat
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // ✅ Fetch before rendering
  await fetchProductsFromBackend();

  // ✅ Handle hash (category/search)
  const hash = window.location.hash ? window.location.hash.substring(1) : '';
  const params = new URLSearchParams(hash.replace(/&/g, '&'));
  const hashCategory = params.get('category');
  const hashSearch = params.get('search');

  if (hashCategory) {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) categoryFilter.value = decodeURIComponent(hashCategory);
  }

  if (hashSearch) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = decodeURIComponent(hashSearch);
    window.appState.searchTerm = decodeURIComponent(hashSearch);
  }

  // ✅ Load and render products
  function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    let products = [...(window.appState.products || [])];

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && categoryFilter.value)
      products = products.filter(p => p.category === categoryFilter.value);

    if (window.appState.searchTerm) {
      const search = window.appState.searchTerm.toLowerCase();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
      const sortValue = sortFilter.value;
      if (sortValue === 'price-low') products.sort((a, b) => a.price - b.price);
      else if (sortValue === 'price-high') products.sort((a, b) => b.price - a.price);
      else products.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (products.length === 0) {
      productsGrid.innerHTML = `<p class="no-products">No products found.</p>`;
      return;
    }

    productsGrid.innerHTML = products
      .map(
        product => `
        <div class="product-card" data-product-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
            <div class="product-actions">
              <button class="btn btn--primary btn--sm view-details-btn" data-product-id="${product.id}">
                View Details
              </button>
            </div>
            <p class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
              ${product.inStock ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
        </div>`
      )
      .join('');

    // ✅ Attach modal open events
    productsGrid.querySelectorAll('.view-details-btn').forEach(btn =>
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('data-product-id');
        openProductModal(id);
      })
    );
  }

  // ✅ Filter + Sort listeners
  const categoryFilterEl = document.getElementById('category-filter');
  const sortFilterEl = document.getElementById('sort-filter');
  if (categoryFilterEl) categoryFilterEl.addEventListener('change', loadProducts);
  if (sortFilterEl) sortFilterEl.addEventListener('change', loadProducts);

  // ✅ Product modal logic
  const modal = document.getElementById('product-modal');
  if (modal) {
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', e => {
      e.preventDefault();
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });

    const minusBtn = modal.querySelector('.quantity-btn.minus');
    const plusBtn = modal.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('quantity-input');

    if (minusBtn)
      minusBtn.addEventListener('click', e => {
        e.preventDefault();
        const current = parseInt(quantityInput.value) || 1;
        if (current > 1) quantityInput.value = current - 1;
      });

    if (plusBtn)
      plusBtn.addEventListener('click', e => {
        e.preventDefault();
        const current = parseInt(quantityInput.value) || 1;
        quantityInput.value = current + 1;
      });

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn)
      addToCartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const productId = modal.getAttribute('data-current-product');
        const qty = parseInt(quantityInput.value) || 1;
        addToCart(productId, qty);
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      });
  }

  // ✅ Open Product Modal Function
  window.openProductModal = function (productId) {
    const product = window.appState.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    if (!modal) return;

    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = `₹${product.price.toLocaleString()}`;
    document.getElementById('modal-product-description').textContent = product.description;
    const stockStatus = document.getElementById('modal-stock-status');
    stockStatus.textContent = product.inStock ? 'In Stock' : 'Out of Stock';
    stockStatus.className = `stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`;
    document.getElementById('quantity-input').value = 1;

    modal.setAttribute('data-current-product', productId);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  // ✅ Initial render
  loadProducts();
});
