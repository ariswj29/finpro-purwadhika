import prisma from '@/helpers/prisma';
import { Request, Response } from 'express';

export async function jurnals(req: Request, res: Response) {
  try {
    const { search = '', page = '1', limit = '10', userId } = req.query;
    console.log(userId, 'userId');

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;

    const branch = await prisma.branch.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    const whereClause =
      branch && branch.id
        ? {
            productBranch: {
              branchId: Number(branch.id),
            },
          }
        : {};

    const journals = await prisma.journalMutation.findMany({
      where: whereClause,
      select: {
        id: true,
        quantity: true,
        transactionType: true,
        description: true,
        createdAt: true,
        productBranch: {
          select: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const journalsWithIndex = journals.map(
      (
        journal: {
          id: number;
          quantity: number;
          transactionType: string;
          description: string;
        },
        index: number,
      ) => ({
        ...journal,
        no: (pageNumber - 1) * limitNumber + index + 1,
      }),
    );

    const totalJournal = await prisma.journalMutation.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(totalJournal / limitNumber);

    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched all journals',
      data: journalsWithIndex,
      pagination: {
        totalItems: totalJournal,
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
