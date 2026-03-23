import express from "express";
import Tesseract from "tesseract.js";
import multer from "multer";
import fs from "fs/promises";
import * as Jimp from "jimp";
import mongoose from "mongoose";
import User from "../models/User.js";
import FoodEntry from "../models/FoodEntry.js";

const router = express.Router();

// Multer setup for file uploads
const uploadDir = "./uploads";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

// Ensure 'uploads' directory exists
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// 🔥 IMPROVED Preprocessing (better OCR accuracy)
const preprocessImage = async (imagePath) => {
  try {
    let image = await Jimp.read(imagePath);

    await image
      .resize(1000, Jimp.AUTO) // bigger image = better OCR
      .greyscale()
      .contrast(0.7)
      .normalize()
      .brightness(0.05)
      .writeAsync(imagePath);

    console.log("✅ Image preprocessed successfully");
  } catch (error) {
    console.error("⚠️ Error in image preprocessing:", error);
  }
};

// 🔥 IMPROVED extraction (more flexible)
const extractNutritionData = (text) => {
  const nutrition = {};
  const cleanText = text.toLowerCase();

  const regexPatterns = {
    calories: /calories[^0-9]*([\d]+)/i,
    fat: /(total\s*fat|fat)[^\d]*([0-9]+(?:\.[0-9]+)?)\s*g/i,
    protein: /protein[^0-9]*([\d.]+)/i,
    carbs: /(total\s*carbohydrate|carbs?)[^0-9]*([\d.]+)/i,
    sugar: /sugars?[^0-9]*([\d.]+)/i,
    fiber: /fiber[^0-9]*([\d.]+)/i,
    sodium: /sodium[^0-9]*([\d.]+)/i,
    servingSize: /serv(?:ing)?\s*size[^0-9]*([\d.]+)/i,
  };

  for (const [key, regex] of Object.entries(regexPatterns)) {
    try {
      const match = cleanText.match(regex);
      if (match) {
        nutrition[key] = parseFloat(match[match.length - 1]);
      } else {
        nutrition[key] = 0;
      }
    } catch {
      nutrition[key] = 0;
    }
  }

  console.log("✅ Extracted Nutrition Data:", nutrition);
  return nutrition;
};

// OCR Route
router.post("/:userId", upload.single("image"), async (req, res) => {
  let imagePath = null;

  try {
    console.log("📸 Received OCR request");

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    imagePath = req.file.path;

    // preprocess
    await preprocessImage(imagePath);

    // OCR
    const { data } = await Tesseract.recognize(imagePath, "eng");

    console.log("📜 OCR TEXT:", data.text);

    const nutritionData = extractNutritionData(data.text);

    const { caloriesToBurn, stepsNeeded } = calculateBurn(
      nutritionData.calories,
      user
    );

    const newFoodEntry = new FoodEntry({
      userId,
      foodName: "Scanned Food",
      ...nutritionData,
      caloriesToBurn,
      stepsNeeded,
    });

    await newFoodEntry.save();

    res.json({
      success: true,
      text: data.text,
      nutrition: nutritionData,
      caloriesToBurn,
      stepsNeeded,
    });

  } catch (error) {
    console.error("❌ OCR Error:", error);
    res.status(500).json({ message: "Error processing OCR" });
  } finally {
    if (imagePath) {
      try {
        await fs.unlink(imagePath);
      } catch {}
    }
  }
});

// BMR
const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age || !gender) return 2000;

  return gender === "male"
    ? 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age
    : 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
};

// Burn calculation
const calculateBurn = (calories, user) => {
  if (!calories || !user) return { caloriesToBurn: 0, stepsNeeded: 0 };

  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
  const caloriesToBurn = Math.max(0, calories - bmr / 24);
  const stepsNeeded = Math.round(caloriesToBurn / 0.04);

  return { caloriesToBurn, stepsNeeded };
};

// History
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await FoodEntry.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch {
    res.status(500).json({ message: "Error fetching history" });
  }
});

export default router;