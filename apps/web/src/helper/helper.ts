import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Cookies from 'js-cookie';

export const totalPrice = (price: number, shipping: number) => {
  const money = price + shipping;
  const format = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(money);

  return format.replace('Rp', 'Rp.');
};

export const formattedDate = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: idLocale });
};

export const formattedDateAndHour = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy HH:mm', { locale: idLocale });
};

export const formattedMoney = (money: number) => {
  const format = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(money);

  return format.replace('Rp', 'Rp.');
};

export const getCookies = () => {
  const token = Cookies.get('token') || '';
  const userId = Cookies.get('userId') || 0;
  const user = Cookies.get('user') || '';
  const latitude = Cookies.get('latitude') || 0;
  const longitude = Cookies.get('longitude') || 0;
  const nearestBranch = Cookies.get('nearestBranch') || 0;

  return { token, userId, user, latitude, longitude, nearestBranch };
};
