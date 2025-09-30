import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { KanbanColumn } from './types';

interface ColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingColumn: KanbanColumn | null;
  newColumn: { title: string };
  setNewColumn: (column: { title: string }) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export const ColumnDialog = ({
  open,
  onOpenChange,
  editingColumn,
  newColumn,
  setNewColumn,
  onAdd,
  onUpdate,
  onCancel
}: ColumnDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon name="Plus" size={16} />
          Добавить столбец
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingColumn ? 'Редактировать столбец' : 'Новый столбец'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Название столбца</Label>
            <Input
              value={newColumn.title}
              onChange={(e) => setNewColumn({ title: e.target.value })}
              placeholder="Введите название"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button onClick={editingColumn ? onUpdate : onAdd}>
            {editingColumn ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnDialog;