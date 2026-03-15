import { Role } from '@/app/(dashboard)/_types/nav';
import { auth } from '@/server/auth';
import { prisma } from '@/server/prisma';

const categorySeedItems = [
  'Fruits',
  'Vegetables',
  'Whole Grains',
  'Lean Proteins',
  'Dairy',
  'Legumes',
  'Nuts and Seeds',
  'Beverages',
  'Snacks',
  'Seafood',
  'Herbs and Spices',
  'Healthy Fats',
] as const;

const servingUnitSeedItems = [
  'g',
  'kg',
  'ml',
  'l',
  'cup',
  'tbsp',
  'tsp',
  'piece',
  'slice',
  'oz',
  'bowl',
  'serving',
] as const;

const foodSeedItems = [
  {
    name: 'Blueberries',
    categoryName: 'Fruits',
    calories: 57,
    protein: 0.7,
    fat: 0.3,
    carbohydrates: 14.5,
    fiber: 2.4,
    sugar: 10,
  },
  {
    name: 'Spinach',
    categoryName: 'Vegetables',
    calories: 23,
    protein: 2.9,
    fat: 0.4,
    carbohydrates: 3.6,
    fiber: 2.2,
    sugar: 0.4,
  },
  {
    name: 'Quinoa',
    categoryName: 'Whole Grains',
    calories: 120,
    protein: 4.4,
    fat: 1.9,
    carbohydrates: 21.3,
    fiber: 2.8,
    sugar: 0.9,
  },
  {
    name: 'Chicken Breast',
    categoryName: 'Lean Proteins',
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbohydrates: 0,
    fiber: 0,
    sugar: 0,
  },
  {
    name: 'Greek Yogurt',
    categoryName: 'Dairy',
    calories: 97,
    protein: 9,
    fat: 5,
    carbohydrates: 3.9,
    fiber: 0,
    sugar: 3.6,
  },
  {
    name: 'Black Beans',
    categoryName: 'Legumes',
    calories: 132,
    protein: 8.9,
    fat: 0.5,
    carbohydrates: 23.7,
    fiber: 8.7,
    sugar: 0.3,
  },
  {
    name: 'Almonds',
    categoryName: 'Nuts and Seeds',
    calories: 579,
    protein: 21.2,
    fat: 49.9,
    carbohydrates: 21.6,
    fiber: 12.5,
    sugar: 4.4,
  },
  {
    name: 'Green Tea',
    categoryName: 'Beverages',
    calories: 2,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    fiber: 0,
    sugar: 0,
  },
  {
    name: 'Rice Cakes',
    categoryName: 'Snacks',
    calories: 387,
    protein: 8.1,
    fat: 3.3,
    carbohydrates: 81.5,
    fiber: 4.2,
    sugar: 0.3,
  },
  {
    name: 'Salmon Fillet',
    categoryName: 'Seafood',
    calories: 208,
    protein: 20,
    fat: 13,
    carbohydrates: 0,
    fiber: 0,
    sugar: 0,
  },
  {
    name: 'Cinnamon',
    categoryName: 'Herbs and Spices',
    calories: 247,
    protein: 4,
    fat: 1.2,
    carbohydrates: 80.6,
    fiber: 53.1,
    sugar: 2.2,
  },
  {
    name: 'Avocado Oil',
    categoryName: 'Healthy Fats',
    calories: 884,
    protein: 0,
    fat: 100,
    carbohydrates: 0,
    fiber: 0,
    sugar: 0,
  },
] as const;

const mealSeedItems = [
  new Date('2026-01-03T07:30:00.000Z'),
  new Date('2026-01-03T12:15:00.000Z'),
  new Date('2026-01-03T18:45:00.000Z'),
  new Date('2026-01-04T08:00:00.000Z'),
  new Date('2026-01-04T12:30:00.000Z'),
  new Date('2026-01-04T19:00:00.000Z'),
  new Date('2026-01-05T07:15:00.000Z'),
  new Date('2026-01-05T13:00:00.000Z'),
  new Date('2026-01-05T18:30:00.000Z'),
  new Date('2026-01-06T07:45:00.000Z'),
  new Date('2026-01-06T12:10:00.000Z'),
  new Date('2026-01-06T19:20:00.000Z'),
] as const;

export async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'super@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${existingAdmin.email}`);
    } else {
      const admin = await auth.api.createUser({
        body: {
          name: 'Admin', // required
          email: adminEmail, // required
          password: adminPassword, // required
          role: Role.ADMIN,
        },
      });

      console.log(`Created admin user: ${admin.user.name} ${admin.user.email}`);
    }
  } else {
    console.warn('ADMIN_PASSWORD env var is missing, skipping admin user seed');
  }

  for (const name of categorySeedItems) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const name of servingUnitSeedItems) {
    await prisma.servingUnit.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const food of foodSeedItems) {
    const category = await prisma.category.findUnique({
      where: { name: food.categoryName },
      select: { id: true },
    });

    await prisma.food.upsert({
      where: { name: food.name },
      update: {
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbohydrates: food.carbohydrates,
        fiber: food.fiber,
        sugar: food.sugar,
        categoryId: category?.id,
      },
      create: {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbohydrates: food.carbohydrates,
        fiber: food.fiber,
        sugar: food.sugar,
        categoryId: category?.id,
      },
    });
  }

  for (const dateTime of mealSeedItems) {
    const existingMeal = await prisma.meal.findFirst({
      where: { dateTime },
      select: { id: true },
    });

    if (!existingMeal) {
      await prisma.meal.create({
        data: { dateTime },
      });
    }
  }

  console.log(
    `Seeded ${categorySeedItems.length} categories, ${foodSeedItems.length} foods, ${mealSeedItems.length} meals, and ${servingUnitSeedItems.length} serving units`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
