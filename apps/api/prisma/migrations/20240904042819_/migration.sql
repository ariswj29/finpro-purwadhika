/*
  Warnings:

  - You are about to drop the column `cartId` on the `orders` table. All the data in the column will be lost.
  - Added the required column `userId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_cartId_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `cartId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
