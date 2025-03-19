
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/utils/animations';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  // يلاحظ أن useConfig() لا يعيد كائن به خاصية config
  // بل يعيد الكائن نفسه مباشرة
  const config = useConfig(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setFormError('اسم المستخدم وكلمة المرور مطلوبان');
      return;
    }
    
    try {
      const success = await login(username, password);
      
      if (!success) {
        setFormError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError('حدث خطأ غير متوقع');
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
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
            تسجيل الدخول
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground mb-6"
            {...fadeIn(0.5)}
          >
            أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك
          </motion.p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div className="space-y-2" {...fadeIn(0.6)}>
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
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
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
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
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </motion.div>
          </form>
        </div>
        
        <motion.div 
          className="px-8 py-4 bg-muted/30 text-center text-sm text-muted-foreground"
          {...fadeIn(0.9)}
        >
          <p>بيانات اعتماد للتجربة:</p>
          <p>المدير: اسم المستخدم <strong>admin</strong>، كلمة المرور <strong>admin</strong></p>
          <p>المستخدم: اسم المستخدم <strong>user</strong>، كلمة المرور <strong>user</strong></p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
