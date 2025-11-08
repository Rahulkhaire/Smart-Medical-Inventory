const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  quantity: Number,
  category: String,
  images: [String], // ✅ Stores Cloudinary URLs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);