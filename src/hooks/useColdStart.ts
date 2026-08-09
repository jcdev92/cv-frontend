import { useEffect, useState } from 'react';

const COLD_START_MESSAGE_DELAY_MS = 3000;

export function useColdStart(loading: boolean) {
  const [showColdStartMessage, setShowColdStartMessage] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (!loading) {
        setShowColdStartMessage(false);
      } else if (Date.now() - start >= COLD_START_MESSAGE_DELAY_MS) {
        setShowColdStartMessage(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  return showColdStartMessage;
}