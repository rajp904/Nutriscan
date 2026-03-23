import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer"; // ✅ For handling image uploads
import authRoutes from "./routes/auth.js";
import ocrRoutes from "./routes/ocr.js"; // ✅ OCR Routes

dotenv.config(); // Load .env variables

const app = express();

// ✅ Middleware
app.use(express.json());

// Improved CORS setup – this fixes most Railway + Vercel issues
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",   // Use env var in production → set in Railway dashboard
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,                         // Needed if using cookies or auth headers with credentials
}));

// Very important for Railway: Explicitly handle OPTIONS preflight requests
app.options("*", cors());

// ✅ File Upload Configuration
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });

// ✅ Routes
// Note: If your ocrRoutes uses multer upload, make sure it's applied per-route, not globally
app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes); // OCR uses multer

// ✅ Root Route (For Testing)
app.get("/", (req, res) => {
  res.send("🚀 ScanEats API is running!");   // ← assuming this is your project name
});

// ✅ MongoDB Connection (modern way – flags are no longer needed)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit if MongoDB connection fails
  }
};

connectDB();

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));