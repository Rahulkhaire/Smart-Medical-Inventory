document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('adminToken');
  const tableBody = document.getElementById('orders-table-body');
  const statusBox = document.getElementById('orders-status');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // ✅ Load orders
  async function loadOrders() {
    tableBody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    statusBox.textContent = '⏳ Fetching orders...';

    try {
      const res = await fetch('http://localhost:8000/api/orders/all', { headers });
      const data = await res.json();

      if (!res.ok) {
        tableBody.innerHTML = `<tr><td colspan="6">${data.msg || 'Error fetching orders'}</td></tr>`;
        return;
      }

      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6">No orders found.</td></tr>`;
        return;
      }

      tableBody.innerHTML = data.map(order => `
        <tr>
          <td>${order._id}</td>
          <td>${order.user?.name || 'Guest'}<br><small>${order.user?.email || ''}</small></td>
          <td>₹${order.totalAmount?.toLocaleString() || 0}</td>
          <td>
            <span class="status-badge ${order.status?.toLowerCase()}">${order.status}</span>
          </td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
          <td>
            <select class="status-select" data-id="${order._id}">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Accepted" ${order.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
          const id = e.target.getAttribute('data-id');
          const newStatus = e.target.value;
          await updateOrderStatus(id, newStatus);
        });
      });

      statusBox.textContent = '✅ Orders loaded successfully.';
      statusBox.style.color = '#4caf50';
    } catch (err) {
      console.error('Order load error:', err);
      tableBody.innerHTML = `<tr><td colspan="6">Server error loading orders.</td></tr>`;
      statusBox.textContent = '⚠️ Could not fetch orders.';
      statusBox.style.color = '#ff4b4b';
    }
  }

  // ✅ Update order status
  async function updateOrderStatus(id, newStatus) {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Failed: ${data.msg || 'Server error'}`);
        return;
      }

      alert('✅ Order status updated successfully');
      loadOrders();
    } catch (err) {
      console.error('Update error:', err);
      alert('⚠️ Error updating order status.');
    }
  }

  loadOrders();
});
