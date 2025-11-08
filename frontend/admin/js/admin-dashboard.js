document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('adminToken');
  const statusBox = document.getElementById('dashboard-status');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Target elements
  const totalProductsEl = document.getElementById('total-products');
  const totalOrdersEl = document.getElementById('total-orders');
  const pendingOrdersEl = document.getElementById('pending-orders');
  const totalMessagesEl = document.getElementById('total-messages');

  // Helper: set loading state
  function setLoading() {
    totalProductsEl.textContent = 'Loading...';
    totalOrdersEl.textContent = 'Loading...';
    pendingOrdersEl.textContent = 'Loading...';
    totalMessagesEl.textContent = 'Loading...';
    statusBox.textContent = '⏳ Fetching latest data...';
  }

  // Helper: set error
  function setError(msg) {
    statusBox.textContent = `⚠️ ${msg}`;
    statusBox.style.color = '#ff4b4b';
  }

  setLoading();

  try {
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch all data in parallel
    const [productsRes, ordersRes, messagesRes] = await Promise.all([
      fetch('http://localhost:8000/api/product', { headers }),
      fetch('http://localhost:8000/api/orders/all', { headers }),
      fetch('http://localhost:8000/api/contact', { headers })
    ]);

    // Parse all
    const [products, orders, messages] = await Promise.all([
      productsRes.json(),
      ordersRes.json(),
      messagesRes.json()
    ]);

    if (!productsRes.ok) throw new Error(products.msg || 'Error loading products');
    if (!ordersRes.ok) throw new Error(orders.msg || 'Error loading orders');
    if (!messagesRes.ok) throw new Error(messages.msg || 'Error loading messages');

    // ✅ Update dashboard values
    totalProductsEl.textContent = products.length.toLocaleString();
    totalOrdersEl.textContent = orders.length.toLocaleString();

    const pending = orders.filter(o => o.status?.toLowerCase() === 'pending').length;
    pendingOrdersEl.textContent = pending.toLocaleString();

    totalMessagesEl.textContent = messages.length.toLocaleString();

    statusBox.textContent = '✅ Dashboard updated successfully';
    statusBox.style.color = '#4caf50';
  } catch (err) {
    console.error('Dashboard Error:', err);
    setError('Failed to fetch data. Please check the server.');
  }
});
