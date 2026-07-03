'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { addMeal, getMealsByWorker } from '@/lib/storage';
import { Worker } from '@/lib/auth';
import { QRScannerComponent } from '@/components/QRScanner';
import { QrCode, Utensils, DollarSign, CheckCircle, AlertCircle, LogOut, X } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [lastMeal, setLastMeal] = useState<any>(null);
  const [mealCount, setMealCount] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [scanMessage, setScanMessage] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  useEffect(() => {
    const storedWorker = localStorage.getItem('currentWorker');
    if (!storedWorker) {
      router.push('/');
      return;
    }

    const workerData = JSON.parse(storedWorker) as Worker;
    setWorker(workerData);

    const workerMeals = getMealsByWorker(workerData.id);
    setMeals(workerMeals);
    setMealCount(workerMeals.length);
    setTotalDeduction(workerMeals.length * 22);

    if (workerMeals.length > 0) {
      setLastMeal(workerMeals[workerMeals.length - 1]);
    }
  }, [router]);

  const recordMeal = useCallback((currentWorker: Worker) => {
    const newMeal = addMeal(currentWorker.id);
    setMeals(prev => [...prev, newMeal]);
    setMealCount(prev => prev + 1);
    setTotalDeduction(prev => prev + 22);
    setLastMeal(newMeal);

    const now = new Date(newMeal.timestamp);
    setConfirmationData({
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      date: now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      amount: 22,
    });
    setShowConfirmation(true);
  }, []);

  const handleQRScan = useCallback((scannedData: string) => {
    if (cooldown) return;

    if (scannedData === 'atimotorsmessscann22') {
      if (worker) recordMeal(worker);
      setScanMessage('✓ Meal scanned successfully!');
      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);
      setTimeout(() => setScanMessage(''), 3000);
      return;
    }

    setScanMessage('Invalid QR code. Please scan the meal station QR code.');
    setCooldown(true);
    setTimeout(() => setCooldown(false), 2000);
    setTimeout(() => setScanMessage(''), 3000);
  }, [cooldown, worker, recordMeal]);

  const handleLogout = () => {
    localStorage.removeItem('currentWorker');
    router.push('/');
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationData(null);
  };

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1BBFB2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ===== SUCCESS CONFIRMATION MODAL ===== */}
      {showConfirmation && confirmationData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Top banner */}
            <div
              className="relative flex flex-col items-center pt-8 pb-6 px-6"
              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
            >
              {/* Logo */}
              <div className="mb-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                <img src="/ati-logo.jpg" alt="ATi Motors" className="h-8 w-auto" />
              </div>
              {/* Big check */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl mb-3"
                style={{ background: 'linear-gradient(135deg, #1BBFB2, #0d9488)' }}
              >
                <CheckCircle className="text-white" size={44} strokeWidth={2.5} />
              </div>
              <h2 className="text-white text-2xl font-extrabold tracking-tight">Meal Registered!</h2>
              <p className="text-gray-400 text-sm mt-1">Your meal has been recorded successfully</p>

              {/* Close */}
              <button
                onClick={closeConfirmation}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Detail cards */}
            <div className="p-5 space-y-3">
              {/* Worker ID */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Worker ID</span>
                <span
                  className="text-lg font-extrabold"
                  style={{ color: '#1d4ed8' }}
                >
                  {confirmationData.workerId}
                </span>
              </div>

              {/* Name */}
              <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
                <span className="text-xs font-semibold text-purple-500 uppercase tracking-widest">Name</span>
                <span className="text-base font-bold text-purple-700">{confirmationData.workerName}</span>
              </div>

              {/* Time */}
              <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#16a34a' }}>Time</span>
                <span className="text-lg font-extrabold" style={{ color: '#15803d' }}>
                  {confirmationData.time}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#ea580c' }}>Date</span>
                <span className="text-sm font-bold text-right" style={{ color: '#c2410c' }}>
                  {confirmationData.date}
                </span>
              </div>

              {/* Deduction */}
              <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#dc2626' }}>Deduction</span>
                <span className="text-lg font-extrabold" style={{ color: '#b91c1c' }}>Rs {confirmationData.amount}</span>
              </div>
            </div>

            {/* Done button */}
            <div className="px-5 pb-6">
              <button
                onClick={closeConfirmation}
                className="w-full py-3 rounded-xl font-bold text-white text-base transition hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #1BBFB2, #0d9488)' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 shadow-lg" style={{ background: 'linear-gradient(90deg, #0f172a, #1e293b)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* ATi Logo */}
            <div className="bg-white rounded-lg px-3 py-1 shadow">
              <img src="/ati-logo.jpg" alt="ATi Motors" className="h-7 w-auto" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">Mess Scanner</h1>
              <p className="text-[#1BBFB2] text-xs font-medium mt-0.5">{worker.name} · {worker.id}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 active:scale-95 transition px-3 py-2 rounded-lg font-semibold text-white flex items-center gap-2 text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="max-w-6xl mx-auto p-4 py-6">
        {/* Scan Message Banner */}
        {scanMessage && (
          <div className={`mb-4 p-4 rounded-xl text-white text-center font-semibold flex items-center justify-center gap-2 shadow-lg transition-all ${
            scanMessage.includes('✓')
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}>
            {scanMessage.includes('✓') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {scanMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Scanner column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <QrCode size={20} className="text-[#1BBFB2]" />
                Scan Meal QR Code
              </h3>
              <QRScannerComponent onScan={handleQRScan} isScanning={isScanning} />
              <p className="text-gray-500 text-xs mt-3 text-center">
                Scan the QR code at the meal station · Rs 22 deducted per meal
              </p>
            </div>
          </div>

          {/* Stats column */}
          <div className="space-y-4">
            {/* Total Meals */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold">
                <Utensils size={18} className="text-[#1BBFB2]" />
                Total Meals
              </div>
              <p className="text-5xl font-black mt-2" style={{ color: '#1BBFB2' }}>{mealCount}</p>
              <p className="text-gray-400 text-xs mt-1">This Month</p>
            </div>

            {/* Total Deduction */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold">
                <DollarSign size={18} className="text-red-500" />
                Total Deduction
              </div>
              <p className="text-4xl font-black text-red-500 mt-2">Rs {totalDeduction}</p>
              <p className="text-gray-400 text-xs mt-1">@ Rs 22 per meal</p>
            </div>

            {/* Last Meal */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <p className="text-gray-500 text-sm font-semibold">Last Meal</p>
              {lastMeal ? (
                <>
                  <p className="text-2xl font-black text-gray-800 mt-2">
                    {new Date(lastMeal.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-[#1BBFB2] text-sm font-semibold mt-1">
                    {new Date(lastMeal.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 mt-2 text-sm">No meals yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Meals Table */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Meals</h2>
          {meals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No meals scanned yet. Start scanning!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 rounded-xl">
                    <th className="px-4 py-3 text-left text-gray-500 text-sm font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-gray-500 text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-gray-500 text-sm font-semibold">Time</th>
                    <th className="px-4 py-3 text-left text-gray-500 text-sm font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[...meals].reverse().map((meal, index) => (
                    <tr key={meal.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-700 font-semibold text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {new Date(meal.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {new Date(meal.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </td>
                      <td className="px-4 py-3 font-bold text-red-500 text-sm">Rs {meal.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
