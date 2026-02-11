import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NavbarProps {
  cartCount?: number;
}

const Navbar = ({ cartCount = 0 }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="p-1.5 rounded-lg bg-primary/10"
          >
            <Zap className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold text-gradient">FlashDemand</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Home
          </Link>
          <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Events
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
