import express from 'express';
import multer from 'multer';
import fs from 'fs';
import Product from '../models/productModal.js';

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/products
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, size1, size2, size3,size4, color, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newProduct = new Product({
      name,
      image: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, // Full image URL
      size1,
      size2,
      size3,
      size4,
      color,
      stock,
      price,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// get all orders

router.get('/', async (req, res) => {
    try {
      const products = await Product.find(); // Fetch all products from the database
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;
