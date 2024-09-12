import { Request, Response } from 'express';
import axios from 'axios';
import { RAJAONGKIR_API_KEY } from '@/config';

export const shippingCost = async (req: Request, res: Response) => {
  const { courier, destination, origin, weight } = req.body;
  console.log(req.body, 'body');

  // Validasi apakah semua parameter yang dibutuhkan ada
  if (!courier || !destination || !origin || !weight) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  // try {
  // Melakukan request ke API Raja Ongkir
  const response = await axios.post(
    'https://api.rajaongkir.com/starter/cost',
    {
      origin: origin.toString(), // pastikan ini string
      destination: destination.toString(), // pastikan ini string
      weight: Number(weight), // pastikan ini number
      courier: courier.toLowerCase(), // pastikan ini string
    },
    {
      headers: {
        key: RAJAONGKIR_API_KEY,
        'Content-Type': 'application/json',
      },
    },
  );
  console.log(response.data, 'res ongkir');
  // Memproses hasil dari API Raja Ongkir
  const results: any[] = response.data.rajaongkir.results;

  const transformedResults = results.map((result: any) => {
    return result.costs.map((cost: any) => ({
      code: result.code,
      name: result.name,
      service: cost.service,
      description: cost.description,
      value: cost.cost[0].value,
      etd: cost.cost[0].etd,
      note: cost.cost[0].note,
    }));
  })[0];

  // Mengirim hasil ke frontend
  return res.status(200).json({
    status: 'success',
    message: 'Success to fetch shipping cost',
    data: transformedResults,
  });
  // } catch (error: any) {
  //   console.error('Failed to fetch shipping cost:', error.message);
  //   return res.status(500).json({ error: 'Failed to fetch shipping cost' });
  // }
};
