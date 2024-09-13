import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllProducts(req: Request, res: Response) {
  try {
    const { limit = '8', latitude, longitude } = req.query;
    const limitNumber = parseInt(limit as string, 10);

    let whereSearch: any = {};

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const long = parseFloat(longitude as string);

      if (!isNaN(lat) && !isNaN(long)) {
        const nearestBranchResult = await prisma.$queryRaw`
          SELECT id, 
          (
            6371 * acos (
              cos ( radians(${lat}) )
              * cos( radians( latitude ) )
              * cos( radians( longitude ) - radians(${long}) )
              + sin ( radians(${lat}) )
              * sin( radians( latitude ) )
            )
          ) AS distance
          FROM branchs
          ORDER BY distance ASC
          LIMIT 1
        `;

        if (
          Array.isArray(nearestBranchResult) &&
          nearestBranchResult.length > 0
        ) {
          const nearestBranch = nearestBranchResult[0];

          if (nearestBranch && nearestBranch.id) {
            whereSearch = {
              productBranchs: {
                some: {
                  branchId: nearestBranch.id,
                },
              },
            };
          }
        }
      }
    }

    const products = await prisma.product.findMany({
      where: whereSearch,
      take: limitNumber,
    });

    res.status(200).json({
      status: 'success',
      message: 'success',
      data: products,
      nearestBranch: whereSearch.productBranchs?.some?.branchId,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'error' });
  }
}

export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany();

    res.status(200).json({
      status: 'success',
      message: 'success',
      data: categories,
    });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
}

export const getAllListProducts = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const category = req.query.category as string;

    const skip = (page - 1) * limit;

    let whereSearch: any = {};
    let whereSearchWithoutPagination: any = {};

    if (search) {
      const where = {
        OR: [{ name: { contains: search } }],
      };

      whereSearch = { where };
      whereSearchWithoutPagination = { where };
    }

    whereSearch = {
      ...whereSearch,
      skip,
      take: limit,
    };

    const categories = await prisma.category.findMany();

    if (category) {
      const selectedCategory = categories.find(
        (cat) => cat.name.toLowerCase() === category.toLowerCase(),
      );
      if (selectedCategory) {
        const where = { categoryId: selectedCategory.id };
        whereSearch = {
          ...whereSearch,
          where: { ...whereSearch.where, ...where },
        };
        whereSearchWithoutPagination = {
          ...whereSearchWithoutPagination,
          where: { ...whereSearchWithoutPagination.where, ...where },
        };
      }
    }

    const products = await prisma.product.findMany(whereSearch);
    const productCount = await prisma.product.count(
      whereSearchWithoutPagination,
    );

    res.status(200).json({
      status: 'success',
      message: 'success show all products',
      data: products,
      total: Math.ceil(productCount / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export async function products(req: Request, res: Response) {
  try {
    const { search = '', page = '1', limit = '10' } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;

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

export async function product(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'success get product',
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
