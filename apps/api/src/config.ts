import { config } from 'dotenv';
import { resolve } from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const SALT = parseInt(process.env.SALT || '10');
export const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || 'my-secret';
export const RAJAONGKIR_API_URL = process.env.RAJAONGKIR_API_URL || 'my-secret';
