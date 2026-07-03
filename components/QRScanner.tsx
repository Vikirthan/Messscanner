'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Lightbulb } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  isScanning: boolean;
}

export function QRScannerComponent({ onScan, isScanning }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [torchActive, setTorchActive] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);

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
            // Fix orientation: use calculateScanRegion to keep scan region square
            calculateScanRegion: (video) => {
              const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
              const scanRegionSize = Math.round((2 / 3) * smallestDimension);
              return {
                x: Math.round((video.videoWidth - scanRegionSize) / 2),
                y: Math.round((video.videoHeight - scanRegionSize) / 2),
                width: scanRegionSize,
                height: scanRegionSize,
              };
            },
          }
        );

        scannerRef.current = qrScanner;
        await qrScanner.start();

        // Check torch support
        const torchSupported = await qrScanner.hasFlash().catch(() => false);
        setHasTorch(torchSupported);
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
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden"
      style={{ aspectRatio: '1 / 1', maxHeight: '340px' }}
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white px-4">
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

      {/* Video — fills the square container, cropped to center */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Corner scan-frame overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative w-[72%] h-[72%]">
          {/* Corners */}
          {[
            'top-0 left-0 border-t-4 border-l-4 rounded-tl-lg',
            'top-0 right-0 border-t-4 border-r-4 rounded-tr-lg',
            'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg',
            'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg',
          ].map((cls, i) => (
            <span key={i} className={`absolute w-8 h-8 border-[#1BBFB2] ${cls}`} />
          ))}
          {/* Animated scan line */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1BBFB2] to-transparent"
              style={{ animation: 'scanLine 2s linear infinite' }}
            />
          </div>
        </div>
      </div>

      {/* Torch Button */}
      {hasTorch && (
        <button
          onClick={toggleTorch}
          className={`absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 text-sm ${
            torchActive
              ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
              : 'bg-gray-700/80 hover:bg-gray-600 text-white'
          }`}
        >
          <Lightbulb size={16} />
          {torchActive ? 'On' : 'Flash'}
        </button>
      )}

      {/* Instructions */}
      <div className="absolute top-3 left-3 right-3 z-20 bg-black/50 text-white py-1.5 px-3 rounded-lg text-center text-xs">
        Point camera at the meal station QR code
      </div>

      {/* Scan line keyframes */}
      <style>{`
        @keyframes scanLine {
          0%   { top: 5%; }
          50%  { top: 90%; }
          100% { top: 5%; }
        }
      `}</style>
    </div>
  );
}
