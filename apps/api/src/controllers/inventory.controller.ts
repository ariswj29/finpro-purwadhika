import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export async function inventories(req: Request, res: Response) {
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

    const productsWithStockAndIndex = products.map(
      (product: { productBranchs: { stock: number }[] }, index: number) => {
        const totalStock = product.productBranchs.reduce(
          (acc: number, curr: { stock: number }) => acc + curr.stock,
          0,
        );

        return {
          ...product,
          no: (pageNumber - 1) * limitNumber + index + 1,
          totalStock,
        };
      },
    );

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

export async function createInventory(req: Request, res: Response) {
  try {
    const { stock, productId, branchId, transactionType } = req.body;
    console.log(req.body, 'req.body');

    const branch = await prisma.branch.findUnique({
      where: {
        userId: parseInt(branchId, 10),
      },
    });

    const productDetails = await prisma.product.findUnique({
      where: {
        id: parseInt(productId, 10),
      },
    });

    if (!branch || !productDetails) {
      return res.status(404).json({ message: 'Branch or Product not found' });
    }

    const productBranch = await prisma.productBranch.findFirst({
      where: {
        branchId: branch?.id,
        productId: parseInt(productId, 10),
      },
    });

    let product;
    if (!productBranch && transactionType == 'IN') {
      product = await prisma.productBranch.create({
        data: {
          stock: parseInt(stock, 10),
          branch: {
            connect: {
              id: branch?.id,
            },
          },
          product: {
            connect: {
              id: parseInt(productId, 10),
            },
          },
        },
      });
    } else {
      product = await prisma.productBranch.update({
        where: {
          id: productBranch?.id,
        },
        data: {
          stock:
            transactionType == 'IN'
              ? (productBranch?.stock ?? 0) + parseInt(stock, 10)
              : (productBranch?.stock ?? 0) - parseInt(stock, 10),
        },
      });
    }

    const journal = await prisma.journalMutation.create({
      data: {
        quantity: parseInt(stock, 10),
        transactionType,
        description: `${transactionType == 'IN' ? 'Add' : 'Remove'} ${stock} stock of ${productDetails?.name} ${branch?.name ? `to branch ${branch?.name}` : ''}`,
        productBranch: {
          connect: {
            id: product.id,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Success adding stock',
      data: { data: product, journal },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function updateInventory(req: Request, res: Response) {
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
      message: 'Success updating stock',
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
