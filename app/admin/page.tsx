'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMealCountByWorker, clearAllMeals } from '@/lib/storage';
import { getAllWorkers, Worker } from '@/lib/auth';
import { Download, Trash2, ChevronLeft, ChevronRight, DollarSign, Users, Utensils, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [mealCounts, setMealCounts] = useState<Record<string, number>>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const counts = getMealCountByWorker(year, month);
    setMealCounts(counts);

    const allWorkers = getAllWorkers();
    setWorkers(allWorkers);
  }, [selectedMonth]);

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all meal records? This action cannot be undone.')) {
      clearAllMeals();
      setMealCounts({});
    }
  };

  const handleExport = () => {
    const data = workers.map(worker => ({
      'Worker ID': worker.id,
      'Name': worker.name,
      'Department': worker.department,
      'Meals': mealCounts[worker.id] || 0,
      'Deduction (Rs)': (mealCounts[worker.id] || 0) * 22,
    }));

    const csv = [
      ['Mess Management Report', `${selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`],
      [],
      Object.keys(data[0] || {}),
      ...data.map(row => Object.values(row)),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mess_report_${selectedMonth.toISOString().slice(0, 7)}.csv`;
    a.click();
  };

  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalMeals = Object.values(mealCounts).reduce((sum, count) => sum + count, 0);
  const totalDeduction = totalMeals * 22;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-purple-100">Mess Management Report</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 py-8">
        {/* Month Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevMonth}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <ChevronLeft size={20} /> Previous
              </button>

              <div className="text-center px-6">
                <p className="text-gray-600">Selected Month</p>
                <p className="text-2xl font-bold text-blue-600">{monthName}</p>
              </div>

              <button
                onClick={handleNextMonth}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                Next <ChevronRight size={20} />
              </button>

              <button
                onClick={handleCurrentMonth}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Today
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Download size={20} /> Export CSV
              </button>
              <button
                onClick={handleClearData}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Trash2 size={20} /> Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 text-gray-600 font-semibold">
              <Users size={20} />
              Total Workers
            </div>
            <p className="text-4xl font-bold text-blue-600 mt-2">{workers.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 text-gray-600 font-semibold">
              <Utensils size={20} />
              Total Meals
            </div>
            <p className="text-4xl font-bold text-green-600 mt-2">{totalMeals}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 text-gray-600 font-semibold">
              <DollarSign size={20} />
              Total Deduction
            </div>
            <p className="text-4xl font-bold text-red-600 mt-2">Rs {totalDeduction}</p>
          </div>
        </div>

        {/* Workers Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Worker Meal Records</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Worker ID</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Department</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold">Meals</th>
                  <th className="px-4 py-3 text-right text-gray-700 font-semibold">Salary Deduction</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(worker => {
                  const mealCount = mealCounts[worker.id] || 0;
                  const deduction = mealCount * 22;

                  return (
                    <tr key={worker.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-800 font-mono">{worker.id}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">{worker.name}</td>
                      <td className="px-4 py-3 text-gray-600">{worker.department}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                          {mealCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">
                        Rs {deduction}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {workers.length === 0 && (
            <p className="text-gray-500 text-center py-8">No workers found</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Back to Login
          </button>
        </div>
      </main>
    </div>
  );
}
