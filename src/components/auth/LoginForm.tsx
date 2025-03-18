
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/utils/animations';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setFormError('Username and password are required');
      return;
    }
    
    try {
      const success = await login(username, password);
      
      if (!success) {
        setFormError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError('An unexpected error occurred');
      
      toast({
        title: "Login Error",
        description: "Failed to log in. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
    >
      <motion.div 
        className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden"
        {...slideUp(0.2)}
      >
        <div className="px-8 pt-8 pb-6">
          <motion.h2 
            className="text-2xl font-semibold text-center mb-1"
            {...fadeIn(0.4)}
          >
            Sign In
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground mb-6"
            {...fadeIn(0.5)}
          >
            Enter your credentials to access your account
          </motion.p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div className="space-y-2" {...fadeIn(0.6)}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setFormError('');
                }}
                className="h-11"
                autoComplete="username"
                disabled={isLoading}
              />
            </motion.div>
            
            <motion.div className="space-y-2" {...fadeIn(0.7)}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormError('');
                }}
                className="h-11"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </motion.div>
            
            {formError && (
              <motion.p 
                className="text-sm text-destructive font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {formError}
              </motion.p>
            )}
            
            <motion.div {...fadeIn(0.8)}>
              <Button
                type="submit"
                className="w-full h-11 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>
        </div>
        
        <motion.div 
          className="px-8 py-4 bg-muted/30 text-center text-sm text-muted-foreground"
          {...fadeIn(0.9)}
        >
          <p>Demo Credentials:</p>
          <p>Admin: username <strong>admin</strong>, password <strong>admin</strong></p>
          <p>User: username <strong>user</strong>, password <strong>user</strong></p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
