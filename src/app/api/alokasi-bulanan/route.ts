import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { month } = body;

    const dateObj = new Date(month);

    // Cek apakah dateObj valid
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date received:", month);
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Ambil tanggal terakhir dari bulan yang dikirim
    const lastDayOfMonth = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      0
    );

    lastDayOfMonth.setUTCDate(lastDayOfMonth.getUTCDate() + 1);
    lastDayOfMonth.setUTCHours(0, 0, 0, 0);

    if (!month) {
      return NextResponse.json(
        { message: "Month is required" },
        { status: 400 }
      );
    }

    const data = await prisma.monthlyAllocations.findMany({
      where: {
        date: {
          gte: dateObj,
          lte: lastDayOfMonth,
        },
      },
      select:{
        date: true,
        totalElpiji: true,
        volume: true,
        updatedAt: true,
      },
      orderBy: {
        date: "asc",
      },
    });


    return NextResponse.json(
      { message: "Month received", month, data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
