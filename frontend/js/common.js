// Common JS: shared state, product data, and cart/account utilities

window.appState = {
  currentUser: null,
  cart: [],
  products: [],
  categories: {},
  selectedCategory: null,
  searchTerm: ''
};

// Product data (copied from previous app.js)
window.productData = {
  "categories": {
    "surgical_instruments": {
      "name": "Surgical Instruments",
      "description": "High-quality surgical instruments for various medical procedures",
      "icon": "🔪",
      "subcategories": {
        "cutting_instruments": {
          "name": "Cutting & Dissecting Instruments",
          "products": [
            {"id": "scalpel-001", "name": "Surgical Scalpels", "price": 275, "image": "/api/placeholder/300/300", "description": "Precision cutting instruments for surgical procedures", "inStock": true},
            {"id": "mayo-scissors", "name": "Mayo Scissors", "price": 500, "image": "/api/placeholder/300/300", "description": "Heavy scissors for cutting thick tissues", "inStock": true},
            {"id": "metz-scissors", "name": "Metzenbaum Scissors", "price": 650, "image": "/api/placeholder/300/300", "description": "Delicate tissue cutting scissors", "inStock": true},
            {"id": "iris-scissors", "name": "Iris Scissors", "price": 375, "image": "/api/placeholder/300/300", "description": "Fine dissection scissors", "inStock": true}
          ]
        },
        "grasping_instruments": {
          "name": "Grasping & Holding Instruments",
          "products": [
            {"id": "debakey-forceps", "name": "DeBakey Forceps", "price": 750, "image": "/api/placeholder/300/300", "description": "Atraumatic tissue grasping forceps", "inStock": true},
            {"id": "adson-forceps", "name": "Adson Forceps", "price": 500, "image": "/api/placeholder/300/300", "description": "Toothed forceps for dense tissue handling", "inStock": true},
            {"id": "russian-forceps", "name": "Russian Forceps", "price": 575, "image": "/api/placeholder/300/300", "description": "Broad-tipped tissue forceps", "inStock": true}
          ]
        }
      }
    },
    "diagnostic_equipment": {
      "name": "Diagnostic Equipment",
      "description": "Modern diagnostic tools for accurate medical assessment",
      "icon": "🩺",
      "subcategories": {
        "cardiovascular": {
          "name": "Cardiovascular Diagnostics",
          "products": [
            {"id": "digital-steth", "name": "Digital Stethoscope", "price": 15000, "image": "/api/placeholder/300/300", "description": "Electronic stethoscope with amplification", "inStock": true},
            {"id": "ecg-machine", "name": "ECG Machine", "price": 82500, "image": "/api/placeholder/300/300", "description": "12-lead electrocardiography machine", "inStock": true},
            {"id": "bp-monitor", "name": "Digital BP Monitor", "price": 4500, "image": "/api/placeholder/300/300", "description": "Automatic blood pressure monitor", "inStock": true}
          ]
        }
      }
    },
    "patient_care": {
      "name": "Patient Care Equipment",
      "description": "Essential equipment for patient care and monitoring",
      "icon": "🏥",
      "subcategories": {
        "monitoring": {
          "name": "Patient Monitoring",
          "products": [
            {"id": "pulse-ox", "name": "Pulse Oximeter", "price": 8000, "image": "/api/placeholder/300/300", "description": "Fingertip oxygen saturation monitor", "inStock": true},
            {"id": "thermometer", "name": "Digital Thermometer", "price": 1500, "image": "/api/placeholder/300/300", "description": "Non-contact infrared thermometer", "inStock": true}
          ]
        }
      }
    },
    "furniture": {
      "name": "Hospital Furniture",
      "description": "Comfortable and functional medical furniture",
      "icon": "🛏️",
      "subcategories": {
        "beds": {
          "name": "Hospital Beds & Accessories",
          "products": [
            {"id": "electric-bed", "name": "Electric Hospital Bed", "price": 87500, "image": "/api/placeholder/300/300", "description": "3-function electric hospital bed", "inStock": true},
            {"id": "wheelchair", "name": "Manual Wheelchair", "price": 12500, "image": "/api/placeholder/300/300", "description": "Standard manual wheelchair", "inStock": true}
          ]
        }
      }
    },
    "consumables": {
      "name": "Medical Consumables",
      "description": "Disposable medical supplies and consumables",
      "icon": "🧤",
      "subcategories": {
        "wound_care": {
          "name": "Wound Care Supplies",
          "products": [
            {"id": "surg-gloves", "name": "Surgical Gloves (Box)", "price": 900, "image": "/api/placeholder/300/300", "description": "Sterile latex surgical gloves - 50 pairs", "inStock": true},
            {"id": "gauze-pads", "name": "Sterile Gauze Pads", "price": 150, "image": "/api/placeholder/300/300", "description": "4x4 inch sterile gauze pads - pack of 25", "inStock": true}
          ]
        }
      }
    }
  }
};

// If an admin or previous session saved a modified product catalog, load it from localStorage
try {
  const savedCatalog = JSON.parse(localStorage.getItem('nath_product_data') || 'null');
  if (savedCatalog && typeof savedCatalog === 'object') {
    window.productData = savedCatalog;
  }
} catch (e) {
  console.warn('Failed to load saved product catalog', e);
}

function flattenProducts(categories) {
  const products = [];
  Object.keys(categories).forEach(categoryKey => {
    const category = categories[categoryKey];
    Object.keys(category.subcategories || {}).forEach(subKey => {
      const subcategory = category.subcategories[subKey];
      if (subcategory.products) {
        subcategory.products.forEach(product => {
          products.push({ ...product, category: categoryKey, subcategory: subKey });
        });
      }
    });
  });
  return products;
}

function persistState() {
  try {
    localStorage.setItem('nath_app_state', JSON.stringify({ cart: window.appState.cart, currentUser: window.appState.currentUser }));
  } catch (e) {
    console.warn('Failed to persist state', e);
  }
}

function initializeApp() {
  window.appState.categories = window.productData.categories;
  window.appState.products = flattenProducts(window.productData.categories);
  try {
    const saved = JSON.parse(localStorage.getItem('nath_app_state') || '{}');
    if (saved.cart) window.appState.cart = saved.cart;
    if (saved.currentUser) window.appState.currentUser = saved.currentUser;
  } catch (e) {
    console.warn('Failed to parse saved state', e);
  }
  updateCartCount();
  // wire up category links that use data-category
  document.querySelectorAll('a[data-category]').forEach(link => {
    link.addEventListener('click', function (e) {
      const category = this.getAttribute('data-category');
      if (window.location.pathname.endsWith('products.html')) {
        e.preventDefault();
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
          categoryFilter.value = category;
          const evt = new Event('change');
          categoryFilter.dispatchEvent(evt);
        }
      } else {
        // navigate with hash
        window.location.href = `products.html#category=${category}`;
      }
    });
  });

  // Category-card click navigation (home page)
  document.querySelectorAll('.category-card[data-category]').forEach(card => {
    card.addEventListener('click', function () {
      const category = this.getAttribute('data-category');
      if (category) window.location.href = `products.html#category=${category}`;
    });
  });

  // Search redirection (header search) when present
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const q = encodeURIComponent(searchInput.value.trim());
      window.location.href = `products.html#search=${q}`;
    });
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = encodeURIComponent(searchInput.value.trim());
        window.location.href = `products.html#search=${q}`;
      }
    });
  }
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const totalItems = window.appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

function addToCart(productId, quantity = 1) {
  const product = window.appState.products.find(p => p.id === productId);
  if (!product || !product.inStock) return;
  const existingItem = window.appState.cart.find(item => item.id === productId);
  if (existingItem) existingItem.quantity += quantity; else window.appState.cart.push({ ...product, quantity });
  updateCartCount();
  persistState();
  alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  window.appState.cart = window.appState.cart.filter(item => item.id !== productId);
  updateCartCount();
  loadCart();
  persistState();
}

function updateCartQuantity(productId, quantity) {
  const item = window.appState.cart.find(item => item.id === productId);
  if (item) {
    const newQuantity = parseInt(quantity);
    if (newQuantity <= 0) removeFromCart(productId); else {
      item.quantity = newQuantity;
      updateCartCount();
      loadCart();
      persistState();
    }
  }
}

function loadCart() {
  const cartItems = document.getElementById('cart-items');
  const cartContent = document.getElementById('cart-content');
  const emptyCart = document.getElementById('empty-cart');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');

  if (!cartItems) return; // page may not have cart section

  if (window.appState.cart.length === 0) {
    if (cartContent) cartContent.classList.add('hidden');
    if (emptyCart) emptyCart.classList.remove('hidden');
    return;
  }

  if (cartContent) cartContent.classList.remove('hidden');
  if (emptyCart) emptyCart.classList.add('hidden');

  cartItems.innerHTML = window.appState.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image"><img src="${item.image}" alt="${item.name}"></div>
      <div class="cart-item-info"><h4>${item.name}</h4><div class="cart-item-price">₹${item.price.toLocaleString()}</div></div>
      <div class="cart-item-actions">
        <div class="quantity-selector">
          <button class="quantity-btn minus" data-product-id="${item.id}" data-action="decrease">-</button>
          <input type="number" value="${item.quantity}" min="1" data-product-id="${item.id}" class="cart-quantity-input">
          <button class="quantity-btn plus" data-product-id="${item.id}" data-action="increase">+</button>
        </div>
        <button class="btn btn--outline btn--sm remove-item-btn" data-product-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join('');

  // events
  cartItems.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = this.getAttribute('data-product-id');
      const action = this.getAttribute('data-action');
      const item = window.appState.cart.find(item => item.id === productId);
      if (item) {
        if (action === 'increase') updateCartQuantity(productId, item.quantity + 1); else if (action === 'decrease') updateCartQuantity(productId, item.quantity - 1);
      }
    });
  });

  cartItems.querySelectorAll('.cart-quantity-input').forEach(input => {
    input.addEventListener('change', function () {
      const productId = this.getAttribute('data-product-id');
      const newQuantity = parseInt(this.value);
      updateCartQuantity(productId, newQuantity);
    });
  });

  cartItems.querySelectorAll('.remove-item-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productId = this.getAttribute('data-product-id');
      removeFromCart(productId);
    });
  });

  const subtotal = window.appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
  if (cartTotal) cartTotal.textContent = `₹${subtotal.toLocaleString()}`;
}

// Initialize common behaviors on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});
