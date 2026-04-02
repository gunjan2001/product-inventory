import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * Validation middleware for product creation
 */
export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { name, quantity, categories } = req.body;
  const errors: string[] = [];

  // Validate product name
  if (!name || typeof name !== 'string') {
    errors.push('Product name is required and must be a string');
  } else if (name.trim().length === 0) {
    errors.push('Product name cannot be empty');
  } else if (name.length > 100) {
    errors.push('Product name must be less than 100 characters');
  }

  // Validate quantity
  if (quantity === undefined || quantity === null) {
    errors.push('Quantity is required');
  } else if (typeof quantity !== 'number') {
    errors.push('Quantity must be a number');
  } else if (!Number.isInteger(quantity)) {
    errors.push('Quantity must be an integer');
  } else if (quantity < 0) {
    errors.push('Quantity cannot be negative');
  }

  // Validate categories (required)
  if (!categories || !Array.isArray(categories)) {
    errors.push('Categories are required and must be an array');
  } else if (categories.length === 0) {
    errors.push('At least one category must be selected');
  } else {
    // Validate each category ID is a valid MongoDB ObjectId
    const invalidCategories = categories.filter(
      (cat: any) => !mongoose.Types.ObjectId.isValid(cat)
    );
    
    if (invalidCategories.length > 0) {
      errors.push('All category IDs must be valid MongoDB ObjectIds');
    }
  }

  // If there are validation errors, return 400 response
  if (errors.length > 0) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
    return;
  }

  // Validation passed, proceed to next middleware/controller
  next();
};
