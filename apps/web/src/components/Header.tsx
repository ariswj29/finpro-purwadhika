'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { navbars, navbarsAuth } from '@/data/data';
import { FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { getCount } from '@/api/wishlist';

export const Header = (props: any) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const res = await getCount();

      setWishlistCount(res.data.wishlist);
      setCartCount(res.data.cart);
    };

    fetchCounts();
  }, [setWishlistCount, setCartCount]);

  return (
    <header className="grid md:grid-cols-3 grid-cols-2 md:px-40 px-4 items-center justify-between bg-black sticky top-0 z-50 text-white">
      <div className=" py-2">
        <Link href="/">
          <Image src="/logo-white.png" alt="Groceria" width={150} height={25} />
        </Link>
      </div>
      <div className="md:hidden md:col-span-1 sm:col-span-1 py-6 justify-self-end">
        <button
          className="flex items-center rounded border-2 border-black px-3 py-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-3 w-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className={`${isMenuOpen ? 'col-span-2 md:col-span-1' : 'hidden'} md:block py-4`}
      >
        <nav>
          <ul className="grid md:grid-cols-3 md:gap-0 gap-4">
            {props.token === undefined
              ? navbars.map((navbar) => (
                  <li key={navbar.id} className="text-center">
                    <Link
                      href={navbar.link}
                      className={
                        pathname === navbar.link ? 'active' : 'nav-link'
                      }
                    >
                      {navbar.title}
                    </Link>
                  </li>
                ))
              : navbarsAuth.map((navbar) => (
                  <li key={navbar.id} className="text-center">
                    <Link
                      href={navbar.link}
                      className={
                        pathname === navbar.link ? 'active' : 'nav-link'
                      }
                    >
                      {navbar.title}
                    </Link>
                  </li>
                ))}
          </ul>
        </nav>
      </div>
      <div className="flex gap-6 justify-self-end items-center">
        <Link href={'/login'}>
          <div className="flex gap-2">
            <Image src="/user.png" alt="user" width={35} height={18} />
            <div className="text-xs">
              {' '}
              Hello, <br /> Sign In{' '}
            </div>
          </div>
        </Link>
        <div className="relative">
          <Link href={'/wishlist'}>
            <FaRegHeart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 left-4 mt-[-5px] rounded-full bg-red-500 text-white text-xs px-2">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>
        <div className="relative">
          <Link href={'/cart'}>
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 left-4 mt-[-5px] rounded-full bg-red-500 text-white text-xs px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
