import { Request, Response } from "express";
import Product from "../models/Product";

export const createProduct = async (req:Request, res:Response) => {
  try {
    const { name, description, quantity, categories } = req.body;

    if (!name || !quantity) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await Product.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = await Product.create({
      name,
      description,
      quantity,
      categories
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, search = "", categories } = req.query;

    const limit = 5;
    const skip = (Number(page) - 1) * limit;

    let filter: any = {
      name: { $regex: search, $options: "i" }
    };

    if (categories) {
      let categoryArray: string[] = [];

      if (typeof categories === "string") {
        categoryArray = categories.split(",").map((c) => c.trim()).filter(Boolean);
      } else if (Array.isArray(categories)) {
        categoryArray = categories.map((c) => String(c).trim()).filter(Boolean);
      } else {
        categoryArray = [String(categories).trim()].filter(Boolean);
      }

      if (categoryArray.length > 0) {
        filter.categories = { $in: categoryArray };
      }
    }

    const products = await Product.find(filter)
      .populate("categories", "-__v -_id")
      .select("-updatedAt -__v")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting" });
  }
};