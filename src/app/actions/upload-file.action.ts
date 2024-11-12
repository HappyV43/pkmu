"use server";

import prisma from "@/lib/db";
import { MonthlyAllocation } from "@/lib/types";
import type { Allocations } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const uploadBulkExcel = async (
  datas: Omit<Allocations, "createdAt" | "updatedAt">[]
) => {
  const missingAgents: string[] = []; // Array to store missing agent names

  try {
    // Step 1: Validate if all agents exist before proceeding with upload
    const agentNames = datas.map((excel) => excel.agentName); // Extract all agent names from data
    const findAgentName = await prisma.agents.findMany({
      where: {
        agentName: {
          in: agentNames, // Match against all agent names
        },
      },
      select: {
        id: true,
        agentName: true,
      },
    });

    const validAgentNames = findAgentName.map((agent) => agent.agentName); // Extract valid agent names
    missingAgents.push(
      ...agentNames.filter((agentName) => !validAgentNames.includes(agentName))
    ); // Add missing agents to the list

    // If there are missing agents, abort the upload
    if (missingAgents.length > 0) {
      return {
        missingAgents, // Return the missing agents so frontend can handle
      };
    }

    // Step 2: Process the data if all agents are valid
    for (const excel of datas) {
      // Retrieve agent ID
      const agentId = findAgentName.find(
        (agent) => agent.agentName === excel.agentName
      )?.id;

      // Cek apakah data alokasi dengan deliveryNumber sudah ada
      const existingRecord = await prisma.allocations.findFirst({
        where: { deliveryNumber: excel.deliveryNumber },
      });

      const allocationData = {
        shipTo: excel.shipTo,
        materialName: excel.materialName,
        agentId: agentId,
        agentName: excel.agentName,
        plannedGiDate: excel.plannedGiDate,
        allocatedQty: excel.allocatedQty,
        updatedBy: excel.updatedBy,
      };

      if (existingRecord) {
        // Update existing allocation data
        await prisma.allocations.update({
          where: { id: existingRecord.id },
          data: allocationData,
        });
      } else {
        // Create new allocation data
        await prisma.allocations.create({
          data: {
            ...allocationData,
            giDate: excel.giDate ? new Date(excel.giDate) : null,
            deliveryNumber: excel.deliveryNumber,
            createdBy: excel.createdBy,
          },
        });
      }
    }

    // Step 3: If no missing agents, proceed with success
    revalidatePath("/dashboard/alokasi");
    return { success: true };
  } catch (error) {
    console.error("Failed to upload Excel data:", error);
    throw new Error("Terjadi masalah saat upload excel");
  }
};

export const uploadExcelMonthly = async (data: MonthlyAllocation) => {
  try {
    const excelMonthly = await prisma.monthlyAllocations.create({
      data: {
        date: data.date,
        totalElpiji: data.totalElpiji,
        volume: data.volume,
        updatedBy: data.updatedBy,
        createdBy: data.createdBy,
      },
    });
    return { success: true, data: excelMonthly };
  } catch (error) {
    console.error(error);
    throw new Error("Bulk upload failed");
  }
};

export const uploadBulkExcelMonthly = async (datas: MonthlyAllocation[]) => {
  try {
    for (const excel of datas) {
      await uploadExcelMonthly(excel);
    }
    revalidatePath("/dashboard/alokasi-bulanan");
  } catch (error) {
    return {
      error: "Terjadi masalah saat upload excel",
    };
  }
};
