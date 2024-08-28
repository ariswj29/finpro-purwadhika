import { Prisma, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { categories } from './data/categories';
import { products } from './data/products';
import axios from 'axios';
import { users } from './data/users';
import { SALT, RAJAONGKIR_API_KEY, RAJAONGKIR_API_URL } from '../src/config';

const prisma = new PrismaClient();

const hashedPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(Number(SALT));
  return bcrypt.hashSync(password, salt);
};

const fetchProvinces = async () => {
  const response = await axios.get(`${RAJAONGKIR_API_URL}/province`, {
    headers: {
      key: RAJAONGKIR_API_KEY,
    },
  });
  return response.data.rajaongkir.results;
};

const fetchCities = async () => {
  const response = await axios.get(`${RAJAONGKIR_API_URL}/city`, {
    headers: {
      key: RAJAONGKIR_API_KEY,
    },
  });
  return response.data.rajaongkir.results;
};

const seedUsers = async () => {
  for (const user of users) {
    const userData: Prisma.UserCreateInput = {
      ...user,
      password: hashedPassword(user.password),
      role: user.role as Role,
    };
    await prisma.user.create({ data: userData });
  }
};

const seedCategories = async () => {
  for (const category of categories) {
    const categoryData: Prisma.CategoryCreateInput = {
      ...category,
    };
    await prisma.category.create({ data: categoryData });
  }
};

const seedProducts = async () => {
  for (const product of products) {
    const productData: Prisma.ProductCreateInput = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: { connect: { id: product.categoryId } },
    };
    await prisma.product.create({ data: productData });
  }
};

const seedProvinces = async (provinces: any[]) => {
  for (const province of provinces) {
    const data: Prisma.ProvinceCreateInput = {
      id: Number(province.province_id),
      name: province.province,
    };
    await prisma.province.create({
      data,
    });
  }
};

const seedCities = async (cities: any[]) => {
  for (const city of cities) {
    const data: Prisma.CityCreateInput = {
      id: Number(city.city_id),
      name: city.city_name,
      province: {
        connect: {
          id: Number(city.province_id),
        },
      },
    };
    await prisma.city.create({
      data,
    });
  }
};

const seed = async () => {
  try {
    const provinces = await fetchProvinces();
    const cities = await fetchCities();

    await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedProvinces(provinces);
    await seedCities(cities);
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
