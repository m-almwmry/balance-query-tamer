
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash, Edit, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedCard from '@/components/ui/AnimatedCard';
import NumberInput from '@/components/ui/NumberInput';
import { useConfig, UserConfig } from '@/contexts/ConfigContext';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const UserManagementPanel = () => {
  const { userConfigs, addUserConfig, updateUserConfig, deleteUserConfig } = useConfig();

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    maxNumbers: 5,
    sessionLength: 8,
    isActive: true,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState({
    username: '',
    maxNumbers: 5,
    sessionLength: 8,
    isActive: true,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserConfig | null>(null);

  const resetNewUser = () => {
    setNewUser({
      username: '',
      maxNumbers: 5,
      sessionLength: 8,
      isActive: true,
    });
    setIsAddingUser(false);
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
  };

  const handleEdit = (user: UserConfig) => {
    setEditingId(user.id);
    setEditUser({
      username: user.username,
      maxNumbers: user.maxNumbers,
      sessionLength: user.sessionLength,
      isActive: user.isActive,
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

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
        config.id !== editingId && 
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

    updateUserConfig(editingId, editUser);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (user: UserConfig) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUserConfig(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleToggleActive = (id: string, currentState: boolean) => {
    updateUserConfig(id, { isActive: !currentState });
  };

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-muted/30 rounded-lg p-4 border border-border"
          >
            <h3 className="text-sm font-medium mb-3">إضافة مستخدم جديد</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
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
        )}

        {/* Users List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">المستخدمون المكونون</h3>
          
          {userConfigs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
              لا توجد تكوينات مستخدمين حتى الآن. أضف أول مستخدم باستخدام الزر أعلاه.
            </div>
          ) : (
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
                <motion.div
                  key={config.id}
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label htmlFor={`edit-username-${config.id}`} className="font-medium">
                            اسم المستخدم <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id={`edit-username-${config.id}`}
                            value={editUser.username}
                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <label htmlFor={`edit-maxNumbers-${config.id}`} className="font-medium">الحد الأقصى للأرقام</label>
                              <span className="text-sm">{editUser.maxNumbers}</span>
                            </div>
                            <Slider 
                              id={`edit-maxNumbers-${config.id}`}
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
                              <label htmlFor={`edit-sessionLength-${config.id}`} className="font-medium">مدة الجلسة (ساعات)</label>
                              <span className="text-sm">{editUser.sessionLength}</span>
                            </div>
                            <Slider 
                              id={`edit-sessionLength-${config.id}`}
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
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X size={16} className="ml-2" />
                          إلغاء
                        </Button>
                      </div>
                    </div>
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
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleToggleActive(config.id, config.isActive)}
                          className={cn(
                            "h-8 w-8 rounded-full",
                            config.isActive ? "bg-primary text-primary-foreground" : ""
                          )}
                        >
                          {config.isActive ? <Check size={16} /> : <X size={16} />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(config)}
                          className="h-8 w-8 rounded-full"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(config)}
                          className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

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
    </AnimatedCard>
  );
};

export default UserManagementPanel;
