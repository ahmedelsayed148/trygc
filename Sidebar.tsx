import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';
import { AppContext } from './Root';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { BarChart3 } from 'lucide-react';
import { getVisibleNavItems, NAV_SECTIONS } from '../lib/navigation';

interface SidebarProps {
  isAdmin: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// ─── Tooltip wrapper ───
function NavTooltip({ label, children, show }: { label: string; children: React.ReactNode; show: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
      <AnimatePresence>
        {show && hovered && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none"
          >
            <div className="bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-2xl border border-zinc-700">
              {label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Single nav link ───
function SidebarLink({
  item,
  isCollapsed,
  onClick,
}: {
  item: { to: string; label: string; icon: React.ElementType; end?: boolean; badge?: string };
  isCollapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <NavTooltip label={item.label} show={isCollapsed}>
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onClick}
        className={({ isActive }) =>
          `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
            isActive
              ? 'bg-white text-black shadow-lg'
              : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
          } ${isCollapsed ? 'justify-center' : ''}`
        }
      >
        {({ isActive }) => (
          <>
            <item.icon
              className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'
              }`}
            />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-bold truncate flex-1 overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!isCollapsed && item.badge && !isActive && (
              <span className="ml-auto text-[8px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                {item.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black"
              />
            )}
          </>
        )}
      </NavLink>
    </NavTooltip>
  );
}

// ─── Section label ───
function SectionLabel({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  return (
    <div className={`mt-4 mb-1 ${isCollapsed ? 'flex justify-center' : 'px-3'}`}>
      {isCollapsed ? (
        <div className="w-4 h-px bg-zinc-800" />
      ) : (
        <AnimatePresence initial={false}>
          <motion.p
            key={label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[8px] font-black text-zinc-600 uppercase tracking-widest"
          >
            {label}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Main Sidebar ───
export function Sidebar({ isAdmin, isCollapsed, onToggleCollapse }: SidebarProps) {
  const ctx = useContext(AppContext);
  const userFeatures = ctx?.userFeatures as string[] | null;
  const userEmail = ctx?.userEmail || '';
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navItems = getVisibleNavItems({ isAdmin, userEmail, userFeatures });

  // Build sections only with available items
  const builtSections = NAV_SECTIONS.map(s => ({
    label: s.label,
    items: navItems.filter(item => s.items.includes(item.to)),
  })).filter(s => s.items.length > 0);

  const sidebarContent = (collapsed: boolean, mobile = false) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex-shrink-0 flex items-center border-b border-zinc-800 ${collapsed ? 'justify-center p-4' : 'justify-between p-5'}`}>
        <div className={`flex items-center gap-3 ${collapsed ? '' : ''}`}>
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-black" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="text-base font-black tracking-tight leading-none text-white whitespace-nowrap">Trygc</h1>
                <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">OPS Command</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors ml-2">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
        {builtSections.map((section, si) => (
          <div key={section.label}>
            {si > 0 && <SectionLabel label={section.label} isCollapsed={collapsed} />}
            {si === 0 && !collapsed && (
              <p className="px-3 py-1 mb-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest">{section.label}</p>
            )}
            {si === 0 && collapsed && <div className="mb-1" />}
            {section.items.map(item => (
              <SidebarLink
                key={item.to}
                item={item}
                isCollapsed={collapsed}
                onClick={mobile ? () => setMobileOpen(false) : undefined}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="flex-shrink-0 p-3 border-t border-zinc-800">
        {!mobile && (
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <span className="text-xs font-bold">Collapse</span>
                <ChevronLeft className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-2xl border border-zinc-800"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="mobileSidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-black text-white border-r border-zinc-800 flex flex-col z-50 shadow-2xl"
            >
              {sidebarContent(false, true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex fixed left-0 top-0 h-screen bg-black text-white border-r border-zinc-800 flex-col z-40 overflow-hidden"
        style={{ minWidth: isCollapsed ? 72 : 240 }}
      >
        {sidebarContent(isCollapsed)}
      </motion.aside>
    </>
  );
}
