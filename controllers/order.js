import Order from '../models/orderModal.js'; // Ensure this path is correct
import Product from '../models/productModal.js'; // Ensure this path is correct
import nodemailer from 'nodemailer'; // Import nodemailer
import dotenv from 'dotenv';
dotenv.config();
// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service
  auth: {
    user: process.env.BUSINESS_EMAIL, // Your Gmail address
    pass: process.env.BUSINESS_PASSWORD, // Your Gmail password or app password
  },
});


// Create a new order
export const createOrder = async (req, res) => {
  const { userId, userName, products, address, paymentMethod, totalAmount } = req.body;

  if (!userId || !userName || !products || !address || !paymentMethod || totalAmount == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newOrder = new Order({
      userId,
      userName,
      products,
      address,
      paymentMethod,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    // Update stock for each product in the order
    for (const product of products) {
      const { id, quantity } = product;
     
      
      
      
      // Decrement stock in the product model
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: `Product with ID ${id} not found` });
      }

      if (updatedProduct.stock < 0) {
        return res.status(400).json({ message: `Insufficient stock for product ${id}` });
      }
    }


    
    // Prepare email details
    const mailOptions = {
      from: process.env.BUSINESS_EMAIL, // Sender address
      to: "adrenixorder@gmail.com", // Recipient address (your email)
      subject: 'New Order Created', // Subject of the email
      text: `New order details:\n\nUser: ${userName}\nProducts: ${JSON.stringify(products)}\nAddress: ${address}\nPayment Method: ${paymentMethod}\nTotal Amount: $${totalAmount}`, // Body of the email
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
