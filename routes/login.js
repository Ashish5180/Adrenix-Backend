import express from 'express';
import { signIn, verifyOtp } from '../controllers/signIn.js'; // Adjust path as necessary

const router = express.Router();

router.post('/api/signin', signIn);      // Handle sign-in requests
router.post('/api/verify', verifyOtp);    // Handle OTP verification requests

export default router;
