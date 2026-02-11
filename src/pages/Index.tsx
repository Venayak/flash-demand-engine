import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useFomoPricing } from '@/hooks/useFomoPricing';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import LiveTicker from '@/components/LiveTicker';
import ProductCard from '@/components/ProductCard';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const { fomoProducts } = useFomoPricing(products);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('viewers', { ascending: false })
        .limit(4);
      if (data) setProducts(data);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LiveTicker />

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <p className="text-muted-foreground mt-1">Highest demand events — prices rising fast</p>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fomoProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How FlashDemand Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Browse Events', desc: 'Explore live events with real-time pricing based on current demand.' },
            { step: '02', title: 'Watch the Surge', desc: 'Prices increase as more people view and demand rises. Act fast!' },
            { step: '03', title: 'Lock Your Price', desc: 'Add to cart to lock in the current price before it goes higher.' },
          ].map(({ step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-xl p-8 text-center"
            >
              <span className="text-5xl font-bold text-gradient font-mono-price">{step}</span>
              <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 FlashDemand™ — Real-Time Demand-Based Pricing Engine</p>
        </div>
      </footer>
    </div>
    </DashboardLayout>
  );
};

export default Index;
