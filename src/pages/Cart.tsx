import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

interface CartItem {
  id: string;
  quantity: number;
  locked_price: number;
  product_id: string;
  products: {
    name: string;
    category: string;
    image_url: string | null;
  };
}

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('cart_items')
      .select('*, products(name, category, image_url)')
      .eq('user_id', user.id);
    if (data) setItems(data as unknown as CartItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const removeItem = async (id: string) => {
    await supabase.from('cart_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
    toast({ title: 'Removed from cart' });
  };

  const checkout = async () => {
    if (!user || items.length === 0) return;
    setChecking(true);
    const total = items.reduce((s, i) => s + i.locked_price * i.quantity, 0);

    const { data: order, error } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total_amount: total, status: 'confirmed' })
      .select()
      .single();

    if (error || !order) {
      toast({ title: 'Checkout failed', variant: 'destructive' });
      setChecking(false);
      return;
    }

    const orderItems = items.map(i => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      price_at_purchase: i.locked_price,
    }));

    await supabase.from('order_items').insert(orderItems);
    await supabase.from('cart_items').delete().eq('user_id', user.id);

    toast({ title: '🎉 Order confirmed!', description: `Total: ₹${total.toLocaleString()}` });
    setItems([]);
    setChecking(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <p className="text-muted-foreground text-lg">Please sign in to view your cart</p>
          <Button onClick={() => navigate('/auth')} className="bg-primary text-primary-foreground">Sign In</Button>
        </div>
      </div>
    );
  }

  const total = items.reduce((s, i) => s + i.locked_price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={items.length} />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/products')} className="bg-primary text-primary-foreground">
              Browse Events
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card rounded-xl p-5 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{item.products.name}</h3>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} • Price locked</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold font-mono-price text-primary">
                      ₹{item.locked_price.toLocaleString()}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-surge">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Total & Checkout */}
            <div className="glass-card rounded-xl p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-muted-foreground">Total</span>
                <span className="text-3xl font-bold font-mono-price text-primary">₹{total.toLocaleString()}</span>
              </div>
              <Button
                onClick={checkout}
                disabled={checking}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-amber text-lg py-6 font-bold"
              >
                {checking ? 'Processing...' : 'Confirm Order'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
