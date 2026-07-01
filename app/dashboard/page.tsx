'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addMeal, getMealsByWorker } from '@/lib/storage';
import { Worker } from '@/lib/auth';
import { QRScannerComponent } from '@/components/QRScanner';
import { QrCode, Utensils, DollarSign, CheckCircle, AlertCircle, LogOut } from 'lucide-react';

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

  const handleQRScan = (scannedData: string) => {
    if (cooldown) return; // Prevent duplicate scans
    
    // Only accept the meal station QR code
    if (scannedData === 'atimotorsmessscann22') {
      recordMeal();
      setScanMessage('✓ Meal scanned successfully!');
      setCooldown(true);
      setTimeout(() => setCooldown(false), 2000);
      setTimeout(() => setScanMessage(''), 2000);
      return;
    }
    
    // Reject all other QR codes
    setScanMessage('Invalid QR code. Please scan the meal station QR code.');
    setCooldown(true);
    setTimeout(() => setCooldown(false), 2000);
    setTimeout(() => setScanMessage(''), 3000);
  };

  const recordMeal = () => {
    if (!worker) return;

    const newMeal = addMeal(worker.id);
    setMeals(prevMeals => [...prevMeals, newMeal]);
    setMealCount(prevCount => prevCount + 1);
    setTotalDeduction(prevDeduction => prevDeduction + 22);
    setLastMeal(newMeal);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentWorker');
    router.push('/');
  };

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mess Scanner</h1>
            <p className="text-blue-100">{worker.name} ({worker.id})</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 py-8">
        {/* Scan Message */}
        {scanMessage && (
          <div className={`mb-4 p-4 rounded-lg text-white text-center font-semibold flex items-center justify-center gap-2 ${
            scanMessage.includes('✓') 
              ? 'bg-green-500' 
              : 'bg-red-500'
          }`}>
            {scanMessage.includes('✓') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {scanMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Scanner */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Scanner */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><QrCode size={24} /> Scan Meal QR Code</h3>
              <QRScannerComponent onScan={handleQRScan} isScanning={isScanning} />
              <p className="text-gray-600 text-sm mt-4 text-center">
                Scan the QR code at the meal station to register your meal
              </p>
              <p className="text-gray-500 text-xs mt-2 text-center">
                Each meal will be recorded automatically (Rs 22 deduction)
              </p>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-4">
            {/* Total Meals */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                <Utensils size={20} />
                Total Meals
              </div>
              <p className="text-5xl font-bold text-blue-600 mt-2">{mealCount}</p>
              <p className="text-gray-500 text-sm mt-2">This Month</p>
            </div>

            {/* Total Deduction */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                <DollarSign size={20} />
                Total Deduction
              </div>
              <p className="text-5xl font-bold text-red-600 mt-2">Rs {totalDeduction}</p>
              <p className="text-gray-500 text-sm mt-2">@ Rs 22 per meal</p>
            </div>

            {/* Last Meal */}
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 font-semibold">Last Meal</p>
              {lastMeal ? (
                <>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {new Date(lastMeal.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(lastMeal.timestamp).toLocaleTimeString()}
                  </p>
                </>
              ) : (
                <p className="text-gray-500 mt-2">No meals yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Meals Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Meals</h2>

          {meals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No meals scanned yet. Start scanning!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Time</th>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[...meals].reverse().map((meal, index) => (
                    <tr key={meal.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800 font-semibold">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {new Date(meal.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {new Date(meal.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-red-600">Rs {meal.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
