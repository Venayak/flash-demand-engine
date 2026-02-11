import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useFomoPricing } from '@/hooks/useFomoPricing';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import LiveTicker from '@/components/LiveTicker';
import { Skeleton } from '@/components/ui/skeleton';

const Products = () => {
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { fomoProducts } = useFomoPricing(products);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filtered = filter === 'all' ? fomoProducts : fomoProducts.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LiveTicker />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Live Events</h1>
          <p className="text-muted-foreground">Prices update in real-time based on demand. Don't wait!</p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                category={product.category}
                basePrice={product.base_price}
                displayPrice={product.displayPrice}
                remainingStock={product.remaining_stock}
                totalStock={product.total_stock}
                viewers={product.displayViewers}
                priceIncreased={product.priceIncreased}
                imageUrl={product.image_url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
