// routes/address.js
import express from "express";
import Address from "../models/addressModal.js";

const router = express.Router();

// Save or Update Address
router.post("/address", async (req, res) => {
  try {
    const { street, city, phone, zip, country, userId } = req.body;


    // Ensure userId is provided in the request body
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }


    

    // Check existing address
    const existingAddress = await Address.findOne({ userId });
    if (existingAddress) {
      existingAddress.street = street;
      existingAddress.city = city;
      existingAddress.phone = phone;
      existingAddress.zip = zip;
      await existingAddress.save();
    } else {
      const newAddress = new Address({ userId, street, city, phone, zip, country });
      await newAddress.save();
    }

    res.status(200).json({ message: "Address saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});



// Get Address
router.get("/address", async (req, res) => {
  try {
    const { userId } = req.query; // Assuming userId is passed as a query parameter

    // Ensure userId is provided in the request
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const address = await Address.findOne({ userId });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
