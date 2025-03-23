import mongoose from "mongoose";

const priceOptionSchema = new mongoose.Schema({
  type: { type: String }, // e.g., "Seul" or "En Menu"
  quantity: { type: Number }, // Number of pieces per option
  price: { type: Number, required: true },
  pricev2: { type: Number }, // Price for another branch
});

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Dish Name (e.g., "Finger Chips")
  description: String, // Dish description
  isActive: { type: Boolean, default: true }, // Dish availability
  priceOptions: { type: [priceOptionSchema], required: true }, // Multiple pricing options
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    isActive: { type: Boolean, default: true },
    dishes: [dishSchema], // Array of dishes
  },
  { timestamps: true, versionKey: false }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
