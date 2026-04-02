import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    quantity: { type: Number, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);