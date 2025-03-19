
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConfig, UserConfig } from '@/contexts/ConfigContext';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface UserDialogsProps {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  resetPasswordDialogOpen: boolean;
  setResetPasswordDialogOpen: (open: boolean) => void;
  recoveryEmailDialogOpen: boolean;
  setRecoveryEmailDialogOpen: (open: boolean) => void;
}

export const UserDialogs = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  resetPasswordDialogOpen,
  setResetPasswordDialogOpen,
  recoveryEmailDialogOpen,
  setRecoveryEmailDialogOpen
}: UserDialogsProps) => {
  const { userConfigs, deleteUserConfig, updateUserConfig } = useConfig();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [userToDelete, setUserToDelete] = useState<UserConfig | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<UserConfig | null>(null);
  const [userToSendRecovery, setUserToSendRecovery] = useState<UserConfig | null>(null);

  // Handlers for delete dialog
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

  // Handlers for reset password dialog
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

  // Handlers for recovery email dialog
  const handleSendPasswordRecovery = () => {
    if (!userToSendRecovery || !userToSendRecovery.email) {
      toast({
        title: "البريد الإلكتروني مطلوب",
        description: "المستخدم ليس لديه بريد إلكتروني مسجل",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, you would send a password reset email here
    toast({
      title: "تم إرسال رابط استعادة كلمة المرور",
      description: `تم إرسال رابط استعادة كلمة المرور إلى ${userToSendRecovery.email}`,
    });
    
    setRecoveryEmailDialogOpen(false);
    setUserToSendRecovery(null);
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المستخدم</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف المستخدم{' '}
              <span className="font-medium">{userToDelete?.username}</span>؟
              لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغيير كلمة المرور</DialogTitle>
            <DialogDescription>
              أدخل كلمة المرور الجديدة للمستخدم{' '}
              <span className="font-medium">{userToResetPassword?.username}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="new-password" className="font-medium">
                كلمة المرور الجديدة <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPasswordDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="default"
              onClick={handleResetPassword}
              disabled={!newPassword}
            >
              تغيير كلمة المرور
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Recovery Dialog */}
      <Dialog open={recoveryEmailDialogOpen} onOpenChange={setRecoveryEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>استعادة كلمة المرور</DialogTitle>
            <DialogDescription>
              سيتم إرسال رابط استعادة كلمة المرور إلى البريد الإلكتروني المسجل للمستخدم{' '}
              <span className="font-medium">{userToSendRecovery?.username}</span>
              {userToSendRecovery?.email && (
                <>
                  {' '}<br />
                  <span className="font-medium mt-2 block">{userToSendRecovery.email}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRecoveryEmailDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="default"
              onClick={handleSendPasswordRecovery}
              disabled={!userToSendRecovery?.email}
            >
              إرسال رابط الاستعادة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
