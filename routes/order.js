import express from 'express';
import { createOrder } from '../controllers/order.js';
import Order from '../models/orderModal.js';
import nodemailer from 'nodemailer'; // Import nodemailer

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:"adrenix.store@gmail.com", // Your Gmail address from environment variables
    pass: "uppp wwpi oang lqin ",  // Your Gmail password from environment variables
  },
});


const router = express.Router();

// Create a new order
router.post('/', createOrder);

// Fetch user orders
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

// Cancel order and send email
router.put('/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(id, { status: 'Cancelled' }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Prepare email details for cancellation
    const mailOptions = {
      from: "adrenix.store@gmail.com", // Sender address
      to: "adrenixorder@gmail.com",   // Recipient address (your email)
      subject: 'Order Cancelled',    // Subject of the email
      text: `Order cancelled:\n\nOrder ID: ${id}\nUser: ${order.userName}\nProducts: ${JSON.stringify(order.products)}\nStatus: Cancelled`, // Body of the email
    };

    // Send cancellation email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Assuming you already have the required imports at the top of your file


// Return and Replace Order
router.put('/:id/return', async (req, res) => {
  const { id } = req.params;


  // Find order and update 
  try {
      const order = await Order.findByIdAndUpdate(id, { status: 'Return Initiated' }, { new: true });
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Send email notification for return initiation
      const mailOptions = {
          from: "adrenix.store@gmail.com",
          to: "adrenixorder@gmail.com", // Send to your email
          subject: 'Order Return Initiated',
          text: `Return initiated for Order ID: ${id}\nUser: ${order.userName}\nProducts: ${JSON.stringify(order.products)}`,
      };


      // Sending Mails
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
          } else {
              console.log('Email sent:', info.response);
          }
      });

      res.json(order);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});



// fetch all orders

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
