// PRISMA SEED - prisma/seed.ts
// ==========================================
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: hashedPassword,
    },
  });

  // Create default categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name_userId: { name: "Food", userId: user.id } },
      update: {},
      create: {
        name: "Food",
        icon: "🍕",
        color: "#EF4444",
        userId: user.id,
        isDefault: true,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: "Transport", userId: user.id } },
      update: {},
      create: {
        name: "Transport",
        icon: "🚗",
        color: "#3B82F6",
        userId: user.id,
        isDefault: true,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: "Shopping", userId: user.id } },
      update: {},
      create: {
        name: "Shopping",
        icon: "🛍️",
        color: "#10B981",
        userId: user.id,
        isDefault: true,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: "Bills", userId: user.id } },
      update: {},
      create: {
        name: "Bills",
        icon: "📋",
        color: "#F59E0B",
        userId: user.id,
        isDefault: true,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: "Entertainment", userId: user.id } },
      update: {},
      create: {
        name: "Entertainment",
        icon: "🎬",
        color: "#8B5CF6",
        userId: user.id,
        isDefault: true,
      },
    }),
  ]);

  // Create demo expenses
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  await Promise.all([
    prisma.expense.create({
      data: {
        amount: 25.5,
        description: "Lunch at cafe",
        date: new Date(thisMonth.getTime() + 1 * 24 * 60 * 60 * 1000),
        categoryId: categories[0].id, // Food
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 12.0,
        description: "Bus fare",
        date: new Date(thisMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
        categoryId: categories[1].id, // Transport
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 89.99,
        description: "Grocery shopping",
        date: new Date(thisMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
        categoryId: categories[2].id, // Shopping
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 150.0,
        description: "Electric bill",
        date: new Date(thisMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
        categoryId: categories[3].id, // Bills
        userId: user.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 15.0,
        description: "Movie ticket",
        date: new Date(thisMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
        categoryId: categories[4].id, // Entertainment
        userId: user.id,
      },
    }),
  ]);

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
