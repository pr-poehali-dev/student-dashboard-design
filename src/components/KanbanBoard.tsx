import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  files: string[];
  responsible: string;
  executors: string[];
  startDate: string;
  deadline: string;
  priority: number;
  points: number;
  result: {
    description: string;
    file: string;
  };
  skills: string[];
  creator: string;
  columnId: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  isDeletable: boolean;
}

const priorityColors = ['bg-gray-200', 'bg-blue-200', 'bg-yellow-200', 'bg-orange-200', 'bg-red-200'];

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: '0', title: 'Мечты', order: 0, isDeletable: false },
    { id: '1', title: 'В работе', order: 1, isDeletable: true },
    { id: '2', title: 'Выполнено', order: 2, isDeletable: true }
  ]);

  const [tasks, setTasks] = useState<KanbanTask[]>([
    {
      id: '1',
      title: 'Изучить React',
      description: 'Пройти курс по React',
      files: [],
      responsible: 'Иванов А.',
      executors: [],
      startDate: '2024-01-15',
      deadline: '2024-02-15',
      priority: 3,
      points: 5,
      result: { description: '', file: '' },
      skills: ['React', 'JavaScript'],
      creator: 'Иванов А.',
      columnId: '0'
    }
  ]);

  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);

  const [newColumn, setNewColumn] = useState({ title: '' });
  const [newTask, setNewTask] = useState<Partial<KanbanTask>>({
    title: '',
    description: '',
    files: [],
    responsible: '',
    executors: [],
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    priority: 1,
    points: 1,
    result: { description: '', file: '' },
    skills: [],
    creator: 'Иванов А.',
    columnId: '0'
  });

  const handleAddColumn = () => {
    if (!newColumn.title.trim()) return;
    const column: KanbanColumn = {
      id: Date.now().toString(),
      title: newColumn.title,
      order: columns.length,
      isDeletable: true
    };
    setColumns([...columns, column]);
    setNewColumn({ title: '' });
    setColumnDialogOpen(false);
    toast({ title: 'Столбец добавлен' });
  };

  const handleEditColumn = (column: KanbanColumn) => {
    setEditingColumn(column);
    setNewColumn({ title: column.title });
    setColumnDialogOpen(true);
  };

  const handleUpdateColumn = () => {
    if (!editingColumn || !newColumn.title.trim()) return;
    setColumns(columns.map(col => 
      col.id === editingColumn.id ? { ...col, title: newColumn.title } : col
    ));
    setEditingColumn(null);
    setNewColumn({ title: '' });
    setColumnDialogOpen(false);
    toast({ title: 'Столбец обновлен' });
  };

  const handleDeleteColumn = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column?.isDeletable) {
      toast({ title: 'Ошибка', description: 'Этот столбец нельзя удалить', variant: 'destructive' });
      return;
    }
    setColumns(columns.filter(col => col.id !== columnId));
    setTasks(tasks.filter(task => task.columnId !== columnId));
    toast({ title: 'Столбец удален' });
  };

  const handleAddTask = () => {
    if (!newTask.title?.trim()) return;
    const task: KanbanTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      files: newTask.files || [],
      responsible: newTask.responsible || '',
      executors: newTask.executors || [],
      startDate: newTask.startDate || new Date().toISOString().split('T')[0],
      deadline: newTask.deadline || '',
      priority: newTask.priority || 1,
      points: newTask.points || 1,
      result: newTask.result || { description: '', file: '' },
      skills: newTask.skills || [],
      creator: newTask.creator || 'Иванов А.',
      columnId: newTask.columnId || '0'
    };
    setTasks([...tasks, task]);
    resetNewTask();
    setTaskDialogOpen(false);
    toast({ title: 'Задача добавлена' });
  };

  const handleEditTask = (task: KanbanTask) => {
    setEditingTask(task);
    setNewTask(task);
    setTaskDialogOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !newTask.title?.trim()) return;
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? { ...task, ...newTask } as KanbanTask : task
    ));
    setEditingTask(null);
    resetNewTask();
    setTaskDialogOpen(false);
    toast({ title: 'Задача обновлена' });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({ title: 'Задача удалена' });
  };

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      files: [],
      responsible: '',
      executors: [],
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      priority: 1,
      points: 1,
      result: { description: '', file: '' },
      skills: [],
      creator: 'Иванов А.',
      columnId: '0'
    });
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'column') {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      setColumns(newColumns.map((col, index) => ({ ...col, order: index })));
      return;
    }

    if (type === 'task') {
      const task = tasks.find(t => t.id === draggableId);
      if (!task) return;

      setTasks(tasks.map(t => 
        t.id === draggableId ? { ...t, columnId: destination.droppableId } : t
      ));
    }
  };

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.columnId === columnId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kanban доска</h2>
        <div className="flex gap-2">
          <Dialog open={columnDialogOpen} onOpenChange={(open) => {
            setColumnDialogOpen(open);
            if (!open) {
              setEditingColumn(null);
              setNewColumn({ title: '' });
            }
          }}>
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
                <Button variant="outline" onClick={() => {
                  setColumnDialogOpen(false);
                  setEditingColumn(null);
                  setNewColumn({ title: '' });
                }}>
                  Отмена
                </Button>
                <Button onClick={editingColumn ? handleUpdateColumn : handleAddColumn}>
                  {editingColumn ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={taskDialogOpen} onOpenChange={(open) => {
            setTaskDialogOpen(open);
            if (!open) {
              setEditingTask(null);
              resetNewTask();
            }
          }}>
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
                <Button variant="outline" onClick={() => {
                  setTaskDialogOpen(false);
                  setEditingTask(null);
                  resetNewTask();
                }}>
                  Отмена
                </Button>
                <Button onClick={editingTask ? handleUpdateTask : handleAddTask}>
                  {editingTask ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 overflow-x-auto pb-4"
            >
              {columns.sort((a, b) => a.order - b.order).map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex-shrink-0 w-80"
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <div {...provided.dragHandleProps} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon name="GripVertical" size={16} className="text-gray-400" />
                              <CardTitle className="text-base">{column.title}</CardTitle>
                              <Badge variant="secondary">{getTasksByColumn(column.id).length}</Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditColumn(column)}
                              >
                                <Icon name="Edit" size={14} />
                              </Button>
                              {column.isDeletable && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteColumn(column.id)}
                                  className="text-red-600"
                                >
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Droppable droppableId={column.id} type="task">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`space-y-2 min-h-[100px] p-2 rounded-lg transition-colors ${
                                  snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                                }`}
                              >
                                {getTasksByColumn(column.id).map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                          <CardContent className="p-3">
                                            <div className="flex items-start justify-between mb-2">
                                              <h4 className="font-semibold text-sm">{task.title}</h4>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteTask(task.id);
                                                }}
                                                className="h-6 w-6 p-0 text-red-600"
                                              >
                                                <Icon name="X" size={12} />
                                              </Button>
                                            </div>
                                            {task.description && (
                                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                {task.description}
                                              </p>
                                            )}
                                            <div className="flex flex-wrap gap-1 mb-2">
                                              <Badge className={`${priorityColors[task.priority - 1]} text-xs`}>
                                                P{task.priority}
                                              </Badge>
                                              <Badge variant="outline" className="text-xs">
                                                {task.points} баллов
                                              </Badge>
                                            </div>
                                            {task.skills.length > 0 && (
                                              <div className="flex flex-wrap gap-1 mb-2">
                                                {task.skills.map((skill, i) => (
                                                  <Badge key={i} variant="secondary" className="text-xs">
                                                    {skill}
                                                  </Badge>
                                                ))}
                                              </div>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                              <span>{task.deadline}</span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEditTask(task);
                                                }}
                                                className="h-6 px-2"
                                              >
                                                <Icon name="Edit" size={12} />
                                              </Button>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;