import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const body = await req.json();

    const { from, to } = body;

    const fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if (!fromDate && !toDate) {
      // Kalau dari dan ke sama-sama null, ambil semua data
      console.log("Ambil semua data tanpa filter tanggal");
    } else if (fromDate && !toDate) {
      // Kalau cuma ada fromDate, set toDate ke akhir hari itu
      toDate = new Date(fromDate);
      toDate.setHours(23, 59, 59, 999);
    } else {
      // Kalau ada kedua tanggal, set jam dari toDate ke akhir hari
      fromDate?.setHours(0, 0, 0, 0);
      toDate?.setHours(23, 59, 59, 999);
    }

    console.log(fromDate, toDate);

    const [dailySummary, distributionSummary, monthlyData, uniqueDate] =
      await prisma.$transaction([
        prisma.allocations.aggregate({
          _sum: { allocatedQty: true },
          _count: { allocatedQty: true },
          where: fromDate && toDate ? { giDate: { gte: fromDate, lte: toDate } } : {},
          orderBy: { plannedGiDate: "asc" },
        }),
        prisma.lpgDistributions.aggregate({
          _sum: { distributionQty: true },
          _count: { distributionQty: true },
          where: fromDate && toDate ? { giDate: { gte: fromDate, lte: toDate } } : {},
          orderBy: { giDate: "asc" },
        }),
        prisma.monthlyAllocations.aggregate({
          _sum: { totalElpiji: true },
          _count: { totalElpiji: true },
          where: fromDate && toDate ? { date: { gte: fromDate, lte: toDate } } : {},
          orderBy: { date: "asc" },
        }),
        prisma.lpgDistributions.findMany({
          distinct: ["giDate"],
          select: {
            giDate: true,
          },
          where: fromDate && toDate ? { giDate: { gte: fromDate, lte: toDate } } : {},
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
