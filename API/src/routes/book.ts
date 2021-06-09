import { BookController } from './../controller/BookController';
import { Router } from 'express';

const router = Router();

// Get all users
router.get('/', BookController.getAll);

// Get one user
router.get('/:id', BookController.getById);

// Create a new user
router.post('/', BookController.new);

// Edit user
router.patch('/:id', BookController.edit);

// Delete
router.delete('/:id', BookController.delete);

export default router;
