import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Search, Calendar, Briefcase, ShoppingBag, CreditCard,
  TrendingUp, GraduationCap, LayoutGrid, Users, Bot, BarChart3,
  Workflow, Globe, Inbox, Palette, ChevronDown, ChevronRight,
  Sparkles, HelpCircle, UserPlus, ArrowUpCircle, PanelLeftClose, PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  to?: string;
  badge?: string;
}

const topLinks: NavItem[] = [
  { label: 'Explore', icon: Sparkles, to: '/products' },
  { label: 'Hire a Professional', icon: UserPlus },
  { label: 'Help', icon: HelpCircle },
];

const mainNav: NavItem[] = [
  { label: 'Booking Calendar', icon: Calendar, to: '/products' },
  { label: 'Services', icon: Briefcase },
  { label: 'Catalog', icon: ShoppingBag, to: '/products' },
  { label: 'Pricing Plans', icon: CreditCard },
  { label: 'Sales', icon: TrendingUp },
  { label: 'Coaching', icon: GraduationCap },
  { label: 'Apps', icon: LayoutGrid },
];

const secondaryNav: NavItem[] = [
  { label: 'Customers & Leads', icon: Users },
  { label: 'AI Agents', icon: Bot, badge: 'New' },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Automations', icon: Workflow },
];

const bottomNav: NavItem[] = [
  { label: 'Site & Mobile App', icon: Globe, to: '/' },
  { label: 'Inbox', icon: Inbox },
  { label: 'Design Site', icon: Palette },
];

const SidebarSection = ({
  title,
  items,
  currentPath,
  collapsed,
  defaultOpen = true,
}: {
  title?: string;
  items: NavItem[];
  currentPath: string;
  collapsed: boolean;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      {title && !collapsed && (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-4 py-2 w-full text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors"
        >
          {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          {title}
        </button>
      )}
      <AnimatePresence initial={false}>
        {(open || collapsed) && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {items.map(item => {
              const active = item.to ? currentPath === item.to : false;
              const cls = cn(
                'flex items-center gap-3 w-full px-4 py-2 text-sm transition-all duration-150 group relative',
                active
                  ? 'text-sidebar-accent-foreground bg-sidebar-accent/15'
                  : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-foreground/5',
                collapsed && 'justify-center px-2'
              );
              const content = (
                <>
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r bg-sidebar-accent"
                    />
                  )}
                  <item.icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-sidebar-accent')} />
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </>
              );
              return (
                <li key={item.label}>
                  {item.to ? (
                    <Link to={item.to} className={cls} title={collapsed ? item.label : undefined}>
                      {content}
                    </Link>
                  ) : (
                    <button className={cls} title={collapsed ? item.label : undefined}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r border-sidebar-border transition-all duration-300',
        'bg-[hsl(var(--sidebar-background))]',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo & collapse */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-sidebar-accent/20">
              <Zap className="h-5 w-5 text-sidebar-accent" />
            </div>
            <span className="text-base font-bold text-sidebar-foreground">FlashDemand</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto p-1 rounded-md bg-sidebar-accent/20">
            <Zap className="h-5 w-5 text-sidebar-accent" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Top links */}
      <div className="pt-2">
        {topLinks.map(item => (
          <Link
            key={item.label}
            to={item.to || '#'}
            className={cn(
              'flex items-center gap-3 px-4 py-1.5 text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-3.5 w-3.5" />
            {!collapsed && item.label}
          </Link>
        ))}
        {/* Upgrade CTA */}
        <div className={cn('px-4 py-1.5', collapsed && 'px-2')}>
          <button
            className={cn(
              'flex items-center gap-2 text-xs font-semibold text-sidebar-accent-foreground bg-sidebar-accent hover:bg-sidebar-accent/90 rounded-md transition-colors',
              collapsed ? 'p-2 mx-auto' : 'px-3 py-1.5 w-full'
            )}
          >
            <ArrowUpCircle className="h-3.5 w-3.5" />
            {!collapsed && 'Upgrade'}
          </button>
        </div>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 bg-sidebar-foreground/5 border border-sidebar-border rounded-lg px-3 py-2 text-xs text-sidebar-foreground/40">
            <Search className="h-3.5 w-3.5" />
            <span>Search for tools, apps, help…</span>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center py-3">
          <Search className="h-4 w-4 text-sidebar-foreground/40" />
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-sidebar-border mx-3" />

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        <SidebarSection
          title="Let's set up your business"
          items={mainNav}
          currentPath={location.pathname}
          collapsed={collapsed}
        />

        <div className="h-px bg-sidebar-border mx-3 my-1" />

        <SidebarSection
          items={secondaryNav}
          currentPath={location.pathname}
          collapsed={collapsed}
        />
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border py-2">
        <SidebarSection
          items={bottomNav}
          currentPath={location.pathname}
          collapsed={collapsed}
          defaultOpen
        />
      </div>
    </aside>
  );
};

export default DashboardSidebar;
