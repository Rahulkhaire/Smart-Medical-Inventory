document.addEventListener('DOMContentLoaded', function () {
  if (typeof loadCart === 'function') loadCart();

  const checkoutBtn = document.getElementById('checkout-btn');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async function () {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('authToken');
      const cart = window.appState.cart || [];

      if (!cart || cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      if (!user || !token) {
        alert('Please login before placing an order.');
        window.location.href = 'account.html';
        return;
      }

      // ✅ Collect shipping form values
      const shippingAddress = {
        fullName: document.getElementById('ship-name')?.value.trim(),
        phone: document.getElementById('ship-phone')?.value.trim(),
        addressLine1: document.getElementById('ship-address1')?.value.trim(),
        addressLine2: document.getElementById('ship-address2')?.value.trim(),
        city: document.getElementById('ship-city')?.value.trim(),
        state: document.getElementById('ship-state')?.value.trim(),
        pincode: document.getElementById('ship-pincode')?.value.trim()
      };

      // ✅ Validate
      if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.pincode) {
        alert('⚠️ Please fill in all required shipping details.');
        return;
      }

      // ✅ Calculate total
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // ✅ Prepare payload
      const orderPayload = {
        items: cart.map(i => ({
          productId: i.id || i._id,
          quantity: i.quantity
        })),
        shippingAddress,
        paymentMethod: 'COD'
      };

      try {
        const response = await fetch('http://localhost:8000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Order creation failed:', data);
          alert(`❌ Failed to place order: ${data.msg || 'Server Error'}`);
          return;
        }

        alert('✅ Order placed successfully!');

        // Clear cart
        window.appState.cart = [];
        persistState();
        updateCartCount();
        loadCart();

        // Redirect to orders tab
        window.location.href = 'account.html#orders';
      } catch (err) {
        console.error('Error while placing order:', err);
        alert('⚠️ Could not place order. Check your internet or try again.');
      }
    });
  }
});


