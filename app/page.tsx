"use client";

import { useEffect, useState } from "react";

type Attendance = {
  id: string;
  date: string;
  workedHours: number;
  expectedHours: number;
  isLeave: boolean;
  employee: {
    name: string;
  };
};

export default function Home() {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/attendance");
    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    alert(result.message);

    setUploaded(true);
    fetchData();
  };

  const employees = Array.from(
    new Set(data.map((row) => row.employee.name))
  );

  const monthFilteredData =
    selectedMonth === "all"
      ? data
      : data.filter(
          (row) => new Date(row.date).getMonth() === Number(selectedMonth)
        );

  const filteredData =
    selectedEmployee === "all"
      ? monthFilteredData
      : monthFilteredData.filter(
          (row) => row.employee.name === selectedEmployee
        );

  const totalExpectedHours = filteredData.reduce(
    (sum, row) => sum + row.expectedHours,
    0
  );

  const totalWorkedHours = filteredData.reduce(
    (sum, row) => sum + row.workedHours,
    0
  );

  const leavesUsed = filteredData.filter((row) => row.isLeave).length;

  const productivity =
    totalExpectedHours === 0
      ? 0
      : ((totalWorkedHours / totalExpectedHours) * 100).toFixed(2);

  if (!uploaded) {
    return (
      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Leave & Productivity Analyzer
        </h1>

        <form
          onSubmit={handleUpload}
          className="border p-6 rounded shadow bg-gray-900"
        >
          <input
            type="file"
            name="file"
            accept=".xlsx"
            className="mb-4 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload Excel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Leave & Productivity Dashboard
      </h1>

      {/* FILTERS */}
      <div className="flex gap-6 mb-6">
        <div>
          <label className="block mb-1">Month</label>
          <select
            className="border px-3 py-2 bg-white text-black rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Employee</label>
          <select
            className="border px-3 py-2 bg-white text-black rounded"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="all">All</option>
            {employees.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-gray-800">
          <p className="text-gray-600">Expected Hours</p>
          <p className="text-2xl font-bold">{totalExpectedHours}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow text-gray-800">
          <p className="text-gray-600">Worked Hours</p>
          <p className="text-2xl font-bold">{totalWorkedHours}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow text-gray-800">
          <p className="text-gray-600">Leaves Used</p>
          <p className="text-2xl font-bold">{leavesUsed} / 2</p>
        </div>

        <div className="bg-purple-100 p-4 rounded shadow text-gray-800">
          <p className="text-gray-600">Productivity</p>
          <p className="text-2xl font-bold">{productivity}%</p>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <table className="w-full border text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Worked</th>
              <th className="border px-4 py-2">Expected</th>
              <th className="border px-4 py-2">Leave</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id} className="text-center bg-white">
                <td className="border px-4 py-2">{row.employee.name}</td>
                <td className="border px-4 py-2">
                  {new Date(row.date).toDateString()}
                </td>
                <td className="border px-4 py-2">{row.workedHours}</td>
                <td className="border px-4 py-2">{row.expectedHours}</td>
                <td className="border px-4 py-2">
                  {row.isLeave ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
