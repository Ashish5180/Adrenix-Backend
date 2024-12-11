// models/Order.js
import mongoose from 'mongoose';


//order schema for storing  order
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  products: [{
    id: { type: String, required: false },
    name: { type: String, required: true },
    image: { type: String, required: true }, // Path to the uploaded image
    size: { type: String, required: true },
    color: { type: String, required: false},
    quantity: { type: Number, required: true },
    price: { type: String, required: true },
  }],
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'In Transit' } 
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
