const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
} = require('../controllers/contactController');

// Public route for form submissions
router.post('/', createContactMessage);

// Admin / internal routes
router.get('/', getAllMessages);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

module.exports = router;
