const Product = require('../models/product.js');

exports.createProduct = async (req, res) => {
  try {
    // Handle both multipart/form-data and JSON
    let data = req.body;

    // If body is empty (e.g. multer without file), parse from req.body manually
    if (Object.keys(data).length === 0 && req.headers['content-type']?.includes('application/json')) {
      data = JSON.parse(req.body);
    }

    const { name, description, price, quantity, category } = data;

    if (!name) {
      return res.status(400).json({ msg: 'Product name is required' });
    }

    // Cloudinary image URL
    const imageUrl = req.file ? req.file.path : null;

    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      images: imageUrl ? [imageUrl] : [],
    });

    await product.save();
    res.status(201).json({ msg: '✅ Product created successfully', product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).send('Server error');
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Product not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// ✅ Update Product
exports.update = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;

    // Optional: new image uploaded
    if (req.file) {
      product.images = [req.file.path];
    }

    await product.save();
    res.json({ msg: '✅ Product updated successfully', product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Server error');
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
