import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function inventorys(req: Request, res: Response) {
  try {
    const { search = '', page = '1', limit = '10', userId } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;

    const branchId = await prisma.branch.findFirst({
      where: {
        userId: parseInt(userId as string, 10),
      },
    });

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search as string,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        category: {
          select: {
            name: true,
          },
        },
        productBranchs: {
          where: {
            branchId: branchId?.id,
          },
          select: {
            stock: true,
          },
        },
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const productsWithStockAndIndex = products.map((product, index) => {
      const totalStock = product.productBranchs.reduce(
        (acc, branch) => acc + branch.stock,
        0,
      );

      return {
        ...product,
        no: (pageNumber - 1) * limitNumber + index + 1,
        totalStock,
      };
    });

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      status: 'success',
      message: 'success get all products',
      data: productsWithStockAndIndex,
      pagination: {
        totalItems: totalProducts,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, categoryId, slug, description } = req.body;
    const image = req.file?.filename;

    const product = await prisma.product.create({
      data: {
        name,
        price: parseInt(price, 10),
        image,
        categoryId: parseInt(categoryId, 10),
        slug,
        description,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'success create product',
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function inventory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const isIdNumeric = !isNaN(Number(id));

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: isIdNumeric ? parseInt(id, 10) : undefined },
          { slug: !isIdNumeric ? id : undefined },
        ],
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Success get product',
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, price, categoryId, slug, description } = req.body;
    const image = req.file?.filename;

    const product = await prisma.product.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        name,
        price: parseInt(price, 10),
        image,
        categoryId: parseInt(categoryId, 10),
        slug,
        description,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'success update product',
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'success delete product',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
