/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodServingUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealFood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServingUnit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_mealId_fkey";

-- DropForeignKey
ALTER TABLE "FoodServingUnit" DROP CONSTRAINT "FoodServingUnit_foodId_fkey";

-- DropForeignKey
ALTER TABLE "FoodServingUnit" DROP CONSTRAINT "FoodServingUnit_servingUnitId_fkey";

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_userId_fkey";

-- DropForeignKey
ALTER TABLE "MealFood" DROP CONSTRAINT "MealFood_foodId_fkey";

-- DropForeignKey
ALTER TABLE "MealFood" DROP CONSTRAINT "MealFood_mealId_fkey";

-- DropForeignKey
ALTER TABLE "MealFood" DROP CONSTRAINT "MealFood_servingUnitId_fkey";

-- DropForeignKey
ALTER TABLE "ServingUnit" DROP CONSTRAINT "ServingUnit_foodId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Food";

-- DropTable
DROP TABLE "FoodServingUnit";

-- DropTable
DROP TABLE "Meal";

-- DropTable
DROP TABLE "MealFood";

-- DropTable
DROP TABLE "ServingUnit";

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "carbohydrates" DOUBLE PRECISION,
    "fiber" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "mealId" INTEGER,

    CONSTRAINT "food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servingUnit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "foodId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servingUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foodServingUnit" (
    "id" SERIAL NOT NULL,
    "foodId" INTEGER NOT NULL,
    "servingUnitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "grams" DOUBLE PRECISION,

    CONSTRAINT "foodServingUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mealFood" (
    "id" SERIAL NOT NULL,
    "foodId" INTEGER NOT NULL,
    "mealId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "servingUnitId" INTEGER NOT NULL,

    CONSTRAINT "mealFood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "food_name_key" ON "food"("name");

-- CreateIndex
CREATE UNIQUE INDEX "servingUnit_name_key" ON "servingUnit"("name");

-- AddForeignKey
ALTER TABLE "food" ADD CONSTRAINT "food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food" ADD CONSTRAINT "food_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servingUnit" ADD CONSTRAINT "servingUnit_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodServingUnit" ADD CONSTRAINT "foodServingUnit_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodServingUnit" ADD CONSTRAINT "foodServingUnit_servingUnitId_fkey" FOREIGN KEY ("servingUnitId") REFERENCES "servingUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mealFood" ADD CONSTRAINT "mealFood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mealFood" ADD CONSTRAINT "mealFood_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mealFood" ADD CONSTRAINT "mealFood_servingUnitId_fkey" FOREIGN KEY ("servingUnitId") REFERENCES "servingUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
