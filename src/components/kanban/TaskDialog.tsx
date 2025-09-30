import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { KanbanTask, KanbanColumn } from './types';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask: KanbanTask | null;
  newTask: Partial<KanbanTask>;
  setNewTask: (task: Partial<KanbanTask>) => void;
  columns: KanbanColumn[];
  onAdd: () => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export const TaskDialog = ({
  open,
  onOpenChange,
  editingTask,
  newTask,
  setNewTask,
  columns,
  onAdd,
  onUpdate,
  onCancel
}: TaskDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Icon name="Plus" size={16} />
          Добавить задачу
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Редактировать задачу' : 'Новая задача'}</DialogTitle>
          <DialogDescription>Заполните информацию о задаче</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Название задачи *</Label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Название"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Описание задачи"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Столбец</Label>
              <Select value={newTask.columnId} onValueChange={(value) => setNewTask({ ...newTask, columnId: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(col => (
                    <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ответственный</Label>
              <Input
                value={newTask.responsible}
                onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
                placeholder="ФИО"
              />
            </div>
            <div className="space-y-2">
              <Label>Дата начала</Label>
              <Input
                type="date"
                value={newTask.startDate}
                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Дедлайн</Label>
              <Input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Приоритет (1-5)</Label>
              <Select 
                value={newTask.priority?.toString()} 
                onValueChange={(value) => setNewTask({ ...newTask, priority: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(p => (
                    <SelectItem key={p} value={p.toString()}>Приоритет {p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Баллы (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={newTask.points}
                onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Навыки (до 3, через запятую)</Label>
              <Input
                value={newTask.skills?.join(', ')}
                onChange={(e) => {
                  const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s).slice(0, 3);
                  setNewTask({ ...newTask, skills });
                }}
                placeholder="React, TypeScript, Node.js"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button onClick={editingTask ? onUpdate : onAdd}>
            {editingTask ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;