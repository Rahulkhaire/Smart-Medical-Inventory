// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'No items in order' });
    }

    // Calculate totals
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ msg: `Product not found: ${item.productId}` });

      const quantity = item.quantity || 1;
      const subtotal = product.price * quantity;
      total += subtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        subtotal
      });

      // Optional: reduce product stock
      product.quantity = Math.max(product.quantity - quantity, 0);
      await product.save();
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: total,
      paymentMethod: paymentMethod || 'COD',
      shippingAddress
    });

    await order.save();

    res.status(201).json({ msg: 'Order placed successfully', order });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).send('Server error');
  }
};

// Get all orders of current user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Server error');
  }
};

// Admin: get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).send('Server error');
  }
};

// Admin: update order status
// Admin: update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Accepted', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ msg: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).send('Server error');
  }
};

