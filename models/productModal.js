import mongoose from 'mongoose';


// Product Schema for storing product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Path to the uploaded image
  size1: { type: String, required: false },
  size2: { type: String, required: false },
  size3: { type: String, required: false },
  size4: { type: String, required: false },
  color: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
