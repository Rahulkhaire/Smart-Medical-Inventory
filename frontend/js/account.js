

// js/account.js
document.addEventListener('DOMContentLoaded', function () {
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');
  const ordersContainer = document.getElementById('user-orders');

  const API_BASE = 'http://localhost:8000/api/auth';
  const ORDER_API = 'http://localhost:8000/api/orders';

  // Switch between login and register forms
  if (showRegister)
    showRegister.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('login-form-container')?.classList.remove('active');
      document.getElementById('register-form-container')?.classList.add('active');
    });

  if (showLogin)
    showLogin.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('register-form-container')?.classList.remove('active');
      document.getElementById('login-form-container')?.classList.add('active');
    });

  // Registration
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('register-name')?.value.trim();
      const email = document.getElementById('register-email')?.value.trim();
      const password = document.getElementById('register-password')?.value.trim();
      const phone = document.getElementById('register-phone')?.value.trim();

      if (!name || !email || !password || !phone) {
        alert('Please fill in all fields.');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.msg || 'Registration failed.');
          return;
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        alert('✅ Registration successful!');
        loadAccount();
      } catch (err) {
        console.error('Registration error:', err);
        alert('Error: Unable to register. Please try again.');
      }
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value.trim();

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.msg || 'Invalid credentials.');
          return;
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        alert('✅ Login successful!');
        loadAccount();
      } catch (err) {
        console.error('Login error:', err);
        alert('Error: Unable to login. Please try again.');
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      loadAccount();
    });
  }

  // Dashboard tab switching
  const dashboardTabs = document.querySelectorAll('.dashboard-tab');
  dashboardTabs.forEach(tab =>
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      dashboardTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const sections = document.querySelectorAll('.dashboard-section');
      sections.forEach(s => s.classList.remove('active'));
      const target = document.getElementById(`${this.getAttribute('data-tab')}-section`);
      if (target) target.classList.add('active');

      if (this.getAttribute('data-tab') === 'orders') {
        fetchOrderHistory();
      }
    })
  );

  // Load account view
  function loadAccount() {
    const loginSection = document.getElementById('login-section');
    const dashboard = document.getElementById('account-dashboard');
    const userProfile = document.getElementById('user-profile');

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authToken');

    if (user && token) {
      loginSection?.classList.add('hidden');
      dashboard?.classList.remove('hidden');

      if (userProfile) {
        userProfile.innerHTML = `
          <p><strong>Name:</strong> ${escapeHtml(user.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
          <p><strong>Role:</strong> ${escapeHtml(user.role || 'User')}</p>
        `;
      }

      fetchOrderHistory();
    } else {
      loginSection?.classList.remove('hidden');
      dashboard?.classList.add('hidden');
    }
  }

  // Utility to escape HTML (safety)
  function escapeHtml(str = '') {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // Fetch order history
  async function fetchOrderHistory() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authToken');

    if (!user || !token) {
      ordersContainer.innerHTML = `<p>Please login to view your orders.</p>`;
      return;
    }

    try {
      const res = await fetch(`${ORDER_API}/my-orders`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        ordersContainer.innerHTML = `<p>⚠️ Failed to load orders: ${data.msg || 'Server error'}</p>`;
        return;
      }

      if (!data || data.length === 0) {
        ordersContainer.innerHTML = `<p>No orders found.</p>`;
        return;
      }

      // Render orders
      ordersContainer.innerHTML = data.map(order => {
        const itemsHtml = order.items.map(item => `
            <div class="order-item">
              <p><strong>${escapeHtml(item.name)}</strong> × ${Number(item.quantity)}</p>
              <p>Rs. ${Number(item.subtotal || item.price * item.quantity).toLocaleString('en-IN')}</p>
            </div>
        `).join('');

        return `
          <div class="order-card">
            <div class="order-header">
              <h4>Order #${order._id}</h4>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> ${escapeHtml(order.status || 'Pending')}</p>
            </div>

            <div class="order-items">
              ${itemsHtml}
            </div>

            <div class="order-footer">
              <p><strong>Total:</strong> Rs. ${Number(order.totalAmount).toLocaleString('en-IN')}</p>
              <p><strong>Payment:</strong> ${escapeHtml(order.paymentMethod || 'COD')}</p>
              ${order.status === 'Delivered' ? `<button class="btn btn--primary generate-bill" data-id="${order._id}">🧾 Generate Bill</button>` : ''}
            </div>
          </div>
        `;
      }).join('');

      // Attach listeners AFTER rendering
      document.querySelectorAll('.generate-bill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          generateBill(id);
        });
      });

    } catch (err) {
      console.error('Error fetching orders:', err);
      ordersContainer.innerHTML = `<p>⚠️ Unable to load orders. Please try again later.</p>`;
    }
  }

  // Generate PDF invoice using jspdf + autotable
  async function generateBill(orderId) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authToken');

    if (!user || !token) {
      return alert('Please login to generate the bill.');
    }

    try {
      // fetch user's orders (could fetch single order endpoint if available)
      const res = await fetch(`${ORDER_API}/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const orders = await res.json();
      if (!res.ok) {
        console.error('Error fetching orders for invoice', orders);
        return alert('Could not fetch order details for invoice.');
      }

      const order = orders.find(o => o._id === orderId);
      if (!order) return alert('Order not found.');

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      // Page margins
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Company header (left) and company block (right)
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('NATH Agency', margin, 60);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Your Trusted Partner for Medical Equipment', margin, 78);

      // Right side "From" block
      const fromLines = [
        'From:',
        'NATH Agency',
        'Chhatrapati Sambhajinagar',
        'Phone: +91-7385346634',
        'Email: info@nathagency.com',
        'Website: www.nathagency.com'
      ];
      const rightX = pageWidth - margin - 200;
      let rightY = 50;
      doc.setFontSize(10);
      fromLines.forEach((ln, i) => {
        doc.text(ln, rightX, rightY + i * 12);
      });

      // Invoice meta
      doc.setDrawColor(200);
      doc.line(margin, 95, pageWidth - margin, 95);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Invoice', margin, 115);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Invoice ID: ${order._id}`, margin, 132);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, margin, 146);

      // Bill To block
      const billToY = 170;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', margin, billToY);

      doc.setFont('helvetica', 'normal');
      const custName = user.name || (order.shippingAddress && order.shippingAddress.fullName) || 'Customer';
      const custEmail = user.email || (order.shippingAddress && order.shippingAddress.email) || '';
      const custPhone = (order.shippingAddress && order.shippingAddress.phone) || '';
      let billLines = [
        `Name: ${custName}`,
        `Email: ${custEmail}`,
      ];
      if (custPhone) billLines.push(`Phone: ${custPhone}`);
      billLines.forEach((ln, i) => doc.text(ln, margin, billToY + 16 + i * 12));

      // Build items table using autoTable
      const tableY = billToY + 80;
      const items = (order.items || []).map(it => ([
        String(it.name || ''),
        String(it.quantity || 0),
        `Rs. ${Number(it.price || 0).toLocaleString('en-IN')}`,
        `Rs. ${Number(it.subtotal || (it.price * it.quantity)).toLocaleString('en-IN')}`
      ]));

      // Use autoTable
      doc.autoTable({
        startY: tableY,
        theme: 'grid',
        head: [['Item', 'Qty', 'Price', 'Subtotal']],
        body: items,
        headStyles: { fillColor: [230, 230, 230], textColor: 20 },
        styles: { fontSize: 10 },
        margin: { left: margin, right: margin },
        didDrawPage: function (data) {
          // no-op
        }
      });

      // After table, add totals and payment info
      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : tableY + 120;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Amount:', margin, finalY + 10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Rs. ${Number(order.totalAmount || 0).toLocaleString('en-IN')}`, margin + 110, finalY + 10);

      doc.setFontSize(10);
      doc.text(`Payment Method: ${order.paymentMethod || 'COD'}`, margin, finalY + 32);
      doc.text(`Order Status: ${order.status || ''}`, margin, finalY + 48);

      // Footer
      doc.setFontSize(9);
      doc.text('Thank you for shopping with NATH Agency!', margin, finalY + 80);
      doc.text('For any support, contact: info@nathagency.com', margin, finalY + 96);

      // Save file
      doc.save(`NATH_Invoice_${order._id}.pdf`);
    } catch (err) {
      console.error('Bill generation error:', err);
      alert('⚠️ Error generating bill. Please try again.');
    }
  }

  // Initialize
  loadAccount();
});