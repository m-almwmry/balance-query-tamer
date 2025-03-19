
import React from 'react';
import { motion } from 'framer-motion';
import { Trash, Edit, Check, X, Clock, Plus, MailCheck, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { UserConfig, useConfig } from '@/contexts/ConfigContext';
import { toast } from '@/components/ui/use-toast';
import EditUserForm from './EditUserForm';

interface UserCardProps {
  config: UserConfig;
  editingId: string | null;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (user: UserConfig) => void;
  onResetPassword: (user: UserConfig) => void;
  onSendRecovery: (user: UserConfig) => void;
}

const UserCard = ({
  config,
  editingId,
  onEdit,
  onCancelEdit,
  onDelete,
  onResetPassword,
  onSendRecovery
}: UserCardProps) => {
  const { updateUserConfig } = useConfig();

  const handleToggleActive = (id: string, currentState: boolean) => {
    updateUserConfig(id, { isActive: !currentState });
    
    toast({
      title: currentState ? "تم تعطيل المستخدم" : "تم تفعيل المستخدم",
      description: currentState ? "تم تعطيل المستخدم بنجاح" : "تم تفعيل المستخدم بنجاح",
    });
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      className={cn(
        "border border-border rounded-lg p-4 transition-all",
        editingId === config.id ? "bg-muted/40" : "bg-background",
        !config.isActive && "opacity-60"
      )}
    >
      {editingId === config.id ? (
        // Edit Mode
        <EditUserForm 
          user={config} 
          onCancel={onCancelEdit} 
        />
      ) : (
        // View Mode
        <div className="flex flex-col md:flex-row justify-between">
          <div className="space-y-2">
            <div className="flex items-center">
              <h4 className="font-medium">{config.username}</h4>
              <Badge 
                variant={config.isActive ? "default" : "outline"} 
                className="mr-3"
              >
                {config.isActive ? "نشط" : "غير نشط"}
              </Badge>
            </div>
            <div className="flex flex-col md:flex-row gap-1 md:gap-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <Plus size={14} className="ml-1" />
                أقصى عدد للأرقام: {config.maxNumbers}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="ml-1" />
                مدة الجلسة: {config.sessionLength} ساعات
              </div>
              {config.email && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MailCheck size={14} className="ml-1" />
                  {config.email}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResetPassword(config)}
              className="h-8"
            >
              <KeyRound size={14} className="ml-1" />
              تغيير كلمة المرور
            </Button>
            
            {config.email && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSendRecovery(config)}
                className="h-8"
              >
                <MailCheck size={14} className="ml-1" />
                استعادة كلمة المرور
              </Button>
            )}
            
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleToggleActive(config.id, config.isActive)}
                className={cn(
                  "h-8 w-8 rounded-full",
                  config.isActive ? "bg-primary text-primary-foreground" : ""
                )}
                title={config.isActive ? "تعطيل المستخدم" : "تفعيل المستخدم"}
              >
                {config.isActive ? <Check size={16} /> : <X size={16} />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(config.id)}
                className="h-8 w-8 rounded-full"
              >
                <Edit size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(config)}
                className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;
