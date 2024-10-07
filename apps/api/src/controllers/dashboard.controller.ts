import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    // Total Admin
    const branch = await prisma.branch.findFirst({
      where: {
        userId: Number(userId),
      },
    });

    // Total Sales
    const totalSales = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: 'DELIVERED',
        branchId: branch ? branch.id : undefined,
      },
    });

    // Total Product
    const totalProduct = await prisma.product.count();

    // Total Stock
    const totalStock = await prisma.productBranch.aggregate({
      _sum: {
        stock: true,
      },
      where: {
        branchId: branch ? branch.id : undefined,
      },
    });

    // Name Products
    const products = await prisma.product.findMany({
      select: {
        name: true,
      },
      orderBy: { id: 'asc' },
    });

    const productNames = products.map((product) => product.name);

    const allProducts = await prisma.product.findMany({
      select: { id: true },
      orderBy: { id: 'asc' },
    });

    // Sales per product
    const salesPerProduct = await prisma.orderProduct.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          // paymentStatus: 'DELIVERED',
          branchId: branch ? branch.id : undefined,
        },
      },
    });

    const salesMap = salesPerProduct.reduce((acc: any, item: any) => {
      acc[item.productId] = item._sum.quantity ?? 0;
      return acc;
    }, {});

    const salesValues = allProducts.map(
      (product: { id: number }) => salesMap[product.id] ?? 0,
    );

    // Stock per product
    const stockPerProduct = await prisma.productBranch.groupBy({
      by: ['productId'],
      _sum: {
        stock: true,
      },
      where: {
        branchId: branch ? branch.id : undefined,
      },
    });

    const stockMap = stockPerProduct.reduce((acc: any, item: any) => {
      acc[item.productId] = item._sum.stock ?? 0;
      return acc;
    }, {});

    const stockValues = allProducts.map(
      (product: { id: number }) => stockMap[product.id] ?? 0,
    );

    // Name Categories
    const categories = await prisma.category.findMany({
      select: {
        name: true,
      },
      orderBy: { id: 'asc' },
    });

    const categoryNames = categories.map((category) => category.name);

    const productCategories = await prisma.product.findMany({
      select: {
        id: true,
        categoryId: true,
      },
      orderBy: { id: 'asc' },
    });

    // Sales per category
    const salesPerCategory = await prisma.orderProduct.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          branchId: branch ? branch.id : undefined,
        },
      },
    });

    const salesPerCategoryByCategory = salesPerCategory.reduce(
      (acc: { [key: number]: number }, sale) => {
        const product = productCategories.find((p) => p.id === sale.productId);
        const categoryId = product ? product.categoryId : null;

        if (categoryId) {
          if (!acc[categoryId]) {
            acc[categoryId] = 0;
          }
          acc[categoryId] += sale._sum.quantity ?? 0;
        }

        return acc;
      },
      {},
    );

    const salesByCategoryValues = Object.keys(salesPerCategoryByCategory)
      .sort((a, b) => Number(a) - Number(b))
      .map((categoryId) => salesPerCategoryByCategory[Number(categoryId)]);

    // Stock per category
    const stockPerCategory = await prisma.productBranch.groupBy({
      by: ['productId'],
      _sum: {
        stock: true,
      },
      where: {
        branchId: branch ? branch.id : undefined,
      },
    });

    const stockPerCategoryByCategory = stockPerCategory.reduce(
      (acc: { [key: number]: number }, stockData) => {
        const product = productCategories.find(
          (p) => p.id === stockData.productId,
        );
        const categoryId = product ? product.categoryId : null;

        if (categoryId) {
          if (!acc[categoryId]) {
            acc[categoryId] = 0;
          }
          acc[categoryId] += stockData._sum.stock ?? 0;
        }

        return acc;
      },
      {},
    );

    const stockByCategoryValues = Object.keys(stockPerCategoryByCategory)
      .sort((a, b) => Number(a) - Number(b))
      .map((categoryId) => stockPerCategoryByCategory[Number(categoryId)]);

    res.json({
      totalSales: totalSales._sum.total,
      totalProduct: totalProduct,
      totalStock: totalStock._sum.stock,
      productNames: productNames,
      salesPerProduct: salesValues,
      stockPerProduct: stockValues,
      categoryNames: categoryNames,
      salesPerCategory: salesByCategoryValues,
      stockPerCategory: stockByCategoryValues,
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};
