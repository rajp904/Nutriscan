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
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// ✅ File Upload Configuration
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes); // OCR uses multer

// ✅ Root Route (For Testing)
app.get("/", (req, res) => {
  res.send("🚀 ScanEats API is running!");
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
