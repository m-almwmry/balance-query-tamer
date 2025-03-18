
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash, Edit, Check, X, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedCard from '@/components/ui/AnimatedCard';
import NumberInput from '@/components/ui/NumberInput';
import { useConfig, NumberEntry } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';
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

const NumbersPanel = () => {
  const { user } = useAuth();
  const { 
    numbers, 
    addNumber, 
    updateNumber, 
    deleteNumber, 
    getUserNumbers, 
    getNumberCount, 
    isUserAtNumberLimit 
  } = useConfig();

  const [newNumber, setNewNumber] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumber, setEditNumber] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [numberToDelete, setNumberToDelete] = useState<NumberEntry | null>(null);

  const userNumbers = user ? getUserNumbers(user.id) : [];
  const numberCount = user ? getNumberCount(user.id) : 0;
  const atLimit = user ? isUserAtNumberLimit(user.id) : true;

  const handleAddNumber = () => {
    if (!user) return;
    
    if (!newNumber) {
      toast({
        title: "Input required",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    if (atLimit) {
      toast({
        title: "Limit reached",
        description: "You have reached your number limit",
        variant: "destructive",
      });
      return;
    }

    addNumber({
      number: newNumber,
      description: newDescription,
      userId: user.id,
      isActive: true,
    });

    setNewNumber('');
    setNewDescription('');
  };

  const handleEdit = (number: NumberEntry) => {
    setEditingId(number.id);
    setEditNumber(number.number);
    setEditDescription(number.description);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    if (!editNumber) {
      toast({
        title: "Input required",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    updateNumber(editingId, {
      number: editNumber,
      description: editDescription,
    });

    setEditingId(null);
    setEditNumber('');
    setEditDescription('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNumber('');
    setEditDescription('');
  };

  const handleDeleteClick = (number: NumberEntry) => {
    setNumberToDelete(number);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (numberToDelete) {
      deleteNumber(numberToDelete.id);
      setDeleteDialogOpen(false);
      setNumberToDelete(null);
    }
  };

  const handleToggleActive = (id: string, currentState: boolean) => {
    updateNumber(id, { isActive: !currentState });
  };

  return (
    <AnimatedCard className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Phone Numbers</h2>
          <Badge variant="outline" className="px-3 py-1">
            {numberCount} / {user?.role === 'admin' ? '∞' : '10'} numbers
          </Badge>
        </div>

        {/* Add New Number Form */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <h3 className="text-sm font-medium mb-3">Add New Number</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="Phone Number"
                placeholder="Enter phone number"
                value={newNumber}
                onChange={setNewNumber}
                required
              />
              <div className="space-y-2">
                <label htmlFor="description" className="font-medium">Description</label>
                <Input
                  id="description"
                  placeholder="Enter description (optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={handleAddNumber} 
              disabled={!newNumber || atLimit}
              className="w-full md:w-auto"
            >
              <Plus size={16} className="mr-2" />
              Add Number
            </Button>
          </div>
        </div>

        {/* Numbers List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Your Numbers</h3>
          
          {userNumbers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
              No numbers added yet. Add your first number above.
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
              {userNumbers.map((numberEntry) => (
                <motion.div
                  key={numberEntry.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className={cn(
                    "border border-border rounded-lg p-4 transition-all",
                    "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
                    editingId === numberEntry.id ? "bg-muted/40" : "bg-background",
                    !numberEntry.isActive && "opacity-60"
                  )}
                >
                  {editingId === numberEntry.id ? (
                    // Edit Mode
                    <div className="flex-1 w-full space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberInput
                          label="Phone Number"
                          value={editNumber}
                          onChange={setEditNumber}
                          required
                        />
                        <div className="space-y-2">
                          <label className="font-medium">Description</label>
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description (optional)"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check size={16} className="mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X size={16} className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{numberEntry.number}</span>
                          <Badge 
                            variant={numberEntry.isActive ? "default" : "outline"} 
                            className="ml-3"
                          >
                            {numberEntry.isActive ? "Active" : "Paused"}
                          </Badge>
                        </div>
                        {numberEntry.description && (
                          <p className="text-sm text-muted-foreground">{numberEntry.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleActive(numberEntry.id, numberEntry.isActive)}
                          className="h-8 w-8 rounded-full"
                        >
                          {numberEntry.isActive ? (
                            <PauseCircle size={16} />
                          ) : (
                            <PlayCircle size={16} />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(numberEntry)}
                          className="h-8 w-8 rounded-full"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(numberEntry)}
                          className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </>
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
            <DialogTitle>Delete Number</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the number{' '}
              <span className="font-medium">{numberToDelete?.number}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedCard>
  );
};

// Helper function for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default NumbersPanel;
