// NATH Agency E-commerce Application JavaScript (multi-page friendly)

// Application State (persist cart and user across pages)
let appState = {
    currentUser: null,
    cart: [],
    products: [],
    categories: {},
    selectedCategory: null,
    searchTerm: ''
};

// Product Data
const productData = {
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

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    // Run page-specific loaders depending on presence of elements
    if (document.getElementById('products-grid')) {
        loadProducts();
    }
    if (document.getElementById('cart-items') || document.getElementById('cart-content')) {
        loadCart();
    }
    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
    if (document.getElementById('login-form') || document.getElementById('register-form')) {
        setupAuthForms();
        setupAccountDashboard();
        loadAccount();
    }
});

function initializeApp() {
    appState.categories = productData.categories;
    appState.products = flattenProducts(productData.categories);
    // hydrate persisted state
    try {
        const saved = JSON.parse(localStorage.getItem('nath_app_state') || '{}');
        if (saved.cart) appState.cart = saved.cart;
        if (saved.currentUser) appState.currentUser = saved.currentUser;
    } catch (e) {
        console.warn('Failed to parse saved state', e);
    }

    updateCartCount();
}

function flattenProducts(categories) {
    const products = [];
    Object.keys(categories).forEach(categoryKey => {
        const category = categories[categoryKey];
        Object.keys(category.subcategories || {}).forEach(subKey => {
            const subcategory = category.subcategories[subKey];
            if (subcategory.products) {
                subcategory.products.forEach(product => {
                    products.push({
                        ...product,
                        category: categoryKey,
                        subcategory: subKey
                    });
                });
            }
        });
    });
    return products;
}

function setupEventListeners() {
    // Header / footer links that use data attributes to control behavior
    document.querySelectorAll('a[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            // If current page is products.html, apply filter in-page; otherwise, navigate to products.html with hash
            const category = this.getAttribute('data-category');
            if (window.location.pathname.endsWith('products.html')) {
                e.preventDefault();
                const categoryFilter = document.getElementById('category-filter');
                if (categoryFilter) {
                    categoryFilter.value = category;
                    filterProducts();
                }
            } else {
                // navigate to products page and set hash to category so it can be applied on load
                window.location.href = `products.html#category=${category}`;
            }
        });
    });

    // Logo click (anchor)
    // Search and cart/account are anchors so they naturally navigate between pages; we only wire up search here.

    // Search functionality (when present on page)
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSearch();
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }

    // Product filters (only on products page)
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }

    // Setup components if present
    if (document.getElementById('product-modal')) setupProductModal();
    // contact form and auth are initialized on DOMContentLoaded conditionally above

    // Category cards (home page) -> navigate to products page with category
    document.querySelectorAll('.category-card[data-category]').forEach(card => {
        card.addEventListener('click', function(e) {
            const category = this.getAttribute('data-category');
            if (category) {
                window.location.href = `products.html#category=${category}`;
            }
        });
    });
}

// showPage is no longer needed in multi-page layout; navigation is handled by anchors

function showCategoryProducts(category) {
    appState.selectedCategory = category;
    // navigate to products page with category hash
    window.location.href = `products.html#category=${category}`;
}

function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    // Apply any hash parameters (category/search) when arriving from other pages
    const hash = window.location.hash ? window.location.hash.substring(1) : '';
    const params = new URLSearchParams(hash.replace(/&/g, '&'));
    const hashCategory = params.get('category');
    const hashSearch = params.get('search');

    if (hashCategory) {
        appState.selectedCategory = hashCategory;
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) categoryFilter.value = hashCategory;
    }

    if (hashSearch) {
        appState.searchTerm = decodeURIComponent(hashSearch);
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = appState.searchTerm;
    }

    let products = [...appState.products];

    // Apply category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && categoryFilter.value) {
        products = products.filter(product => product.category === categoryFilter.value);
    }

    // Apply search filter
    if (appState.searchTerm) {
        products = products.filter(product => 
            product.name.toLowerCase().includes(appState.searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(appState.searchTerm.toLowerCase())
        );
    }

    // Apply sorting
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        const sortValue = sortFilter.value;
        switch(sortValue) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    // Render products
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <button class="btn btn--primary btn--sm view-details-btn" data-product-id="${product.id}">View Details</button>
                </div>
                <p class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
            </div>
        </div>
    `).join('');

    // Add click listeners to view details buttons
    productsGrid.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = this.getAttribute('data-product-id');
            openProductModal(productId);
        });
    });

    // Category-card elements on other pages may navigate here; ensure they also work if present on this page
    document.querySelectorAll('.category-card[data-category]').forEach(card => {
        card.addEventListener('click', function(e) {
            const category = this.getAttribute('data-category');
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) {
                categoryFilter.value = category;
                filterProducts();
            }
        });
    });
}

function filterProducts() {
    loadProducts();
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        appState.searchTerm = searchInput.value.trim();
        // Navigate to products page and pass search term via hash
        const q = encodeURIComponent(appState.searchTerm);
        window.location.href = `products.html#search=${q}`;
    }
}

function setupProductModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeProductModal();
        });
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProductModal();
        }
    });

    // Quantity controls
    const quantityInput = document.getElementById('quantity-input');
    const minusBtn = modal.querySelector('.quantity-btn.minus');
    const plusBtn = modal.querySelector('.quantity-btn.plus');

    if (minusBtn && quantityInput) {
        minusBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const current = parseInt(quantityInput.value) || 1;
            if (current > 1) {
                quantityInput.value = current - 1;
            }
        });
    }

    if (plusBtn && quantityInput) {
        plusBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const current = parseInt(quantityInput.value) || 1;
            quantityInput.value = current + 1;
        });
    }

    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = modal.getAttribute('data-current-product');
            const quantity = parseInt(quantityInput.value) || 1;
            addToCart(productId, quantity);
            closeProductModal();
        });
    }
}

function openProductModal(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    const modalStockStatus = document.getElementById('modal-stock-status');
    const quantityInput = document.getElementById('quantity-input');

    if (modalImage) {
        modalImage.src = product.image;
        modalImage.alt = product.name;
    }
    if (modalName) modalName.textContent = product.name;
    if (modalPrice) modalPrice.textContent = `₹${product.price.toLocaleString()}`;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalStockStatus) {
        modalStockStatus.textContent = product.inStock ? 'In Stock' : 'Out of Stock';
        modalStockStatus.className = `stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`;
    }
    if (quantityInput) quantityInput.value = 1;

    modal.setAttribute('data-current-product', productId);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function addToCart(productId, quantity = 1) {
    const product = appState.products.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const existingItem = appState.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        appState.cart.push({
            ...product,
            quantity: quantity
        });
    }

    updateCartCount();
    persistState();
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    updateCartCount();
    loadCart();
}

function updateCartQuantity(productId, quantity) {
    const item = appState.cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = parseInt(quantity);
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartCount();
            loadCart();
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const cartContent = document.getElementById('cart-content');
    const emptyCart = document.getElementById('empty-cart');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');

    if (appState.cart.length === 0) {
        if (cartContent) cartContent.classList.add('hidden');
        if (emptyCart) emptyCart.classList.remove('hidden');
        return;
    }

    if (cartContent) cartContent.classList.remove('hidden');
    if (emptyCart) emptyCart.classList.add('hidden');

    // Render cart items
    if (cartItems) {
        cartItems.innerHTML = appState.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                </div>
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

        // Add event listeners to cart controls
        cartItems.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-product-id');
                const action = this.getAttribute('data-action');
                const item = appState.cart.find(item => item.id === productId);

                if (item) {
                    if (action === 'increase') {
                        updateCartQuantity(productId, item.quantity + 1);
                    } else if (action === 'decrease') {
                        updateCartQuantity(productId, item.quantity - 1);
                    }
                }
            });
        });

        cartItems.querySelectorAll('.cart-quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.getAttribute('data-product-id');
                const newQuantity = parseInt(this.value);
                updateCartQuantity(productId, newQuantity);
            });
        });

        cartItems.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-product-id');
                removeFromCart(productId);
            });
        });
    }

    // Calculate totals
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
    if (cartTotal) cartTotal.textContent = `₹${subtotal.toLocaleString()}`;

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            alert('Checkout functionality would be implemented here. Thank you for shopping with NATH Agency!');
        };
    }
}

function persistState() {
    try {
        localStorage.setItem('nath_app_state', JSON.stringify({
            cart: appState.cart,
            currentUser: appState.currentUser
        }));
    } catch (e) {
        console.warn('Failed to persist state', e);
    }
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name')?.value,
                email: document.getElementById('email')?.value,
                phone: document.getElementById('phone')?.value,
                subject: document.getElementById('subject')?.value,
                message: document.getElementById('message')?.value
            };

            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all required fields.');
                return;
            }

            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
}

function setupAuthForms() {
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-form-container')?.classList.remove('active');
            document.getElementById('register-form-container')?.classList.add('active');
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('register-form-container')?.classList.remove('active');
            document.getElementById('login-form-container')?.classList.add('active');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('login-email')?.value;
            const password = document.getElementById('login-password')?.value;

            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            // Try to get the registered user's name if available
            let registeredName = localStorage.getItem('registeredName');
            if (!registeredName) {
                registeredName = 'User';
            }
            appState.currentUser = {
                name: registeredName,
                email: email,
                phone: '+91-9876543210'
            };

            alert('Login successful!');
            persistState();
            loadAccount();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('register-name')?.value;
            const email = document.getElementById('register-email')?.value;
            const password = document.getElementById('register-password')?.value;
            const phone = document.getElementById('register-phone')?.value;

            if (!name || !email || !password || !phone) {
                alert('Please fill in all fields.');
                return;
            }

            appState.currentUser = { name, email, phone };
            persistState();
            alert('Registration successful!');
            loadAccount();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            appState.currentUser = null;
            persistState();
            loadAccount();
        });
    }
}

function setupAccountDashboard() {
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');

    dashboardTabs.forEach(tab => {
        if (tab.hasAttribute('data-tab')) {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                const tabName = this.getAttribute('data-tab');

                dashboardTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const sections = document.querySelectorAll('.dashboard-section');
                sections.forEach(section => section.classList.remove('active'));

                const targetSection = document.getElementById(`${tabName}-section`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        }
    });
}

function loadAccount() {
    const loginSection = document.getElementById('login-section');
    const accountDashboard = document.getElementById('account-dashboard');
    const userProfile = document.getElementById('user-profile');

    if (!appState.currentUser) {
        if (loginSection) loginSection.classList.remove('hidden');
        if (accountDashboard) accountDashboard.classList.add('hidden');
    } else {
        if (loginSection) loginSection.classList.add('hidden');
        if (accountDashboard) accountDashboard.classList.remove('hidden');

        if (userProfile) {
            userProfile.innerHTML = `
                <div class="card">
                    <div class="card__body">
                        <p><strong>Name:</strong> ${appState.currentUser.name}</p>
                        <p><strong>Email:</strong> ${appState.currentUser.email}</p>
                        <p><strong>Phone:</strong> ${appState.currentUser.phone}</p>
                    </div>
                </div>
            `;
        }
    }
}