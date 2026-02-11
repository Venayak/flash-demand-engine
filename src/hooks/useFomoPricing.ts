import { useState, useEffect, useCallback, useRef } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface FomoProduct extends Product {
  displayPrice: number;
  priceIncreased: boolean;
  displayViewers: number;
}

export const useFomoPricing = (products: Product[]) => {
  const [fomoProducts, setFomoProducts] = useState<FomoProduct[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Initialize
    setFomoProducts(products.map(p => ({
      ...p,
      displayPrice: p.current_price,
      priceIncreased: false,
      displayViewers: p.viewers,
    })));

    // Clear previous intervals
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];

    if (products.length === 0) return;

    // Viewer fluctuation every 3s
    const viewerInterval = setInterval(() => {
      setFomoProducts(prev => prev.map(p => {
        const delta = Math.floor(Math.random() * 5) - 1; // -1 to +3
        const newViewers = Math.max(5, p.displayViewers + delta);
        return { ...p, displayViewers: newViewers };
      }));
    }, 3000);

    // Price surge every 8s for random product
    const priceInterval = setInterval(() => {
      setFomoProducts(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        return prev.map((p, i) => {
          if (i !== idx) return { ...p, priceIncreased: false };
          const scarcity = 1 - (p.remaining_stock / p.total_stock);
          const demandFactor = p.displayViewers / 50;
          const increase = p.base_price * 0.02 * (1 + scarcity + demandFactor);
          const newPrice = Math.round((p.displayPrice + increase) * 100) / 100;
          const maxPrice = p.base_price * 2.5;
          return {
            ...p,
            displayPrice: Math.min(newPrice, maxPrice),
            priceIncreased: true,
          };
        });
      });
    }, 8000);

    intervalsRef.current = [viewerInterval, priceInterval];

    return () => {
      intervalsRef.current.forEach(clearInterval);
    };
  }, [products]);

  const resetPriceFlash = useCallback((productId: string) => {
    setFomoProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, priceIncreased: false } : p
    ));
  }, []);

  return { fomoProducts, resetPriceFlash };
};
