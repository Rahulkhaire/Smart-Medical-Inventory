require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./db/db.js');

// ✅ initialize app first
const app = express();

// ✅ middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// ✅ connect to database
connectDB();

// ✅ import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contactRoutes');


// ✅ use routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);



// ✅ default route
app.get('/', (req, res) => res.send({ ok: true, message: 'API running' }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
