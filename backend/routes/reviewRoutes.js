import express from "express";
import { addRestaurantReview } from "../Controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addRestaurantReview);

export default router;