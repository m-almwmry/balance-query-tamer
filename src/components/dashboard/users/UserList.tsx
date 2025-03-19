
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserConfig, useConfig } from '@/contexts/ConfigContext';
import UserCard from './UserCard';

interface UserListProps {
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setResetPasswordDialogOpen: (open: boolean) => void;
  setRecoveryEmailDialogOpen: (open: boolean) => void;
}

const UserList = ({ 
  editingId, 
  setEditingId,
  setDeleteDialogOpen,
  setResetPasswordDialogOpen,
  setRecoveryEmailDialogOpen
}: UserListProps) => {
  const { userConfigs } = useConfig();
  const [userToDelete, setUserToDelete] = useState<UserConfig | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<UserConfig | null>(null);
  const [userToSendRecovery, setUserToSendRecovery] = useState<UserConfig | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (user: UserConfig) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleResetPasswordClick = (user: UserConfig) => {
    setUserToResetPassword(user);
    setResetPasswordDialogOpen(true);
  };

  const handleSendPasswordRecoveryClick = (user: UserConfig) => {
    setUserToSendRecovery(user);
    setRecoveryEmailDialogOpen(true);
  };

  return (
    <motion.div
      className="space-y-2"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {userConfigs.map((config) => (
        <UserCard
          key={config.id}
          config={config}
          editingId={editingId}
          onEdit={handleEdit}
          onCancelEdit={handleCancelEdit}
          onDelete={handleDeleteClick}
          onResetPassword={handleResetPasswordClick}
          onSendRecovery={handleSendPasswordRecoveryClick}
        />
      ))}
    </motion.div>
  );
};

export default UserList;
