import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUp } from 'lucide-react';

const tickerMessages = [
  '🔥 Comedy Night Live price surged +12% in last 5 min',
  '👀 89 people viewing Tech Summit right now',
  '⚡ Artisan Coffee Masterclass — only 12 seats left!',
  '📈 Weekend Yoga Retreat price up ₹200 since morning',
  '🎫 Midnight Food Fest — 55% sold out',
  '🚀 Cybersecurity Bootcamp demand at all-time high',
];

const LiveTicker = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % tickerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary/5 border-y border-primary/10 py-2.5 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-primary shrink-0">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Live</span>
          <span className="h-2 w-2 rounded-full bg-surge animate-pulse-surge" />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground truncate"
          >
            {tickerMessages[current]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveTicker;
