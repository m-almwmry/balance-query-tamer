
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { UserConfig, useConfig } from '@/contexts/ConfigContext';
import { toast } from '@/components/ui/use-toast';

interface EditUserFormProps {
  user: UserConfig;
  onCancel: () => void;
}

const EditUserForm = ({ user, onCancel }: EditUserFormProps) => {
  const { userConfigs, updateUserConfig } = useConfig();
  const [editUser, setEditUser] = useState({
    username: user.username,
    password: user.password || '',
    maxNumbers: user.maxNumbers,
    sessionLength: user.sessionLength,
    isActive: user.isActive,
    email: user.email || '',
  });

  const handleSaveEdit = () => {
    if (!editUser.username) {
      toast({
        title: "اسم المستخدم مطلوب",
        description: "الرجاء إدخال اسم مستخدم",
        variant: "destructive",
      });
      return;
    }

    // Check if username already exists (excluding the current user)
    const exists = userConfigs.some(
      (config) => 
        config.id !== user.id && 
        config.username.toLowerCase() === editUser.username.toLowerCase()
    );

    if (exists) {
      toast({
        title: "اسم المستخدم موجود بالفعل",
        description: "الرجاء اختيار اسم مستخدم مختلف",
        variant: "destructive",
      });
      return;
    }

    updateUserConfig(user.id, {
      username: editUser.username,
      maxNumbers: editUser.maxNumbers,
      sessionLength: editUser.sessionLength,
      isActive: editUser.isActive,
      email: editUser.email || undefined,
      password: editUser.password || undefined
    });
    
    onCancel();
    
    toast({
      title: "تم التحديث",
      description: "تم تحديث المستخدم بنجاح",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor={`edit-username-${user.id}`} className="font-medium">
            اسم المستخدم <span className="text-destructive">*</span>
          </label>
          <Input
            id={`edit-username-${user.id}`}
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`edit-email-${user.id}`} className="font-medium">
            البريد الإلكتروني
          </label>
          <Input
            id={`edit-email-${user.id}`}
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            placeholder="البريد الإلكتروني للمستخدم"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor={`edit-maxNumbers-${user.id}`} className="font-medium">الحد الأقصى للأرقام</label>
              <span className="text-sm">{editUser.maxNumbers}</span>
            </div>
            <Slider 
              id={`edit-maxNumbers-${user.id}`}
              min={1} 
              max={20} 
              step={1}
              value={[editUser.maxNumbers]}
              onValueChange={(value) => setEditUser({ ...editUser, maxNumbers: value[0] })}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor={`edit-sessionLength-${user.id}`} className="font-medium">مدة الجلسة (ساعات)</label>
              <span className="text-sm">{editUser.sessionLength}</span>
            </div>
            <Slider 
              id={`edit-sessionLength-${user.id}`}
              min={1} 
              max={24} 
              step={1}
              value={[editUser.sessionLength]}
              onValueChange={(value) => setEditUser({ ...editUser, sessionLength: value[0] })}
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSaveEdit}>
          <Check size={16} className="ml-2" />
          حفظ
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X size={16} className="ml-2" />
          إلغاء
        </Button>
      </div>
    </div>
  );
};

export default EditUserForm;
