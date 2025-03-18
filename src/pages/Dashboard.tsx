
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ConfigProvider } from '@/contexts/ConfigContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import NumbersPanel from '@/components/dashboard/NumbersPanel';
import APIConfigPanel from '@/components/dashboard/APIConfigPanel';
import UserManagementPanel from '@/components/dashboard/UserManagementPanel';
import ReportsPanel from '@/components/dashboard/ReportsPanel';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { RefreshCw } from 'lucide-react';

type Tab = 'dashboard' | 'numbers' | 'api' | 'users' | 'reports';

const Dashboard = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <RefreshCw size={24} />
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider>
      <DashboardLayout 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
      >
        {currentTab === 'dashboard' && <DashboardContent />}
        {currentTab === 'numbers' && <NumbersPanel />}
        {currentTab === 'api' && isAdmin && <APIConfigPanel />}
        {currentTab === 'users' && isAdmin && <UserManagementPanel />}
        {currentTab === 'reports' && <ReportsPanel />}
      </DashboardLayout>
    </ConfigProvider>
  );
};

export default Dashboard;
