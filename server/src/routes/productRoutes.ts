import express from 'express';
import { createProduct, getProducts, deleteProduct } from '../controllers/productController';
import { validateProduct } from '../middleware/validation';

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public
 */
router.post('/', validateProduct, createProduct);

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination, search, and filters
 * @access  Public
 */
router.get('/', getProducts);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 * @access  Public
 */
router.delete('/:id', deleteProduct);

export default router;
