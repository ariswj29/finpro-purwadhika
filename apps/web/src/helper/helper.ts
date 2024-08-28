import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export const totalPrice = (price: number, discount: number, points: number) => {
  const discountPrice = price - price * (discount / 100);
  const totalPrice = discountPrice - points;
  totalPrice < 0 ? 0 : totalPrice;

  return totalPrice;
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
