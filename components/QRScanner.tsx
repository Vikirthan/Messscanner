'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  isScanning: boolean;
}

export function QRScannerComponent({ onScan, isScanning }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [torchActive, setTorchActive] = useState(false);

  useEffect(() => {
    if (!isScanning || !videoRef.current) return;

    const initScanner = async () => {
      try {
        const qrScanner = new QrScanner(
          videoRef.current!,
          (result) => {
            onScan(result.data);
          },
          {
            onDecodeError: () => {
              // Silently ignore decode errors
            },
            preferredCamera: 'environment',
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        scannerRef.current = qrScanner;
        await qrScanner.start();
      } catch (err) {
        setError('Unable to access camera. Please grant permission.');
        console.error('Scanner error:', err);
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [isScanning, onScan]);

  const toggleTorch = async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.toggleFlash();
      setTorchActive(!torchActive);
    } catch (err) {
      console.error('Torch error:', err);
    }
  };

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <p className="text-lg font-semibold mb-2">Camera Access Denied</p>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full aspect-video object-cover"
        playsInline
      />

      {/* Scan Line Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-green-500 rounded-lg relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
            <div className="absolute inset-0 border border-green-500/30 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Torch Button */}
      {scannerRef.current && (
        <button
          onClick={toggleTorch}
          className={`absolute bottom-4 right-4 z-20 px-4 py-2 rounded-lg font-semibold transition ${
            torchActive
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {torchActive ? '💡 Flash On' : '💡 Flash Off'}
        </button>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 right-4 z-20 bg-black/50 text-white p-3 rounded-lg text-center text-sm">
        <p>Point camera at QR code</p>
      </div>
    </div>
  );
}
