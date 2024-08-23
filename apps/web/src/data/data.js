import { logoutProcess } from '@/api/auth';

export const navbars = [
  {
    id: 1,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    title: 'Login',
    link: '/login',
  },
  {
    id: 3,
    title: 'Register',
    link: '/register',
  },
];

export const navbarsAuth = [
  {
    id: 1,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    title: 'Profile',
    link: '/profile',
  },
];

export const sidebars = [
  {
    id: 1,
    title: 'Dashboard',
    link: '/admin/dashboard',
  },
  {
    id: 2,
    title: 'Events',
    link: '/admin/events',
  },
  {
    id: 3,
    title: 'Promotions',
    link: '/admin/promotions',
  },
  {
    id: 4,
    title: 'Review',
    link: '/admin/review',
  },
  {
    id: 5,
    title: 'Transactions',
    link: '/admin/transactions',
  },
  {
    id: 6,
    title: 'Users',
    link: '/admin/users',
  },
];

export const profiles = [
  {
    id: 1,
    title: 'Edit Profile',
    link: '#edit-profile',
  },
  {
    id: 2,
    title: 'Your Saldo',
    link: '#points',
  },
  {
    id: 3,
    title: 'Your Transactions',
    link: '#transactions',
  },
];
