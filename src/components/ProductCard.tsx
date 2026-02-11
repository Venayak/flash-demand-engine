import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, TrendingUp, Clock, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  category: string;
  basePrice: number;
  displayPrice: number;
  remainingStock: number;
  totalStock: number;
  viewers: number;
  priceIncreased: boolean;
  imageUrl: string | null;
}

const categoryImages: Record<string, string> = {
  comedy: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&h=400&fit=crop',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
  music: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
  startup: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
  yoga: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
  cyber: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
};

const ProductCard = ({
  id, name, description, category, basePrice, displayPrice,
  remainingStock, totalStock, viewers, priceIncreased, imageUrl,
}: ProductCardProps) => {
  const [flashPrice, setFlashPrice] = useState(false);
  const stockPercent = (remainingStock / totalStock) * 100;
  const surgePercent = Math.round(((displayPrice - basePrice) / basePrice) * 100);
  const isHot = viewers > 30 || stockPercent < 40;

  useEffect(() => {
    if (priceIncreased) {
      setFlashPrice(true);
      const t = setTimeout(() => setFlashPrice(false), 600);
      return () => clearTimeout(t);
    }
  }, [priceIncreased, displayPrice]);

  const imgSrc = categoryImages[imageUrl || ''] || categoryImages[category] || categoryImages.tech;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${id}`} className="block">
        <div className={`glass-card rounded-xl overflow-hidden group transition-all duration-300 ${isHot ? 'glow-surge' : 'hover:glow-amber'}`}>
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={imgSrc}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {isHot && (
                <Badge className="bg-surge text-surge-foreground border-0 animate-pulse-surge">
                  <Flame className="h-3 w-3 mr-1" /> HOT
                </Badge>
              )}
              {surgePercent > 0 && (
                <Badge className="bg-primary/90 text-primary-foreground border-0">
                  <TrendingUp className="h-3 w-3 mr-1" /> +{surgePercent}%
                </Badge>
              )}
            </div>

            {/* Viewers */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm border-border/50">
                <Eye className="h-3 w-3 mr-1" /> {viewers} watching
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{category}</p>
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

            {/* Price */}
            <div className="flex items-end justify-between">
              <div>
                {surgePercent > 0 && (
                  <span className="text-xs text-muted-foreground line-through mr-2">₹{basePrice.toLocaleString()}</span>
                )}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={displayPrice}
                    initial={flashPrice ? { scale: 1.15, color: 'hsl(0 85% 58%)' } : {}}
                    animate={{ scale: 1, color: surgePercent > 10 ? 'hsl(0 85% 58%)' : 'hsl(32 95% 52%)' }}
                    className="text-2xl font-bold font-mono-price"
                  >
                    ₹{displayPrice.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{remainingStock} left</p>
                <div className="w-20 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${stockPercent < 30 ? 'bg-surge' : stockPercent < 60 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${stockPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
