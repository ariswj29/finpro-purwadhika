import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const branch = await prisma.branch.findFirst({
      where: {
        userId: Number(userId),
      },
    });

    const totalSales = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: 'DELIVERED',
        branchId: branch ? branch.id : undefined,
      },
    });

    const totalProduct = await prisma.product.count();

    const totalStock = await prisma.productBranch.aggregate({
      _sum: {
        stock: true,
      },
      where: {
        branchId: branch ? branch.id : undefined,
      },
    });

    const allProducts = await prisma.product.findMany({
      select: { id: true },
      orderBy: { id: 'asc' },
    });

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

    res.json({
      totalSales: totalSales._sum.total,
      totalProduct: totalProduct,
      totalStock: totalStock._sum.stock,
      salesPerProduct: salesValues,
      stockPerProduct: stockValues,
    });
  } catch (error) {
    res.status(500).json({ error: 'error' });
  }
};
