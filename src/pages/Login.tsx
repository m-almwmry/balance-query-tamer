
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[500px] h-[500px] bg-blue-100 dark:bg-blue-950/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-sky-100 dark:bg-sky-950/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-indigo-100 dark:bg-indigo-950/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>
      
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>
      
      <motion.div 
        className="z-10 max-w-screen-xl w-full flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">نظام استعلام الرصيد</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            مراقبة أرصدة ADSL و Yemen Forge مع استعلامات آلية
          </p>
        </motion.div>
        
        <LoginForm />
      </motion.div>
    </div>
  );
};

export default Login;
