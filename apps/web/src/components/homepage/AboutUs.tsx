'use client';

import Image from 'next/image';
import React from 'react';

const AboutUs = () => {
  return (
    <section className="max-w-screen-xl mx-auto p-4 items-center">
      <div className="flex flex-col md:flex-row items-center md:justify-between">
        <div className="mb-6 md:mb-0 md:w-1/2 flex justify-center">
          <Image
            src={'/aboutUs.png'}
            alt="about_us"
            width={500}
            height={300}
            className="w-full h-auto"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center px-4 md:px-0">
          <h2 className="text-[#909090] text-base md:text-xl lg:text-3xl font-medium mb-2">
            About Us
          </h2>
          <h1 className="text-black text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-8">
            Groceria
          </h1>
          <div className="mb-8"></div>
          <div className="px-0">
            <p className="text-black text-sm md:text-base lg:text-xl mb-3 md:mb-6">
              Groceria is an online marketplace offering a wide range of fresh
              groceries, including vegetables, fruits, meats, fish, frozen
              foods, spices, and various dry goods. We are committed to
              delivering the highest quality products directly to your kitchen,
              ensuring that everything you buy is fresh and healthy.
            </p>
            <p className="text-black text-sm md:text-base lg:text-xl">
              Since our launch in 2012, Groceria has served thousands of
              customers across various cities. We continue to grow with a focus
              on customer satisfaction, making grocery shopping easier, faster,
              and more convenient. With Groceria, your grocery needs are met
              with practicality and ease, all from the comfort of your home.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
