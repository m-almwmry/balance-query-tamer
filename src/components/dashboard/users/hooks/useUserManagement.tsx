
import { useState } from 'react';
import { UserConfig, useConfig } from '@/contexts/ConfigContext';
import { toast } from '@/components/ui/use-toast';

export const useUserManagement = () => {
  const { userConfigs, addUserConfig, updateUserConfig, deleteUserConfig } = useConfig();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserConfig | null>(null);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<UserConfig | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [recoveryEmailDialogOpen, setRecoveryEmailDialogOpen] = useState(false);
  const [userToSendRecovery, setUserToSendRecovery] = useState<UserConfig | null>(null);

  const handleDeleteClick = (user: UserConfig) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUserConfig(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      
      toast({
        title: "تم الحذف",
        description: "تم حذف المستخدم بنجاح",
      });
    }
  };

  const handleToggleActive = (id: string, currentState: boolean) => {
    updateUserConfig(id, { isActive: !currentState });
    
    toast({
      title: currentState ? "تم تعطيل المستخدم" : "تم تفعيل المستخدم",
      description: currentState ? "تم تعطيل المستخدم بنجاح" : "تم تفعيل المستخدم بنجاح",
    });
  };

  const handleResetPasswordClick = (user: UserConfig) => {
    setUserToResetPassword(user);
    setNewPassword('');
    setResetPasswordDialogOpen(true);
  };

  const handleResetPassword = () => {
    if (!userToResetPassword || !newPassword) {
      toast({
        title: "كلمة المرور مطلوبة",
        description: "الرجاء إدخال كلمة مرور جديدة",
        variant: "destructive",
      });
      return;
    }

    updateUserConfig(userToResetPassword.id, { password: newPassword });
    setResetPasswordDialogOpen(false);
    setUserToResetPassword(null);
    setNewPassword('');
    
    toast({
      title: "تم تغيير كلمة المرور",
      description: "تم تغيير كلمة المرور بنجاح",
    });
  };

  const handleSendPasswordRecoveryClick = (user: UserConfig) => {
    setUserToSendRecovery(user);
    setRecoveryEmailDialogOpen(true);
  };

  const handleSendPasswordRecovery = () => {
    if (!userToSendRecovery || !userToSendRecovery.email) {
      toast({
        title: "البريد الإلكتروني مطلوب",
        description: "المستخدم ليس لديه بريد إلكتروني مسجل",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "تم إرسال رابط استعادة كلمة المرور",
      description: `تم إرسال رابط استعادة كلمة المرور إلى ${userToSendRecovery.email}`,
    });
    
    setRecoveryEmailDialogOpen(false);
    setUserToSendRecovery(null);
  };

  return {
    userConfigs,
    editingId,
    setEditingId,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    resetPasswordDialogOpen,
    setResetPasswordDialogOpen,
    userToResetPassword,
    setUserToResetPassword,
    newPassword,
    setNewPassword,
    recoveryEmailDialogOpen,
    setRecoveryEmailDialogOpen,
    userToSendRecovery,
    setUserToSendRecovery,
    handleDeleteClick,
    handleConfirmDelete,
    handleToggleActive,
    handleResetPasswordClick,
    handleResetPassword,
    handleSendPasswordRecoveryClick,
    handleSendPasswordRecovery,
  };
};
