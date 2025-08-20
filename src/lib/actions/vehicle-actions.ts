"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "../prisma.ts";
import { reservationSchema } from "../schemas/reservation.ts";

export async function reserveVehicleAction(formData: FormData, userId: string) {
  const rawData = {
    vehicleId: formData.get("vehicleId"),
    startDateTime: formData.get("startDateTime"),
    endDateTime: formData.get("endDateTime"),
    destination: formData.get("destination"),
  };

  const validatedData = reservationSchema.safeParse(rawData);

  if (!validatedData.success) {
    const tree = z.treeifyError(validatedData.error);

    return {
      error: "入力内容を確認してください",
      details: tree.properties,
    };
  }

  try {
    await prisma.$transaction([
      prisma.drivingLog.create({
        data: {
          vehicle_id: validatedData.data.vehicleId,
          start_time: validatedData.data.startDateTime,
          end_time: validatedData.data.endDateTime,
          destination: validatedData.data.destination,
          user_id: userId,
        },
      }),
      prisma.vehicle.update({
        where: { id: validatedData.data.vehicleId },
        data: { status: "IN_USE" },
      }),
    ]);

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Reservation error:", error);

    return { error: "予約に失敗しました。再度お試しください。" };
  }
}
