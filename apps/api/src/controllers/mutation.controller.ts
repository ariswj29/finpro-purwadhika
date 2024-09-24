import { Request, Response } from 'express';
import prisma from '@/helpers/prisma';

export async function mutations(req: Request, res: Response) {
  try {
    const { search = '', page = '1', limit = '10', userId } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;

    const branchId = await prisma.branch.findFirst({
      where: {
        userId: parseInt(userId as string, 10),
      },
    });

    const mutations = await prisma.mutation.findMany({
      select: {
        id: true,
        note: true,
        status: true,
        stockProcess: true,
        stockRequest: true,
        product: {
          select: {
            name: true,
          },
        },
        sourceBranch: {
          select: {
            name: true,
          },
        },
        destinationBranch: {
          select: {
            name: true,
          },
        },
      },
      where: {
        OR: [
          { destinationBranchId: branchId?.id },
          { sourceBranchId: branchId?.id },
        ],
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const mutationsWithStockAndIndex = mutations.map(
      (mutation: { stockProcess: number | null }, index: number) => {
        return {
          ...mutation,
          no: (pageNumber - 1) * limitNumber + index + 1,
        };
      },
    );

    const totalMutations = await prisma.mutation.count();
    const totalPages = Math.ceil(totalMutations / limitNumber);

    res.status(200).json({
      status: 'success',
      message: 'success get all mutations',
      data: mutationsWithStockAndIndex,
      pagination: {
        totalItems: totalMutations,
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

export async function createMutation(req: Request, res: Response) {
  try {
    const {
      stockRequest,
      stockProcess,
      productId,
      sourceBranchId,
      destinationBranchId,
      note,
    } = req.body;

    const sourceBranch = await prisma.branch.findUnique({
      where: {
        userId: parseInt(sourceBranchId, 10),
      },
    });

    const destinationBranch = await prisma.branch.findUnique({
      where: {
        userId: parseInt(destinationBranchId, 10),
      },
    });

    const mutation = await prisma.mutation.create({
      data: {
        stockRequest: parseInt(stockRequest, 10),
        stockProcess: parseInt(stockProcess, 10 || 0),
        note,
        status: 'PENDING',
        product: {
          connect: {
            id: parseInt(productId, 10),
          },
        },
        sourceBranch: {
          connect: {
            id: sourceBranch?.id ?? 0,
          },
        },
        destinationBranch: {
          connect: {
            id: destinationBranch?.id ?? 0,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Success request mutation',
      data: mutation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function mutation(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const mutation = await prisma.mutation.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      select: {
        id: true,
        note: true,
        status: true,
        stockProcess: true,
        stockRequest: true,
        productId: true,
        sourceBranchId: true,
        destinationBranchId: true,
        sourceBranch: {
          select: {
            name: true,
          },
        },
        destinationBranch: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!mutation) {
      return res.status(404).json({ message: 'Mutation not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'success get mutation',
      data: mutation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function updateMutation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      stockRequest,
      stockProcess,
      productId,
      sourceBranchId,
      destinationBranchId,
      note,
    } = req.body;

    const destinationBranch = await prisma.branch.findUnique({
      where: {
        id: parseInt(destinationBranchId, 10),
      },
    });

    const sourceBranch = await prisma.branch.findUnique({
      where: {
        id: parseInt(sourceBranchId, 10),
      },
    });

    const mutation = await prisma.mutation.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        stockRequest: parseInt(stockRequest, 10),
        stockProcess: parseInt(stockProcess, 10),
        productId: parseInt(productId, 10),
        sourceBranchId: parseInt(sourceBranchId, 10),
        destinationBranchId: destinationBranch?.id,
        note,
        status: 'APPROVED',
      },
    });

    const givenProduct = await prisma.productBranch.findFirst({
      where: {
        productId: parseInt(productId, 10),
        branchId: sourceBranch?.id ?? 0,
      },
    });

    if (!givenProduct) {
      return res.status(404).json({ message: 'Product stock not found' });
    }

    const product = await prisma.productBranch.update({
      where: {
        id: givenProduct.id,
      },
      data: {
        stock: givenProduct.stock - parseInt(stockProcess, 10),
      },
    });

    const checkingProduct = await prisma.productBranch.findFirst({
      where: {
        productId: parseInt(productId, 10),
        branchId: destinationBranch?.id,
      },
    });

    let addProduct;
    if (!checkingProduct) {
      addProduct = await prisma.productBranch.create({
        data: {
          stock: parseInt(stockProcess, 10),
          branch: {
            connect: {
              id: destinationBranch?.id,
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
      addProduct = await prisma.productBranch.update({
        where: {
          id: checkingProduct.id,
        },
        data: {
          stock: checkingProduct.stock + parseInt(stockProcess, 10),
        },
      });
    }

    const productDetails = await prisma.product.findUnique({
      where: {
        id: parseInt(productId, 10),
      },
    });

    const journalIn = await prisma.journalMutation.create({
      data: {
        quantity: parseInt(stockProcess, 10),
        transactionType: 'IN',
        description: `IN ${stockProcess} stock of ${productDetails?.name} from ${sourceBranch?.name} to ${destinationBranch?.name}`,
        productBranch: {
          connect: {
            id: addProduct.id,
          },
        },
      },
    });

    const journalOut = await prisma.journalMutation.create({
      data: {
        quantity: parseInt(stockProcess, 10),
        transactionType: 'OUT',
        description: `OUT ${stockProcess} stock of ${productDetails?.name} from ${sourceBranch?.name} to ${destinationBranch?.name}`,
        productBranch: {
          connect: {
            id: product.id,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Success updating stock',
      data: {
        data: { ...mutation },
        journal: [journalIn, journalOut],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
