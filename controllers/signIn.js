import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Import crypto for generating random token
import userModel from "../models/userModal.js"; // Ensure the correct import
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Use a strong secret key
const SPECIAL_EMAIL = process.env.SPECIAL_EMAIL; // Define the specific email for special handling

const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  console.log('Generated OTP:', otp); // Log the generated OTP

  // Set up Nodemailer transport for sendin emails
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.BUSINESS_EMAIL, // Use environment variable
      pass: process.env.BUSINESS_PASSWORD, // Use environment variable
    },
  });

  const mailOptions = {
    from: process.env.BUSINESS_EMAIL, // Use environment variable
    to: email,
    subject: 'Your OTP for Login',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    
    // Store OTP temporarily in the database for verification
    await userModel.findOneAndUpdate(
      { email },
      { otp }, // Store OTP
      { new: true }
    );
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


// signin using otp verification by SMTP(Simple Mail Transfer Protocol)
export const signIn = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      await sendOtp(email); // Send the OTP
      return res.status(200).send({ message: 'OTP sent to your email' });
    } else {
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).send({ message: 'Server error' });
  }
};


// OTP Verification
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body; // email and otp from frontend

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      console.log('Received OTP:', otp); 
      console.log('Stored OTP:', user.otp); 

      if (user.otp && user.otp.toString() === otp) {
        // Generate JWT Token
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });


        // Generate an additional random token if user.email matches SPECIAL_EMAIL
        let specialaccessOwnerToken = null;
        if (user.email.toLowerCase() === SPECIAL_EMAIL.toLowerCase()) {
          // Generate special access token for the special email
          specialaccessOwnerToken = crypto.randomBytes(32).toString('hex');
          console.log('Generated Special Access Token:', specialaccessOwnerToken);
        } else {
          console.log('Emails did not match. No special access token generated.');
        }

        
        // Send JWT token and additional randomKeyToken (if generated) in the response
        res.cookie("token", token, { httpOnly: true });

        // Clear the OTP after successful verification
        user.otp = null; 
        await user.save();

        // Return the response, include specialaccessOwnerToken only if generated
        return res.status(200).send({
          message: 'Login successful',
          user: {
            id: user._id,
            email: user.email,
            name: user.username,
            token: token,
            specialaccessOwnerToken: specialaccessOwnerToken || undefined, // Send only if it's generated
          },
        });
      } else {
        return res.status(400).send({ message: 'Invalid OTP' });
      }
    } else {
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).send({ message: 'Server error' });
  }
};
