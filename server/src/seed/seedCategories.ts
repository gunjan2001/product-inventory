import Category from "../models/Category";
import { connectDB } from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Category.deleteMany();

  await Category.insertMany([
    { name: "Electronics" },
    { name: "Clothing" },
    { name: "Food" },
    { name: "Books" },
    { name: "Other" }
  ]);

  console.log("Categories Seeded");
  process.exit();
};

seed();