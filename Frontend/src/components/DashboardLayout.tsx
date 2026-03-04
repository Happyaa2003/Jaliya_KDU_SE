import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, UserPlus, Users, BookOpen, ClipboardList,
  FileText, Settings, LogOut, Menu, X, ChevronLeft, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Register Student', path: '/register', icon: UserPlus },
  { label: 'Manage Students', path: '/students', icon: Users },
  { label: 'Manage Courses', path: '/courses', icon: BookOpen },
  { label: 'Enrollment Management', path: '/enrollment', icon: ClipboardList },
  { label: 'Audit Trail', path: '/audit', icon: FileText },
  { label: 'Settings', path: '/settings', icon: Settings },
];

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({ sidebarOpen: true, setSidebarOpen: () => { } });

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="min-h-screen bg-secondary/30 flex">
        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-50 h-screen bg-card border-r border-border/50 flex flex-col transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-[72px]",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
          style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.03)' }}
        >
          {/* Logo */}
          <div className={cn("h-16 flex items-center border-b border-border/50 px-4", sidebarOpen ? "justify-between" : "justify-center")}>
            {sidebarOpen ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2.5">
                  <img src="/KDU-LOGO.png" alt="KDU Logo" className="w-10 h-10 object-contain rounded-lg" />
                  <div className="leading-tight">
                    <span className="text-sm font-bold text-foreground block">KDU SMS</span>
                    <span className="text-[11px] text-muted-foreground">Student Management</span>
                  </div>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors hidden lg:flex">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
              </>
            ) : (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <img src="/KDU-LOGO.png" alt="KDU" className="w-8 h-8 object-contain" />
              </button>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const btn = (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "sidebar-item",
                    active ? "sidebar-item-active" : "sidebar-item-inactive",
                    !sidebarOpen && "justify-center px-0"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );

              if (!sidebarOpen) {
                return (
                  <Tooltip key={item.path} delayDuration={0}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return btn;
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border/50">
            <button
              onClick={handleLogout}
              className={cn("sidebar-item sidebar-item-inactive w-full text-destructive hover:bg-destructive/10 hover:text-destructive", !sidebarOpen && "justify-center px-0")}
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <img src="/KDU-LOGO.png" alt="KDU" className="w-7 h-7 object-contain" />
                <h1 className="text-base font-semibold text-foreground">KDU Student Management System</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-muted">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block">Administrator</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1">
            <div className="fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
