// import { logoutProcess } from '@/api/auth';
import {
  FaLinkedin,
  FaSquareEnvelope,
  FaSquareFacebook,
  FaSquareWhatsapp,
} from 'react-icons/fa6';
import { id } from 'date-fns/locale';

export const navbars = [
  {
    id: 1,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    title: 'Products',
    link: '/products',
  },
  {
    id: 3,
    title: 'Contact',
    link: '/contact',
  },
];

export const sidebarSuperadmin = [
  {
    id: 1,
    title: 'Dashboard',
    link: '/admin/dashboard',
  },
  {
    id: 2,
    title: 'Products',
    link: '/admin/products',
  },
  {
    id: 7,
    title: 'Category Products',
    link: '/admin/category-products',
  },
  {
    id: 3,
    title: 'Orders',
    link: '/admin/orders',
  },
  {
    id: 4,
    title: 'Stores',
    link: '/admin/stores',
  },
  {
    id: 6,
    title: 'Inventory',
    link: '/admin/select-inventory',
  },
  // {
  //   id: 9,
  //   title: 'Mutation',
  //   link: '/admin/mutation',
  // },
  {
    id: 8,
    title: 'Journal',
    link: '/admin/journal',
  },
  {
    id: 5,
    title: 'Users',
    link: '/admin/users',
  },
];

export const sidebarAdmin = [
  {
    id: 1,
    title: 'Dashboard',
    link: '/admin/dashboard',
  },
  {
    id: 2,
    title: 'Products',
    link: '/admin/products',
  },
  {
    id: 7,
    title: 'Category Products',
    link: '/admin/category-products',
  },
  {
    id: 3,
    title: 'Orders',
    link: '/admin/orders',
  },
  {
    id: 4,
    title: 'Inventory',
    link: '/admin/inventory',
  },
  {
    id: 9,
    title: 'Mutation',
    link: '/admin/mutation',
  },
  {
    id: 8,
    title: 'Journal',
    link: '/admin/journal',
  },
];

export const menuProfiles = [
  {
    id: 1,
    title: 'Profile',
    link: '/profile',
  },
  {
    id: 2,
    title: 'Address',
    link: '/profile/address',
  },
  {
    id: 3,
    title: 'Order List',
    link: '/profile/order-list',
  },
  {
    id: 4,
    title: 'Order Complete',
    link: '/profile/order-complete',
  },
];

export const sliders = [
  {
    id: 1,
    image: '/hero section/slider-1.png',
  },
  {
    id: 2,
    image: '/hero section/slider-2.png',
  },
  {
    id: 2,
    image: '/hero section/slider-3.png',
  },
];

export const banks = [
  {
    id: 1,
    name: 'BCA',
    image: '/banks/bca.png',
  },
  {
    id: 2,
    name: 'BNI',
    image: '/banks/bni.png',
  },
  {
    id: 3,
    name: 'BRI',
    image: '/banks/bri.png',
  },
  {
    id: 4,
    name: 'Mandiri',
    image: '/banks/mandiri.png',
  },
  {
    id: 5,
    name: 'Gopay',
    image: '/banks/gopay.png',
  },
];

export const couriers = [
  {
    id: 'jne',
    name: 'JNE',
  },
  {
    id: 'tiki',
    name: 'TIKI',
  },
  {
    id: 'pos',
    name: 'POS Indonesia',
  },
];

export const socialMedia = [
  {
    id: 1,
    icon: <FaSquareEnvelope size={40} />,
    link: `mailto:?subject&body`,
  },
  {
    id: 2,
    icon: <FaSquareFacebook size={40} />,
    link: `https://www.facebook.com/`,
  },
  {
    id: 3,
    icon: <FaLinkedin size={40} />,
    link: `https://www.linkedin.com/`,
  },
  {
    id: 4,
    icon: <FaSquareWhatsapp size={40} />,
    link: `https://api.whatsapp.com/send?text`,
  },
];
