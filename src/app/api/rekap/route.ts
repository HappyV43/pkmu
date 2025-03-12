import prisma from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentName, deliveryNumber, range } = body;

    const whereConditions: any = {};
    let fromDate = range.from ? new Date(range.from) : null;
    let toDate = range.to ? new Date(range.to) : null;

    if (agentName) {
      whereConditions.agentName = {
        equals: agentName,
        mode: "insensitive",
      };
    }

    if (deliveryNumber) {
      whereConditions.deliveryNumber = {
        equals: deliveryNumber,
        mode: "insensitive",
      };
    }

    if (fromDate) {
      const start = new Date(fromDate);
      if (isNaN(start.getTime())) {
        return NextResponse.json(
          { message: "Invalid date format" },
          { status: 400 }
        );
      }
      whereConditions.giDate = {
        gte: new Date(start.setHours(0, 0, 0, 0)),
      };
    }

    if (toDate) {
      const end = new Date(toDate);
      if (isNaN(end.getTime())) {
        return NextResponse.json(
          { message: "Invalid date format" },
          { status: 400 }
        );
      }
      whereConditions.giDate = {
        ...whereConditions.giDate,
        lte: new Date(end.setHours(23, 59, 59, 999)),
      };
    } else if (fromDate && !toDate) {
      // Jika hanya ada fromDate, ambil data untuk hari itu saja
      whereConditions.giDate = {
        gte: new Date(fromDate.setHours(0, 0, 0, 0)),
        lte: new Date(fromDate.setHours(23, 59, 59, 999)),
      };
    }

    // Mengambil semua data yang difilter tanpa pagination
    const filteredData = await prisma.lpgDistributions.findMany({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      orderBy: { bpeNumber: "desc" },
      select: {
        id: true,
        bpeNumber: true,
        agentName: true,
        giDate: true,
        licensePlate: true,
        deliveryNumber: true,
        allocatedQty: true,
        distributionQty: true,
        volume: true,
        driverName: true,
        allocationId: true, // Tambahkan allocationId untuk mencocokkan data
      },
    });

    const allocationData = await prisma.allocations.findMany({
      where: {
        id: {
          in: filteredData.map((d) => d.allocationId),
        },
      },
      select: {
        id: true,
        materialName: true,
      },
    });

    const allocationMap = new Map(
      allocationData.map((item) => [
        item.id,
        item.materialName.includes("REFILL") ? "REFILL" : item.materialName,
      ])
    );

    // Gabungkan data berdasarkan allocationId
    const mergedData = filteredData.map((item) => ({
      ...item,
      materialName: allocationMap.get(item.allocationId) || null, // Tambahkan materialName
    }));

    const monthlyData = await prisma.monthlyAllocations.findMany({
      where: {
        date: {
          gte: startOfMonth(new Date()),
          lte: endOfMonth(new Date()),
        },
      },
      select: {
        date: true,
        totalElpiji: true,
      },
    });

    // Group data by date
    const groupedData = mergedData.reduce((acc: any, item) => {
      const dateKey = new Date(item.giDate).toISOString().split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          records: [],
          quantity: {
            totalElpiji: 0,
            totalAllocatedQty: 0,
            totalDistributionQty: 0,
            totalLo: 0,
            totalPending: 0,
            totalFakultatif: 0,
          },
        };
      }

      acc[dateKey].records.push(item);

      const matchingMonthly = monthlyData.find(
        (m) => new Date(m.date).toISOString().split("T")[0] === dateKey
      );

      acc[dateKey].quantity.totalElpiji = matchingMonthly
        ? matchingMonthly.totalElpiji
        : 0;
      acc[dateKey].quantity.totalAllocatedQty += item.allocatedQty || 0;
      acc[dateKey].quantity.totalDistributionQty += item.distributionQty || 0;
      acc[dateKey].quantity.totalLo =
        acc[dateKey].quantity.totalElpiji >
        acc[dateKey].quantity.totalAllocatedQty
          ? acc[dateKey].quantity.totalElpiji -
            acc[dateKey].quantity.totalAllocatedQty
          : 0;
      acc[dateKey].quantity.totalPending =
        // acc[dateKey].quantity.totalAllocatedQty >
        // acc[dateKey].quantity.totalDistributionQty
        //   ?
        acc[dateKey].quantity.totalAllocatedQty -
        acc[dateKey].quantity.totalDistributionQty;
      // : 0;

      acc[dateKey].quantity.totalFakultatif =
        acc[dateKey].quantity.totalAllocatedQty >
        acc[dateKey].quantity.totalElpiji
          ? acc[dateKey].quantity.totalAllocatedQty -
            acc[dateKey].quantity.totalElpiji
          : 0;
      return acc;
    }, {});

    // Convert grouped data to an array
    const resultData = Object.values(groupedData);

    return NextResponse.json({
      message: resultData.length
        ? "Data fetched successfully"
        : "No data found",
      data: resultData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
