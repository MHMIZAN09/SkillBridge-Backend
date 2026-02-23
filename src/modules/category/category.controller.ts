import { Request, Response } from 'express';
import { CategoryService } from './category.service';

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve categories',
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create category',
    });
  }
};

const createSubject = async (req: Request, res: Response) => {
  try {
    const subject = await CategoryService.createSubject(req.body);
    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create subject',
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.updateCategory(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to update category',
    });
  }
};

const updateSubject = async (req: Request, res: Response) => {
  try {
    const subject = await CategoryService.updateSubject(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to update subject',
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    await CategoryService.deleteCategory(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to delete category',
    });
  }
};

const deleteSubject = async (req: Request, res: Response) => {
  try {
    await CategoryService.deleteSubject(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to delete subject',
    });
  }
};

export const CategoryController = {
  getAllCategories,
  createCategory,
  createSubject,
  updateCategory,
  updateSubject,
  deleteCategory,
  deleteSubject,
};
