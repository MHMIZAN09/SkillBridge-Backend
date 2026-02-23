import { Category, Subject } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

const createCategory = async (payload: Category) => {
  const category = await prisma.category.create({
    data: payload,
  });
  return category;
};

const createSubject = async (payload: Subject) => {
  const subject = await prisma.subject.create({
    data: payload,
  });
  return subject;
};

const updateCategory = async (id: string, payload: Partial<Category>) => {
  const category = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return category;
};

const updateSubject = async (id: string, payload: Partial<Subject>) => {
  const subject = await prisma.subject.update({
    where: { id },
    data: payload,
  });
  return subject;
};

const deleteCategory = async (id: string) => {
  await prisma.category.delete({
    where: { id },
  });
};

const deleteSubject = async (id: string) => {
  await prisma.subject.delete({
    where: { id },
  });
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  createSubject,
  updateCategory,
  updateSubject,
  deleteCategory,
  deleteSubject,
};
