"use server";

import prisma from "@/lib/db";
import {
  Allocation,
  AllocationData,
  DataConfig,
  MonthlyAllocation,
  SummaryProps,
} from "@/lib/types";
import type { MonthlyAllocations } from "../../../generated/prisma_client";
import { cache } from "react";

export async function getAllokasiAll(): Promise<Allocation[]> {
  const data = await prisma.allocations.findMany();
  return data as Allocation[];
}

export async function getMonthlyAllocation(): Promise<MonthlyAllocation[]> {
  const data = await prisma.monthlyAllocations.findMany();
  return data as MonthlyAllocations[];
}

export const getSummary = async (): Promise<SummaryProps> => {
  const allocationData = await prisma.allocations.findMany({
    select: {
      allocatedQty: true,
      plannedGiDate: true,
      lpgDistribution: {
        select: {
          distributionQty: true,
          giDate: true,
        },
      },
    },
  });
  const monthlyAllocations = await prisma.monthlyAllocations.findMany({
    select: {
      date: true,
      totalElpiji: true,
    },
  });

  // Map the results to match the SummaryProps structure
  const data: AllocationData[] = allocationData.map((allocation) => ({
    plannedGiDate: allocation.plannedGiDate,
    allocatedQty: allocation.allocatedQty,
    lpgDistribution: allocation.lpgDistribution
      ? {
          giDate: allocation.lpgDistribution.giDate,
          distributionQty: allocation.lpgDistribution.distributionQty,
        }
      : null,
  }));

  const monthly: DataConfig[] = monthlyAllocations.map((monthlyAllocation) => ({
    date: monthlyAllocation.date,
    qty: monthlyAllocation.totalElpiji,
  }));

  // Return the structured result
  return { data, monthly };
};

export async function getMonthlyAllocationQty() {
  return await prisma.monthlyAllocations.findMany({
    select: {
      date: true,
      totalElpiji: true,
    },
  });
}

export async function getSummaryQty() {
  return await prisma.allocations.findMany({
    select: {
      allocatedQty: true,
      plannedGiDate: true,
    },
  });
}

export const getAllocationDefault = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.allocations.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: today,
          },
        },
        {
          status:{
            equals: "Pending"
          }
        }
      ],
    },
    orderBy: { bpeNumber: "desc" },
    select: {
      id: true,
      status: true,
      deliveryNumber: true,
      shipTo: true,
      agentName: true,
      materialName: true,
      allocatedQty: true,
      plannedGiDate: true,
      giDate: true,
      bpeNumber: true,
      updatedAt: true,
    },
  });
};

export const getFilterDataAllocation = cache(async () => {
  return await prisma.allocations.findMany({
    select: {
      status: true,
      deliveryNumber: true,
      agentName: true,
    },
    distinct: ["agentName", "status"],
  });
});
