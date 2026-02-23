import express from 'express';
import { CategoryController } from './category.controller';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.post('/', CategoryController.createCategory);
router.post('/subject', CategoryController.createSubject);
router.put('/:id', CategoryController.updateCategory);
router.put('/subject/:id', CategoryController.updateSubject);
router.delete('/:id', CategoryController.deleteCategory);
router.delete('/subject/:id', CategoryController.deleteSubject);

export const CategoryRouter = router;
