// routes/orders.js
const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

// User routes
router.post('/', auth, createOrder); // place order
router.get('/my-orders', auth, getUserOrders); // view own orders

// Admin routes
router.get('/all', auth, adminOnly, getAllOrders);
router.put('/:id/status', auth, adminOnly, updateOrderStatus);

module.exports = router;
