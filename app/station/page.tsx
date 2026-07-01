'use client';

import { useEffect, useState } from 'react';
import { getQRCodeURL } from '@/lib/qr-utils';

const MEAL_STATION_QR = 'meal_station:main_gate';

export default function MealStationPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Non-printable Header */}
      <div className="mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-gray-800">Meal Station QR Code</h1>
        <p className="text-gray-600 mt-2">Print this page and display at the meal station</p>
        <button
          onClick={handlePrint}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          🖨️ Print
        </button>
      </div>

      {/* Printable Content */}
      <div className="max-w-2xl mx-auto text-center">
        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">MEAL SCANNER</h2>
          <p className="text-2xl font-semibold text-gray-700 mb-8">Scan the code below to register your meal</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-8">
          <div className="border-4 border-black p-8 bg-white">
            <img
              src={getQRCodeURL(MEAL_STATION_QR, 400)}
              alt="Meal Station QR Code"
              className="w-96 h-96"
            />
          </div>
        </div>

        {/* Info */}
        <div className="border-t-4 border-black pt-8">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            👤 Make sure you are logged in before scanning
          </p>
          <p className="text-lg text-gray-700 mb-2">
            🍽️ Your meal will be recorded instantly
          </p>
          <p className="text-lg text-gray-700 mb-2">
            💰 Rs 22 will be deducted from your salary
          </p>
          <p className="text-lg text-gray-700">
            ✓ Check your dashboard to verify
          </p>

          {/* Station Info */}
          <div className="mt-8 pt-8 border-t border-gray-300">
            <p className="text-sm text-gray-500">Station ID: main_gate</p>
            <p className="text-sm text-gray-500 mt-2">Last Updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
