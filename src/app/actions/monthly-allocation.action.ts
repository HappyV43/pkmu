import prisma from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";

export const getDefaultMonthlyData = async () => {
  const start = startOfMonth(new Date()); // Awal bulan (misal: 2025-03-01)
  const end = endOfMonth(new Date());
  const data = await prisma.monthlyAllocations.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    select: {
      date: true,
      totalElpiji: true,
      volume: true,
      updatedAt: true,
    },
    orderBy: {
      date: "asc",
    },
    take: 31,
  });
  return data;
};
