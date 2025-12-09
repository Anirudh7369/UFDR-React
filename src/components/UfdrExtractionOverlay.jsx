import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const UfdrExtractionOverlay = ({ isExtracting, onComplete }) => {
  useEffect(() => {
    if (!isExtracting) return;

    // Poll the backend every 2 seconds to check extraction status
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:8000/api/extraction-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.status === 'completed') {
            clearInterval(pollInterval);
            onComplete?.();
          }
        }
      } catch (error) {
        console.error('Error checking extraction status:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [isExtracting, onComplete]);

  if (!isExtracting) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Custom Loading Spinner with Gradient */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full">
            <div className="h-full w-full animate-spin rounded-full border-4 border-transparent bg-gradient-to-r from-[#6A11CB] to-[#FC5C7D] bg-clip-border">
              <div className="h-full w-full rounded-full bg-black"></div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-base text-center max-w-xs font-semibold">
            Extracting data from UFDR...
          </p>
          <p className="text-gray-400 text-sm text-center max-w-xs">
            Building databases. Please wait.
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-[#6A11CB] animate-pulse"></div>
          <div className="h-2 w-2 rounded-full bg-[#A076F9] animate-pulse delay-75"></div>
          <div className="h-2 w-2 rounded-full bg-[#FC5C7D] animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default UfdrExtractionOverlay;
