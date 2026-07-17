import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/authRoutse.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());    

// Parse incoming JSON requests
app.use(express.json());

// Main router mounting 
app.use("/", router);
app.use("/posts", postRoutes);

app.listen(5000, () => {
  console.log(" Server running on port 5000");
});
