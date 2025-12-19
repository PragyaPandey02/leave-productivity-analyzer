export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.attendance.findMany({
    include: {
      employee: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return NextResponse.json(data);
}
