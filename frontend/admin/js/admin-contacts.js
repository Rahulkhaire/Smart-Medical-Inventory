document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('adminToken');
  const tableBody = document.getElementById('messages-table-body');
  const statusBox = document.getElementById('messages-status');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const headers = { 'Authorization': `Bearer ${token}` };

  const modal = document.getElementById('message-modal');
  const closeModal = modal.querySelector('.modal-close');

  function openModal(msg) {
    document.getElementById('modal-name').textContent = msg.name;
    document.getElementById('modal-email').textContent = msg.email;
    document.getElementById('modal-phone').textContent = msg.phone;
    document.getElementById('modal-subject').textContent = msg.subject || '—';
    document.getElementById('modal-message').textContent = msg.message;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeModal.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  async function loadMessages() {
    tableBody.innerHTML = '<tr><td colspan="7">Loading messages...</td></tr>';
    statusBox.textContent = '⏳ Fetching contact messages...';

    try {
      const res = await fetch('http://localhost:8000/api/contact', { headers });
      const data = await res.json();

      if (!res.ok) {
        tableBody.innerHTML = `<tr><td colspan="7">${data.msg || 'Failed to load messages.'}</td></tr>`;
        return;
      }

      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">No messages found.</td></tr>`;
        statusBox.textContent = 'No messages yet.';
        return;
      }

      tableBody.innerHTML = data
        .map(
          (m) => `
          <tr>
            <td>${m.name}</td>
            <td>${m.email}</td>
            <td>${m.phone}</td>
            <td>${m.subject || '—'}</td>
            <td><button class="view-msg-btn" data-id="${m._id}">View Message</button></td>
            <td>${new Date(m.createdAt).toLocaleString()}</td>
            <td><button class="btn btn-danger btn-sm delete-btn" data-id="${m._id}">Delete</button></td>
          </tr>`
        )
        .join('');

      document.querySelectorAll('.view-msg-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const message = data.find((m) => m._id === id);
          if (message) openModal(message);
        });
      });

      document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          if (!confirm('Are you sure you want to delete this message?')) return;
          await deleteMessage(id);
        });
      });

      statusBox.textContent = `✅ Loaded ${data.length} messages.`;
      statusBox.style.color = '#4caf50';
    } catch (err) {
      console.error('Message Load Error:', err);
      tableBody.innerHTML = `<tr><td colspan="7">Server error loading messages.</td></tr>`;
      statusBox.textContent = '⚠️ Could not load messages.';
      statusBox.style.color = '#ff4b4b';
    }
  }

  async function deleteMessage(id) {
    try {
      const res = await fetch(`http://localhost:8000/api/contact/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`❌ Failed to delete: ${data.msg || 'Server error'}`);
        return;
      }

      alert('🗑️ Message deleted successfully!');
      loadMessages();
    } catch (err) {
      console.error('Delete Error:', err);
      alert('⚠️ Error deleting message.');
    }
  }

  loadMessages();
});
