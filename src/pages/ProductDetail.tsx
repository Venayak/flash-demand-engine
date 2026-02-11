import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, TrendingUp, Clock, ShoppingCart, ArrowLeft, Flame, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useFomoPricing } from '@/hooks/useFomoPricing';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';

const categoryImages: Record<string, string> = {
  comedy: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&h=600&fit=crop',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop',
  music: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop',
  startup: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=600&fit=crop',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop',
  yoga: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop',
  cyber: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Tables<'products'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const { fomoProducts } = useFomoPricing(product ? [product] : []);
  const fomo = fomoProducts[0];

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!fomo) return;
    setAddingToCart(true);
    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      product_id: fomo.id,
      locked_price: fomo.displayPrice,
      quantity: 1,
    });
    if (error) {
      toast({ title: 'Error', description: 'Could not add to cart', variant: 'destructive' });
    } else {
      toast({ title: 'Added to cart!', description: `Price locked at ₹${fomo.displayPrice.toLocaleString()}` });
    }
    setAddingToCart(false);
  };

  if (loading || !fomo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96 pt-16">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const stockPercent = (fomo.remaining_stock / fomo.total_stock) * 100;
  const surgePercent = Math.round(((fomo.displayPrice - fomo.base_price) / fomo.base_price) * 100);
  const imgSrc = categoryImages[fomo.image_url || ''] || categoryImages[fomo.category] || categoryImages.tech;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative rounded-2xl overflow-hidden">
              <img src={imgSrc} alt={fomo.name} className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
              {surgePercent > 0 && (
                <Badge className="absolute top-4 left-4 bg-surge text-surge-foreground border-0 text-sm px-3 py-1">
                  <Flame className="h-4 w-4 mr-1" /> Surge Active +{surgePercent}%
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-sm text-primary uppercase tracking-wider font-medium mb-2">{fomo.category}</p>
              <h1 className="text-4xl font-bold mb-3">{fomo.name}</h1>
              <p className="text-muted-foreground text-lg">{fomo.description}</p>
            </div>

            {/* Price Block */}
            <div className="glass-card rounded-xl p-6 glow-amber">
              <div className="flex items-baseline gap-3 mb-4">
                {surgePercent > 0 && (
                  <span className="text-lg text-muted-foreground line-through">₹{fomo.base_price.toLocaleString()}</span>
                )}
                <motion.span
                  key={fomo.displayPrice}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className={`text-5xl font-bold font-mono-price ${surgePercent > 10 ? 'text-surge' : 'text-primary'}`}
                >
                  ₹{fomo.displayPrice.toLocaleString()}
                </motion.span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Price updates every few seconds based on demand
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card rounded-lg p-4 text-center">
                <Eye className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold font-mono-price">{fomo.displayViewers}</p>
                <p className="text-xs text-muted-foreground">Viewing Now</p>
              </div>
              <div className="glass-card rounded-lg p-4 text-center">
                <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold font-mono-price">{fomo.remaining_stock}</p>
                <p className="text-xs text-muted-foreground">Seats Left</p>
              </div>
              <div className="glass-card rounded-lg p-4 text-center">
                <TrendingUp className="h-5 w-5 text-surge mx-auto mb-1" />
                <p className="text-2xl font-bold font-mono-price text-surge">+{surgePercent}%</p>
                <p className="text-xs text-muted-foreground">Price Surge</p>
              </div>
            </div>

            {/* Stock Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Availability</span>
                <span className={stockPercent < 30 ? 'text-surge font-semibold' : 'text-muted-foreground'}>
                  {Math.round(stockPercent)}% remaining
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stockPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${stockPercent < 30 ? 'bg-surge' : stockPercent < 60 ? 'bg-warning' : 'bg-success'}`}
                />
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              onClick={addToCart}
              disabled={addingToCart}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-amber text-lg py-7 font-bold"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {addingToCart ? 'Adding...' : `Lock Price at ₹${fomo.displayPrice.toLocaleString()}`}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Price locked for 10 minutes after adding to cart
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
