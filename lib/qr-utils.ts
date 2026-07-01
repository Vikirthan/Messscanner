// QR code utility for generating meal QR codes
// Format: meal:WORKER_ID:TIMESTAMP

export const generateMealQRData = (workerId: string): string => {
  const timestamp = Date.now();
  return `meal:${workerId}:${timestamp}`;
};

export const parseMealQRData = (data: string): { workerId: string; timestamp: number } | null => {
  try {
    const parts = data.split(':');
    if (parts[0] !== 'meal' || parts.length < 3) return null;
    
    return {
      workerId: parts[1],
      timestamp: parseInt(parts[2], 10),
    };
  } catch (error) {
    return null;
  }
};

// Generate QR code URL using external API (no library needed client-side for generation)
export const getQRCodeURL = (data: string, size: number = 200): string => {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
};
