import express from 'express';
import User from '../models/userModal.js'; // Ensure the correct path to your user model

const router = express.Router();

// GET /api/users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
