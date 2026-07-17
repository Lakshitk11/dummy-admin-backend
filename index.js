import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/authRoutse.js"; // Note: watch out for the typo in 'authRoutse' filename!
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Add Private Network Access header support
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

// Configure CORS to accept your local testing environment AND your live Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',           // Local Vite environment
  'https://lakshit-lyart.vercel.app'  // Live Vercel app
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Enable this if you send cookies or authorization headers
}));

// Parse incoming JSON requests with increased limit to handle base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Main router mounting 
app.use("/", router);
app.use("/posts", postRoutes);

app.listen(5000, () => {
  console.log(" Server running on port 5000");
});