
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, ArrowRight, Shield, PhoneCall, BarChart4 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleStart = () => {
    navigate('/login');
  };
  
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 pt-8 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xl font-bold">Balance Query</div>
            <Button variant="ghost" onClick={handleStart}>
              Sign In
            </Button>
          </motion.div>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Automate Your Balance Queries
              </motion.h1>
              
              <motion.p
                className="text-lg md:text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Effortlessly monitor your ADSL and Yemen Forge balances with automated queries and detailed reports
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button size="lg" onClick={handleStart} className="rounded-full px-8">
                  Get Started <ArrowRight size={16} className="ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Features Section */}
      <section className="relative z-10 py-16 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Key Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-background rounded-xl p-6 shadow-sm border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <RefreshCw size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Queries</h3>
              <p className="text-muted-foreground">
                Schedule automatic balance queries every 60 minutes to keep your data up-to-date.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-background rounded-xl p-6 shadow-sm border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart4 size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
              <p className="text-muted-foreground">
                Generate comprehensive reports every 24 hours with balance trends and statistics.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-background rounded-xl p-6 shadow-sm border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-muted-foreground">
                Control user access, set number limits, and configure session timeouts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Balance Query System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
