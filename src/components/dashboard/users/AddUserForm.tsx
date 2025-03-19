
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useConfig } from '@/contexts/ConfigContext';
import { toast } from '@/components/ui/use-toast';

const AddUserForm = ({ onCancel }: { onCancel: () => void }) => {
  const { userConfigs, addUserConfig } = useConfig();
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    maxNumbers: 5,
    sessionLength: 8,
    isActive: true,
    email: '',
  });

  const resetNewUser = () => {
    setNewUser({
      username: '',
      password: '',
      maxNumbers: 5,
      sessionLength: 8,
      isActive: true,
      email: '',
    });
    onCancel();
    setShowPassword(false);
  };

  const handleAddUser = () => {
    if (!newUser.username) {
      toast({
        title: "اسم المستخدم مطلوب",
        description: "الرجاء إدخال اسم مستخدم",
        variant: "destructive",
      });
      return;
    }

    if (!newUser.password) {
      toast({
        title: "كلمة المرور مطلوبة",
        description: "الرجاء إدخال كلمة مرور",
        variant: "destructive",
      });
      return;
    }

    // Check if username already exists
    const exists = userConfigs.some(
      (config) => config.username.toLowerCase() === newUser.username.toLowerCase()
    );

    if (exists) {
      toast({
        title: "اسم المستخدم موجود بالفعل",
        description: "الرجاء اختيار اسم مستخدم مختلف",
        variant: "destructive",
      });
      return;
    }

    addUserConfig(newUser);
    resetNewUser();
    
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة المستخدم بنجاح",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-muted/30 rounded-lg p-4 border border-border"
    >
      <h3 className="text-sm font-medium mb-3">إضافة مستخدم جديد</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="username" className="font-medium">
              اسم المستخدم <span className="text-destructive">*</span>
            </label>
            <Input
              id="username"
              placeholder="أدخل اسم المستخدم"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="font-medium">
              البريد الإلكتروني
            </label>
            <Input
              id="email"
              type="email"
              placeholder="أدخل البريد الإلكتروني"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="font-medium">
            كلمة المرور <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="أدخل كلمة المرور"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="maxNumbers" className="font-medium">الحد الأقصى للأرقام</label>
                <span className="text-sm">{newUser.maxNumbers}</span>
              </div>
              <Slider 
                id="maxNumbers"
                min={1} 
                max={20} 
                step={1}
                value={[newUser.maxNumbers]}
                onValueChange={(value) => setNewUser({ ...newUser, maxNumbers: value[0] })}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="sessionLength" className="font-medium">مدة الجلسة (ساعات)</label>
                <span className="text-sm">{newUser.sessionLength}</span>
              </div>
              <Slider 
                id="sessionLength"
                min={1} 
                max={24} 
                step={1}
                value={[newUser.sessionLength]}
                onValueChange={(value) => setNewUser({ ...newUser, sessionLength: value[0] })}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleAddUser}>
            <Check size={16} className="ml-2" />
            حفظ
          </Button>
          <Button variant="outline" onClick={resetNewUser}>
            <X size={16} className="ml-2" />
            إلغاء
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddUserForm;
