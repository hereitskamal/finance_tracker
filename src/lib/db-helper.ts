// ==========================================
// DATABASE HELPERS - src/lib/db-helpers.ts
// ==========================================
import { prisma } from "./db";

export async function getUserExpenseStats(userId: string) {
  const [totalExpenses, totalAmount, categoriesCount] = await Promise.all([
    prisma.expense.count({
      where: { userId },
    }),
    prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.category.count({
      where: { userId },
    }),
  ]);

  return {
    totalExpenses,
    totalAmount: totalAmount._sum.amount || 0,
    categoriesCount,
  };
}

export async function getMonthlySpending(
  userId: string,
  year: number,
  month: number,
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const result = await prisma.expense.aggregate({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: { amount: true },
    _count: true,
  });

  return {
    amount: result._sum.amount || 0,
    count: result._count,
    period: { startDate, endDate },
  };
}

export async function getCategorySpending(
  userId: string,
  startDate?: Date,
  endDate?: Date,
) {
  const result = await prisma.expense.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      ...(startDate &&
        endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
    },
    _sum: { amount: true },
    _count: true,
  });

  // Get category details
  const categoryIds = result.map((r: { categoryId: unknown; }) => r.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true, icon: true, color: true },
  });

  return result.map((item: { categoryId: unknown; _sum: { amount: unknown; }; _count: unknown; }) => {
    const category = categories.find((cat: { id: unknown; }) => cat.id === item.categoryId);
    return {
      categoryId: item.categoryId,
      categoryName: category?.name || "Unknown",
      categoryIcon: category?.icon || "📝",
      categoryColor: category?.color || "#3B82F6",
      amount: item._sum.amount || 0,
      count: item._count,
    };
  });
}

export async function deleteUserExpenses(userId: string, expenseIds: string[]) {
  // Verify all expenses belong to the user
  const userExpenses = await prisma.expense.findMany({
    where: {
      id: { in: expenseIds },
      userId,
    },
    select: { id: true },
  });

  if (userExpenses.length !== expenseIds.length) {
    throw new Error("Some expenses don't belong to the user");
  }

  // Delete expenses
  return await prisma.expense.deleteMany({
    where: {
      id: { in: expenseIds },
      userId,
    },
  });
}
