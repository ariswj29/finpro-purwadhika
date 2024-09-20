import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';
import { Prisma } from '@prisma/client';
import { categorySchema } from '@/schemas/category.schema';
import * as yup from 'yup';

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const { search, page, limit = '10' } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const categorys = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      where: { name: { contains: search as string } },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const categorysWithIndex = categorys.map(
      (
        category: { id: number; name: string; slug: string },
        index: number,
      ) => ({
        ...category,
        no: (pageNumber - 1) * limitNumber + index + 1,
      }),
    );

    const totalCategory = await prisma.category.count({
      where: { name: { contains: search as string } },
    });
    const totalPages = Math.ceil(totalCategory / limitNumber);

    res.status(200).json({
      message: 'success',
      data: categorysWithIndex,
      pagination: {
        totalItems: totalCategory,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    await categorySchema.validate(req.body, { abortEarly: false });

    const { name, slug } = req.body;
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
      },
    });
    if (existingCategory) {
      return res.json({
        status: 'error',
        message: 'Category already exists',
      });
    }
    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Category successfully created',
      data: category,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        status: 'error',
        message: error.errors,
      });
    }

    res.status(400).json({ error: 'An unexpected error occurred' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    await categorySchema.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const { name, slug } = req.body;

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        slug,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Category successfully updated',
      data: updatedCategory,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        status: 'error',
        message: error.errors,
      });
    }

    res.status(400).json({ error: 'An unexpected error occurred' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }

    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Category successfully deleted',
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};
