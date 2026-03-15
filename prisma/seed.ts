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

type CategorySeedItem = (typeof categorySeedItems)[number];
type ServingUnitSeedItem = (typeof servingUnitSeedItems)[number];

interface FoodSeedItem {
  calories: number;
  carbohydrates: number;
  categoryName: CategorySeedItem;
  fat: number;
  fiber: number;
  name: string;
  protein: number;
  servingUnits: Array<{
    grams: number;
    name: ServingUnitSeedItem;
  }>;
  sugar: number;
}

const FOOD_SEED_COUNT = 50;

const foodNamePrefixes = [
  'Bright',
  'Savory',
  'Golden',
  'Fresh',
  'Hearty',
  'Roasted',
  'Crisp',
  'Zesty',
  'Smoky',
  'Velvet',
  'Wild',
  'Sunny',
] as const;

const foodNameSuffixes = [
  'Mix',
  'Bowl',
  'Blend',
  'Medley',
  'Crunch',
  'Plate',
  'Skillet',
  'Prep',
  'Salad',
  'Fusion',
] as const;

const foodNameIngredients: Record<CategorySeedItem, readonly string[]> = {
  Fruits: ['Berry', 'Mango', 'Apple', 'Citrus', 'Melon'],
  Vegetables: ['Spinach', 'Pepper', 'Broccoli', 'Carrot', 'Zucchini'],
  'Whole Grains': ['Oat', 'Quinoa', 'Brown Rice', 'Barley', 'Farro'],
  'Lean Proteins': ['Chicken', 'Turkey', 'Tofu', 'Tempeh', 'Egg White'],
  Dairy: ['Yogurt', 'Kefir', 'Cottage Cheese', 'Milk', 'Skyr'],
  Legumes: ['Lentil', 'Chickpea', 'Black Bean', 'Pea', 'Edamame'],
  'Nuts and Seeds': ['Almond', 'Walnut', 'Chia', 'Pumpkin Seed', 'Cashew'],
  Beverages: ['Tea', 'Smoothie', 'Infusion', 'Shake', 'Juice'],
  Snacks: ['Cracker', 'Bar', 'Bite', 'Popcorn', 'Trail Mix'],
  Seafood: ['Salmon', 'Tuna', 'Shrimp', 'Cod', 'Sardine'],
  'Herbs and Spices': ['Cinnamon', 'Turmeric', 'Basil', 'Paprika', 'Ginger'],
  'Healthy Fats': ['Avocado', 'Olive', 'Tahini', 'Coconut', 'Flax'],
};

const foodNutritionProfiles: Record<
  CategorySeedItem,
  {
    alternateServingUnits: ReadonlyArray<{
      gramsRange: readonly [number, number];
      name: ServingUnitSeedItem;
    }>;
    calories: readonly [number, number];
    carbohydrates: readonly [number, number];
    fat: readonly [number, number];
    fiber: readonly [number, number];
    protein: readonly [number, number];
    sugar: readonly [number, number];
  }
> = {
  Fruits: {
    calories: [45, 90],
    protein: [0.3, 1.8],
    fat: [0.1, 0.8],
    carbohydrates: [10, 24],
    fiber: [1.5, 6],
    sugar: [6, 18],
    alternateServingUnits: [
      { name: 'piece', gramsRange: [80, 180] },
      { name: 'cup', gramsRange: [110, 180] },
    ],
  },
  Vegetables: {
    calories: [18, 55],
    protein: [1, 4.5],
    fat: [0.1, 0.9],
    carbohydrates: [3, 12],
    fiber: [1.5, 7],
    sugar: [1, 6],
    alternateServingUnits: [
      { name: 'cup', gramsRange: [80, 160] },
      { name: 'piece', gramsRange: [60, 140] },
    ],
  },
  'Whole Grains': {
    calories: [110, 190],
    protein: [3, 8],
    fat: [1, 4],
    carbohydrates: [18, 36],
    fiber: [2, 8],
    sugar: [0.2, 3],
    alternateServingUnits: [
      { name: 'cup', gramsRange: [140, 220] },
      { name: 'bowl', gramsRange: [220, 320] },
    ],
  },
  'Lean Proteins': {
    calories: [95, 220],
    protein: [16, 34],
    fat: [1, 12],
    carbohydrates: [0, 8],
    fiber: [0, 2],
    sugar: [0, 3],
    alternateServingUnits: [
      { name: 'piece', gramsRange: [90, 190] },
      { name: 'serving', gramsRange: [100, 180] },
    ],
  },
  Dairy: {
    calories: [60, 180],
    protein: [4, 18],
    fat: [1, 10],
    carbohydrates: [3, 16],
    fiber: [0, 1],
    sugar: [3, 14],
    alternateServingUnits: [
      { name: 'cup', gramsRange: [180, 260] },
      { name: 'serving', gramsRange: [120, 200] },
    ],
  },
  Legumes: {
    calories: [95, 180],
    protein: [6, 14],
    fat: [0.3, 3.5],
    carbohydrates: [16, 30],
    fiber: [5, 12],
    sugar: [0.2, 4],
    alternateServingUnits: [
      { name: 'cup', gramsRange: [140, 220] },
      { name: 'bowl', gramsRange: [200, 300] },
    ],
  },
  'Nuts and Seeds': {
    calories: [450, 680],
    protein: [12, 28],
    fat: [28, 60],
    carbohydrates: [8, 24],
    fiber: [5, 15],
    sugar: [1, 8],
    alternateServingUnits: [
      { name: 'tbsp', gramsRange: [8, 18] },
      { name: 'oz', gramsRange: [20, 32] },
    ],
  },
  Beverages: {
    calories: [0, 120],
    protein: [0, 6],
    fat: [0, 3],
    carbohydrates: [0, 22],
    fiber: [0, 3],
    sugar: [0, 18],
    alternateServingUnits: [
      { name: 'ml', gramsRange: [180, 350] },
      { name: 'cup', gramsRange: [200, 320] },
    ],
  },
  Snacks: {
    calories: [120, 420],
    protein: [2, 15],
    fat: [2, 24],
    carbohydrates: [12, 58],
    fiber: [1, 10],
    sugar: [0.5, 18],
    alternateServingUnits: [
      { name: 'piece', gramsRange: [20, 70] },
      { name: 'serving', gramsRange: [30, 90] },
    ],
  },
  Seafood: {
    calories: [85, 240],
    protein: [16, 30],
    fat: [1, 16],
    carbohydrates: [0, 5],
    fiber: [0, 1],
    sugar: [0, 2],
    alternateServingUnits: [
      { name: 'piece', gramsRange: [70, 180] },
      { name: 'oz', gramsRange: [28, 56] },
    ],
  },
  'Herbs and Spices': {
    calories: [180, 360],
    protein: [3, 12],
    fat: [1, 9],
    carbohydrates: [25, 70],
    fiber: [10, 40],
    sugar: [1, 12],
    alternateServingUnits: [
      { name: 'tsp', gramsRange: [2, 6] },
      { name: 'tbsp', gramsRange: [6, 16] },
    ],
  },
  'Healthy Fats': {
    calories: [320, 900],
    protein: [0, 7],
    fat: [30, 100],
    carbohydrates: [0, 18],
    fiber: [0, 12],
    sugar: [0, 4],
    alternateServingUnits: [
      { name: 'tbsp', gramsRange: [12, 18] },
      { name: 'tsp', gramsRange: [4, 6] },
    ],
  },
};

function createSeededRandom(seed: number) {
  let state = seed;

  return () => {
    const value = Math.sin(state) * 10_000;
    state += 1;
    return value - Math.floor(value);
  };
}

function randomBetween(random: () => number, min: number, max: number, precision = 1) {
  const value = min + random() * (max - min);
  return Number(value.toFixed(precision));
}

function randomFrom<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function buildFoodSeedItems(count: number): FoodSeedItem[] {
  const random = createSeededRandom(20_260_315);
  const usedNames = new Set<string>();
  const foods: FoodSeedItem[] = [];

  while (foods.length < count) {
    const categoryName = randomFrom(categorySeedItems, random);
    const nutritionProfile = foodNutritionProfiles[categoryName];
    const candidateName = `${randomFrom(foodNamePrefixes, random)} ${randomFrom(foodNameIngredients[categoryName], random)} ${randomFrom(foodNameSuffixes, random)}`;

    if (usedNames.has(candidateName)) {
      continue;
    }

    usedNames.add(candidateName);

    const alternateServingUnit = randomFrom(nutritionProfile.alternateServingUnits, random);

    foods.push({
      name: candidateName,
      categoryName,
      calories: randomBetween(random, ...nutritionProfile.calories),
      protein: randomBetween(random, ...nutritionProfile.protein),
      fat: randomBetween(random, ...nutritionProfile.fat),
      carbohydrates: randomBetween(random, ...nutritionProfile.carbohydrates),
      fiber: randomBetween(random, ...nutritionProfile.fiber),
      sugar: randomBetween(random, ...nutritionProfile.sugar),
      servingUnits: [
        { name: 'g', grams: 100 },
        {
          name: alternateServingUnit.name,
          grams: randomBetween(random, ...alternateServingUnit.gramsRange, 0),
        },
      ],
    });
  }

  return foods;
}

const foodSeedItems = buildFoodSeedItems(FOOD_SEED_COUNT);

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

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });
  const categoryIdByName = new Map(categories.map((category) => [category.name, category.id]));

  const servingUnits = await prisma.servingUnit.findMany({
    select: { id: true, name: true },
  });
  const servingUnitIdByName = new Map(
    servingUnits.map((servingUnit) => [servingUnit.name, servingUnit.id])
  );

  for (const food of foodSeedItems) {
    const categoryId = categoryIdByName.get(food.categoryName);

    if (!categoryId) {
      throw new Error(`Missing category for seed item: ${food.categoryName}`);
    }

    const upsertedFood = await prisma.food.upsert({
      where: { name: food.name },
      update: {
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbohydrates: food.carbohydrates,
        fiber: food.fiber,
        sugar: food.sugar,
        categoryId,
      },
      create: {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbohydrates: food.carbohydrates,
        fiber: food.fiber,
        sugar: food.sugar,
        categoryId,
      },
      select: { id: true },
    });

    const foodServingUnits = food.servingUnits.map((servingUnit) => {
      const servingUnitId = servingUnitIdByName.get(servingUnit.name);

      if (!servingUnitId) {
        throw new Error(`Missing serving unit for seed item: ${servingUnit.name}`);
      }

      return {
        foodId: upsertedFood.id,
        servingUnitId,
        grams: servingUnit.grams,
      };
    });

    await prisma.foodServingUnit.deleteMany({
      where: { foodId: upsertedFood.id },
    });

    await prisma.foodServingUnit.createMany({
      data: foodServingUnits,
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
