import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const body = await req.json();

    const { from, to } = body;

    let fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if (fromDate) {
      fromDate.setUTCHours(0, 0, 0, 0);
    }

    if (toDate) {
      toDate.setUTCHours(23, 59, 59, 999);
    } else if (fromDate && !toDate) {
      // Kalau hanya ada fromDate, set toDate ke akhir hari yang sama
      toDate = new Date(fromDate);
      toDate.setUTCHours(23, 59, 59, 999);
    }

    const dateFilter = fromDate && toDate ? { gte: fromDate, lte: toDate } : {};

    console.log("fromDate:", fromDate);
    console.log("toDate:", toDate);

    const [dailySummary, distributionSummary, monthlyData, uniqueDate] =
      await prisma.$transaction([
        prisma.allocations.aggregate({
          _sum: { allocatedQty: true },
          _count: { allocatedQty: true },
          where: { giDate: dateFilter },
          orderBy: { plannedGiDate: "asc" },
        }),
        prisma.lpgDistributions.aggregate({
          _sum: { distributionQty: true },
          _count: { distributionQty: true },
          where: { giDate: dateFilter },
          orderBy: { giDate: "asc" },
        }),
        prisma.monthlyAllocations.aggregate({
          _sum: { totalElpiji: true },
          _count: { totalElpiji: true },
          where: { date: dateFilter },
          orderBy: { date: "asc" },
        }),
        prisma.lpgDistributions.findMany({
          distinct: ["giDate"],
          select: {
            giDate: true,
          },
          where: { giDate: dateFilter },
          orderBy: {
            giDate: "asc",
          },
        }),
      ]);

    console.log(monthlyData);

    const totalProps = uniqueDate.reduce(
      (a, obj) => a + Object.keys(obj).length,
      0
    );

    const dailyAllo = dailySummary._sum?.allocatedQty;
    const dailyDistri = distributionSummary._sum?.distributionQty;
    const dailyMonthly = monthlyData._sum?.totalElpiji;

    const pending =
      (dailyAllo ?? 0) > (dailyDistri ?? 0)
        ? (dailyAllo ?? 0) - (dailyDistri ?? 0)
        : 0;

    const fakultatif =
      (dailyAllo ?? 0) > (dailyMonthly ?? 0)
        ? (dailyAllo ?? 0) - (dailyMonthly ?? 0)
        : 0;

    const tidakTembus =
      (dailyMonthly ?? 0) > (dailyAllo ?? 0)
        ? (dailyMonthly ?? 0 ?? 0) - (dailyAllo ?? 0)
        : 0;

    const average = ((dailyAllo ?? 0) / (totalProps || 1)).toFixed(2);

    // Contoh response
    return NextResponse.json(
      {
        message: "Date range received",
        dailySummary,
        distributionSummary,
        monthlyData,
        pending,
        fakultatif,
        tidakTembus,
        average,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
