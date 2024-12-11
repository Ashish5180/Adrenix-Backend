import express from "express";
import signUp from "./controllers/signUp.js";
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import the cors package
import addressRoute from "./routes/address.js";
import authRoutes from "./routes/login.js";
import orderRoutes from "./routes/order.js";
import productRoutes from './routes/product.js';
import path from 'path';
import userRoutes from './routes/user.js';
import dotenv from 'dotenv'
const app = express();

dotenv.config();
// Cookie Parser
app.use(cookieParser());

// Cors Setup for Frontend 
app.use(cors({
    origin: "https://www.adrenix.in",
    credentials: true, // Allows cookies to be sent with requests
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const __dirname = path.resolve();

// For Image upload using multer
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));


// Check Server is running
app.get("/", (req, res) => {
    res.send("Server is running");
})


// Register the user routes
app.use('/api/users', userRoutes);

// Signup route with password hashing and sending JWT token in cookie
app.post("/signup", signUp);


// Login Routes
app.use(authRoutes);

// Address Route
app.use("/api", addressRoute);


// create and get orders
app.use('/api/orders', orderRoutes);


// create and get products
app.use('/api/products', productRoutes);





// Server
app.listen(5000, () => console.log(`Server is running on port 5000`));
