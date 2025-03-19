
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { useConfig } from '@/contexts/ConfigContext';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import { UserDialogs } from './UserDialogs';

const UserManagementPanel = () => {
  const { userConfigs } = useConfig();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [recoveryEmailDialogOpen, setRecoveryEmailDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <AnimatedCard className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">إدارة المستخدمين</h2>
          <Button 
            onClick={() => setIsAddingUser(true)}
            disabled={isAddingUser}
          >
            <Plus size={16} className="ml-2" />
            إضافة مستخدم
          </Button>
        </div>

        {/* Add New User Form */}
        {isAddingUser && (
          <AddUserForm 
            onCancel={() => setIsAddingUser(false)} 
          />
        )}

        {/* Users List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">المستخدمون المسجلون</h3>
          
          {userConfigs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
              لا توجد مستخدمين مسجلين حتى الآن. أضف أول مستخدم باستخدام الزر أعلاه.
            </div>
          ) : (
            <UserList 
              editingId={editingId}
              setEditingId={setEditingId}
              setDeleteDialogOpen={setDeleteDialogOpen}
              setResetPasswordDialogOpen={setResetPasswordDialogOpen}
              setRecoveryEmailDialogOpen={setRecoveryEmailDialogOpen}
            />
          )}
        </div>
      </div>

      {/* All Dialogs */}
      <UserDialogs 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        resetPasswordDialogOpen={resetPasswordDialogOpen}
        setResetPasswordDialogOpen={setResetPasswordDialogOpen}
        recoveryEmailDialogOpen={recoveryEmailDialogOpen}
        setRecoveryEmailDialogOpen={setRecoveryEmailDialogOpen}
      />
    </AnimatedCard>
  );
};

export default UserManagementPanel;
