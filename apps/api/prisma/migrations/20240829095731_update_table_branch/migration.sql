/*
  Warnings:

  - You are about to drop the column `productWarehouseId` on the `journal_mutations` table. All the data in the column will be lost.
  - You are about to drop the column `refMutationId` on the `journal_mutations` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `journal_mutations` table. All the data in the column will be lost.
  - You are about to drop the column `destinationWarehouseId` on the `mutations` table. All the data in the column will be lost.
  - You are about to drop the column `sourceWarehouseId` on the `mutations` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `product_warehouses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productBranchId` to the `journal_mutations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationBranchId` to the `mutations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceBranchId` to the `mutations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `journal_mutations` DROP FOREIGN KEY `journal_mutations_productWarehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `journal_mutations` DROP FOREIGN KEY `journal_mutations_refMutationId_fkey`;

-- DropForeignKey
ALTER TABLE `journal_mutations` DROP FOREIGN KEY `journal_mutations_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `mutations` DROP FOREIGN KEY `mutations_destinationWarehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `mutations` DROP FOREIGN KEY `mutations_sourceWarehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `product_warehouses` DROP FOREIGN KEY `product_warehouses_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product_warehouses` DROP FOREIGN KEY `product_warehouses_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `warehouses` DROP FOREIGN KEY `warehouses_cityId_fkey`;

-- DropForeignKey
ALTER TABLE `warehouses` DROP FOREIGN KEY `warehouses_provinceId_fkey`;

-- DropForeignKey
ALTER TABLE `warehouses` DROP FOREIGN KEY `warehouses_userId_fkey`;

-- AlterTable
ALTER TABLE `journal_mutations` DROP COLUMN `productWarehouseId`,
    DROP COLUMN `refMutationId`,
    DROP COLUMN `warehouseId`,
    ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `mutationId` INTEGER NULL,
    ADD COLUMN `productBranchId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mutations` DROP COLUMN `destinationWarehouseId`,
    DROP COLUMN `sourceWarehouseId`,
    ADD COLUMN `destinationBranchId` INTEGER NOT NULL,
    ADD COLUMN `sourceBranchId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `warehouseId`,
    ADD COLUMN `branchId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `product_warehouses`;

-- DropTable
DROP TABLE `warehouses`;

-- CreateTable
CREATE TABLE `branchs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `provinceId` INTEGER NOT NULL,
    `cityId` INTEGER NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branchs_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_branchs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stock` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `branchId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `product_branchs_productId_branchId_key`(`productId`, `branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branchs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branchs` ADD CONSTRAINT `branchs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branchs` ADD CONSTRAINT `branchs_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branchs` ADD CONSTRAINT `branchs_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_branchs` ADD CONSTRAINT `product_branchs_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branchs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_branchs` ADD CONSTRAINT `product_branchs_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutations` ADD CONSTRAINT `mutations_sourceBranchId_fkey` FOREIGN KEY (`sourceBranchId`) REFERENCES `branchs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutations` ADD CONSTRAINT `mutations_destinationBranchId_fkey` FOREIGN KEY (`destinationBranchId`) REFERENCES `branchs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_mutations` ADD CONSTRAINT `journal_mutations_productBranchId_fkey` FOREIGN KEY (`productBranchId`) REFERENCES `product_branchs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_mutations` ADD CONSTRAINT `journal_mutations_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branchs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_mutations` ADD CONSTRAINT `journal_mutations_mutationId_fkey` FOREIGN KEY (`mutationId`) REFERENCES `mutations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
