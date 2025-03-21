
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash, Edit, Check, X, PlayCircle, PauseCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { useConfig, ApiConfig } from '@/contexts/ConfigContext';
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
import { cn } from '@/lib/utils';

const APIConfigPanel = () => {
  const { apiConfigs, addApiConfig, updateApiConfig, deleteApiConfig } = useConfig();

  const [isAddingConfig, setIsAddingConfig] = useState(false);
  const [newConfig, setNewConfig] = useState({
    name: '',
    url: '',
    username: '',
    password: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState({
    name: '',
    url: '',
    username: '',
    password: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<ApiConfig | null>(null);

  const resetNewConfig = () => {
    setNewConfig({
      name: '',
      url: '',
      username: '',
      password: '',
    });
    setIsAddingConfig(false);
  };

  const handleAddConfig = () => {
    if (!newConfig.name || !newConfig.url) {
      toast({
        title: "الحقول المطلوبة مفقودة",
        description: "الاسم وعنوان URL مطلوبان",
        variant: "destructive",
      });
      return;
    }

    addApiConfig({
      ...newConfig,
      isActive: true,
    });

    resetNewConfig();
  };

  const handleEdit = (config: ApiConfig) => {
    setEditingId(config.id);
    setEditConfig({
      name: config.name,
      url: config.url,
      username: config.username,
      password: config.password,
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    if (!editConfig.name || !editConfig.url) {
      toast({
        title: "الحقول المطلوبة مفقودة",
        description: "الاسم وعنوان URL مطلوبان",
        variant: "destructive",
      });
      return;
    }

    updateApiConfig(editingId, editConfig);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (config: ApiConfig) => {
    setConfigToDelete(config);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (configToDelete) {
      deleteApiConfig(configToDelete.id);
      setDeleteDialogOpen(false);
      setConfigToDelete(null);
    }
  };

  const handleToggleActive = (id: string, currentState: boolean) => {
    updateApiConfig(id, { isActive: !currentState });
  };

  return (
    <AnimatedCard className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">إعدادات واجهة API</h2>
          <Button 
            onClick={() => setIsAddingConfig(true)}
            disabled={isAddingConfig}
          >
            <Plus size={16} className="ml-2" />
            إضافة API
          </Button>
        </div>

        {/* Add New API Form */}
        {isAddingConfig && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-muted/30 rounded-lg p-4 border border-border"
          >
            <h3 className="text-sm font-medium mb-3">إضافة API جديد</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-medium">
                    الاسم <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="اسم API"
                    value={newConfig.name}
                    onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="url" className="font-medium">
                    عنوان URL <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="url"
                    placeholder="https://api.example.com"
                    value={newConfig.url}
                    onChange={(e) => setNewConfig({ ...newConfig, url: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="font-medium">اسم المستخدم</label>
                  <Input
                    id="username"
                    placeholder="اسم المستخدم (اختياري)"
                    value={newConfig.username}
                    onChange={(e) => setNewConfig({ ...newConfig, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="font-medium">كلمة المرور</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="كلمة المرور (اختيارية)"
                    value={newConfig.password}
                    onChange={(e) => setNewConfig({ ...newConfig, password: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddConfig}>
                  <Check size={16} className="ml-2" />
                  حفظ
                </Button>
                <Button variant="outline" onClick={resetNewConfig}>
                  <X size={16} className="ml-2" />
                  إلغاء
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Configs List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">واجهات API المكونة</h3>
          
          {apiConfigs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
              لا توجد إعدادات API بعد. أضف أول API باستخدام الزر أعلاه.
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
              {apiConfigs.map((config) => (
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor={`edit-name-${config.id}`} className="font-medium">
                            الاسم <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id={`edit-name-${config.id}`}
                            value={editConfig.name}
                            onChange={(e) => setEditConfig({ ...editConfig, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`edit-url-${config.id}`} className="font-medium">
                            عنوان URL <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id={`edit-url-${config.id}`}
                            value={editConfig.url}
                            onChange={(e) => setEditConfig({ ...editConfig, url: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor={`edit-username-${config.id}`} className="font-medium">اسم المستخدم</label>
                          <Input
                            id={`edit-username-${config.id}`}
                            value={editConfig.username}
                            onChange={(e) => setEditConfig({ ...editConfig, username: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`edit-password-${config.id}`} className="font-medium">كلمة المرور</label>
                          <Input
                            id={`edit-password-${config.id}`}
                            type="password"
                            value={editConfig.password}
                            onChange={(e) => setEditConfig({ ...editConfig, password: e.target.value })}
                            placeholder="اترك فارغًا للاحتفاظ بكلمة المرور الحالية"
                          />
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
                          <h4 className="font-medium">{config.name}</h4>
                          <Badge 
                            variant={config.isActive ? "default" : "outline"} 
                            className="mr-3"
                          >
                            {config.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{config.url}</p>
                        {config.username && (
                          <p className="text-xs text-muted-foreground">اسم المستخدم: {config.username}</p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleActive(config.id, config.isActive)}
                          className="h-8 w-8 rounded-full"
                        >
                          {config.isActive ? (
                            <PauseCircle size={16} />
                          ) : (
                            <PlayCircle size={16} />
                          )}
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
            <DialogTitle>حذف إعداد API</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف إعداد API{' '}
              <span className="font-medium">{configToDelete?.name}</span>؟
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

export default APIConfigPanel;
