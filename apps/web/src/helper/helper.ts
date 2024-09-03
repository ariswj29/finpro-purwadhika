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
  const userId = Cookies.get('userId') || '';
  const user = Cookies.get('user') || '';

  return { token, userId, user };
};
