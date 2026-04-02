import { Request, Response } from 'express';
import Category from '../models/Category';

/**
 * Get all categories
 * GET /api/categories
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sort alphabetically
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
