import { Role } from '@/app/(dashboard)/_types/nav';
import { auth } from '@/server/auth';
import { prisma } from '@/server/prisma';

const categorySeedItems = [
  'Fruits',
  'Vegetables',
  'Grains',
  'Protein',
  'Dairy',
  'Legumes',
  'Nuts and Seeds',
  'Beverages',
  'Snacks',
  'Oils and Fats',
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

  console.log(
    `Seeded ${categorySeedItems.length} categories and ${servingUnitSeedItems.length} serving units`
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
