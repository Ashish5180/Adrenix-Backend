// models/Address.js
import mongoose from "mongoose";

// Address Schema for storing address

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  street: String,
  city: String,
  phone: { type: String,
    unique: true,
  },
  zip: String,
  
});


export default mongoose.model("Address", addressSchema);
