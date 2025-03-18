
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  PhoneCall, 
  Settings, 
  Users, 
  FileText,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import StatusIndicator from '@/components/ui/StatusIndicator';

type Tab = 'dashboard' | 'numbers' | 'api' | 'users' | 'reports';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const DashboardLayout = ({ 
  children, 
  currentTab, 
  onTabChange 
}: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'numbers', label: 'Numbers', icon: <PhoneCall size={20} /> },
    { id: 'api', label: 'API Config', icon: <Settings size={20} />, adminOnly: true },
    { id: 'users', label: 'Users', icon: <Users size={20} />, adminOnly: true },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
  ];

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        layout
        className={cn(
          "h-screen flex flex-col bg-background border-r border-border",
          "fixed z-30 transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-64"
        )}
        initial={false}
      >
        {/* Logo Area */}
        <div className="p-4 flex items-center justify-between h-16 border-b border-border">
          {!collapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-semibold"
            >
              Balance Query
            </motion.h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-full w-8 h-8"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {visibleTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={currentTab === tab.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
                collapsed 
                  ? "px-2 h-10" 
                  : "px-3 h-10",
                currentTab === tab.id
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "hover:bg-muted/50"
              )}
              onClick={() => onTabChange(tab.id as Tab)}
            >
              <span className={cn("mr-2", collapsed && "mr-0")}>{tab.icon}</span>
              {!collapsed && <span>{tab.label}</span>}
            </Button>
          ))}
        </nav>

        {/* User Section */}
        <div className={cn(
          "p-4 border-t border-border",
          "flex items-center"
        )}>
          <div className="flex-1 min-w-0">
            {!collapsed && user && (
              <div className="space-y-1">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <StatusIndicator status="online" text="Active" className="mt-1" />
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="rounded-full w-8 h-8"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        collapsed ? "ml-[70px]" : "ml-64"
      )}>
        <div className="h-screen overflow-auto">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
