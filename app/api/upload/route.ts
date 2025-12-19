export const runtime = "nodejs";

import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

/* ================= HELPER FUNCTIONS ================= */

// ✅ SAFE Excel date conversion (handles number, string, Date)
function excelDateToJSDate(value: any): Date | null {
  // Already a valid Date
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  // Excel numeric date
  if (typeof value === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + value * 86400000);
  }

  // String date (e.g. 02-06-2025)
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null; // invalid date
}

// Convert Excel time fraction to JS Date
function excelTimeToJSDate(date: Date, timeFraction: number) {
  const totalMinutes = timeFraction * 24 * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const d = new Date(date);
  d.setHours(hours, minutes, 0);
  return d;
}

// ✅ SAFE worked hours calculation
function calculateWorkedHours(inTime: Date | null, outTime: Date | null) {
  if (!inTime || !outTime) return 0;
  const diff = outTime.getTime() - inTime.getTime();
  return diff > 0 ? diff / (1000 * 60 * 60) : 0;
}

// Expected hours based on day
function getExpectedHours(date: Date) {
  const day = date.getDay();
  if (day >= 1 && day <= 5) return 8.5; // Mon–Fri
  if (day === 6) return 4;              // Saturday
  return 0;                             // Sunday
}

// Leave check
function isLeaveDay(date: Date, inTime: Date | null, outTime: Date | null) {
  const expected = getExpectedHours(date);
  if (expected === 0) return false; // Sunday is not leave
  return !inTime || !outTime;
}

/* ================= API ================= */

// GET for quick test
export async function GET() {
  return NextResponse.json({ message: "Upload API ready" });
}

// POST for Excel upload
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  for (const row of rows) {
    // ✅ SAFE DATE PARSING
    const date = excelDateToJSDate(row["Date"]);
    if (!date) {
      console.warn("Skipping row due to invalid date:", row);
      continue;
    }

    const inTime =
      typeof row["In-Time"] === "number"
        ? excelTimeToJSDate(date, row["In-Time"])
        : null;

    const outTime =
      typeof row["Out-Time"] === "number"
        ? excelTimeToJSDate(date, row["Out-Time"])
        : null;

    const workedHours = calculateWorkedHours(inTime, outTime);
    const expectedHours = getExpectedHours(date);
    const isLeave = isLeaveDay(date, inTime, outTime);

    // ✅ Clean employee name
    const employeeName = String(row["Employee Name"]).trim();

    // Find or create employee
    const employee = await prisma.employee.upsert({
      where: { name: employeeName },
      update: {},
      create: { name: employeeName },
    });

    // ✅ UPSERT attendance (no duplicates)
    await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date,
        },
      },
      update: {
        inTime,
        outTime,
        workedHours,
        expectedHours,
        isLeave,
      },
      create: {
        date,
        inTime,
        outTime,
        workedHours,
        expectedHours,
        isLeave,
        employeeId: employee.id,
      },
    });
  }

  return NextResponse.json({ message: "Excel data saved successfully" });
}
