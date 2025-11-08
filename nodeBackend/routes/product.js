const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  createProduct,
  getAll,
  getById,
  update,
  remove
} = require('../controllers/productController');

// Public: get all products
router.get('/', getAll);
router.get('/:id', getById);

// Admin: create product (with image upload)
router.post('/', auth, adminOnly, upload.single('image'), createProduct);

// Admin: update product (optionally new image)
router.put('/:id', auth, adminOnly, upload.single('image'), update);

// Admin: delete product
router.delete('/:id', auth, adminOnly, remove);

module.exports = router;
