import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { KanbanTask, KanbanColumn } from './kanban/types';
import ColumnDialog from './kanban/ColumnDialog';
import TaskDialog from './kanban/TaskDialog';
import KanbanColumnComponent from './kanban/KanbanColumn';
import { TaskDetailDialog } from './kanban/TaskDetailDialog';
import Icon from '@/components/ui/icon';
import { Skill } from './skills/SkillsTab';

interface KanbanBoardWithSkillsProps {
  skills: Skill[];
  onUpdateSkills: (skills: Skill[]) => void;
}

export const KanbanBoardWithSkills = ({ skills, onUpdateSkills }: KanbanBoardWithSkillsProps) => {
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
      columnId: '0',
      tags: ['обучение'],
      completed: false,
      comments: []
    }
  ]);

  const [availableTags, setAvailableTags] = useState<string[]>([
    'обучение', 'работа', 'проект', 'срочно', 'важно'
  ]);

  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [newTaskColumnId, setNewTaskColumnId] = useState<string>('0');

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
    columnId: '0',
    tags: [],
    completed: false,
    comments: []
  });

  const availableSkills = skills.map(s => s.name);

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

  const handleCancelColumn = () => {
    setColumnDialogOpen(false);
    setEditingColumn(null);
    setNewColumn({ title: '' });
  };

  const addPointsToSkills = (taskSkills: string[], points: number) => {
    const updatedSkills = skills.map(skill => {
      if (taskSkills.includes(skill.name)) {
        const newPoints = skill.points + points;
        const newLevel = Math.floor(newPoints / 10) + 1;
        return { ...skill, points: newPoints, level: newLevel };
      }
      return skill;
    });
    onUpdateSkills(updatedSkills);
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
      columnId: newTaskColumnId,
      tags: newTask.tags || [],
      completed: false,
      comments: []
    };
    setTasks([...tasks, task]);
    resetNewTask();
    setTaskDialogOpen(false);
    toast({ title: 'Задача добавлена' });
  };

  const handleOpenTaskDialog = (columnId: string) => {
    setNewTaskColumnId(columnId);
    setEditingTask(null);
    resetNewTask();
    setTaskDialogOpen(true);
  };

  const handleEditTask = (task: KanbanTask) => {
    setEditingTask(task);
    setNewTask(task);
    setNewTaskColumnId(task.columnId);
    setTaskDialogOpen(true);
  };

  const handleUpdateTask = (updatedTask: KanbanTask) => {
    const oldTask = tasks.find(t => t.id === updatedTask.id);
    
    if (oldTask && !oldTask.completed && updatedTask.completed) {
      addPointsToSkills(updatedTask.skills, updatedTask.points);
      toast({ 
        title: 'Задача выполнена! 🎉', 
        description: `+${updatedTask.points} баллов к навыкам: ${updatedTask.skills.join(', ')}`
      });
    }
    
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleUpdateTaskFromDialog = () => {
    if (!editingTask || !newTask.title?.trim()) return;
    const updatedTask = { ...editingTask, ...newTask, columnId: newTaskColumnId } as KanbanTask;
    handleUpdateTask(updatedTask);
    setEditingTask(null);
    resetNewTask();
    setTaskDialogOpen(false);
    toast({ title: 'Задача обновлена' });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({ title: 'Задача удалена' });
  };

  const handleCancelTask = () => {
    setTaskDialogOpen(false);
    setEditingTask(null);
    resetNewTask();
  };

  const handleTaskClick = (task: KanbanTask) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleToggleTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = { ...task, completed: !task.completed };
    handleUpdateTask(updatedTask);
  };

  const handleAddSkill = (skill: string) => {
    const existingSkill = skills.find(s => s.name === skill);
    if (!existingSkill) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: skill,
        type: 'hard',
        points: 0,
        level: 1
      };
      onUpdateSkills([...skills, newSkill]);
    }
  };

  const handleAddTag = (tag: string) => {
    if (!availableTags.includes(tag)) {
      setAvailableTags([...availableTags, tag]);
    }
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
      columnId: newTaskColumnId,
      tags: [],
      completed: false,
      comments: []
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

      const updatedTask = { ...task, columnId: destination.droppableId };
      setTasks(tasks.map(t => 
        t.id === draggableId ? updatedTask : t
      ));
      
      toast({ title: 'Задача перемещена' });
    }
  };

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.columnId === columnId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kanban доска</h2>
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
                <KanbanColumnComponent
                  key={column.id}
                  column={column}
                  index={index}
                  tasks={getTasksByColumn(column.id)}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleOpenTaskDialog}
                  onTaskClick={handleTaskClick}
                  onToggleTaskComplete={handleToggleTaskComplete}
                />
              ))}
              {provided.placeholder}
              
              <div className="flex-shrink-0">
                <Button
                  variant="outline"
                  className="w-80 h-20 border-dashed"
                  onClick={() => {
                    setEditingColumn(null);
                    setNewColumn({ title: '' });
                    setColumnDialogOpen(true);
                  }}
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить столбец
                </Button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ColumnDialog
        open={columnDialogOpen}
        onOpenChange={(open) => {
          setColumnDialogOpen(open);
          if (!open) handleCancelColumn();
        }}
        editingColumn={editingColumn}
        newColumn={newColumn}
        setNewColumn={setNewColumn}
        onAdd={handleAddColumn}
        onUpdate={handleUpdateColumn}
        onCancel={handleCancelColumn}
      />

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={(open) => {
          setTaskDialogOpen(open);
          if (!open) handleCancelTask();
        }}
        editingTask={editingTask}
        newTask={newTask}
        setNewTask={setNewTask}
        columns={columns}
        onAdd={handleAddTask}
        onUpdate={handleUpdateTaskFromDialog}
        onCancel={handleCancelTask}
      />

      {selectedTask && (
        <TaskDetailDialog
          open={taskDetailOpen}
          onOpenChange={setTaskDetailOpen}
          task={selectedTask}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          availableSkills={availableSkills}
          availableTags={availableTags}
          onAddSkill={handleAddSkill}
          onAddTag={handleAddTag}
        />
      )}
    </div>
  );
};

export default KanbanBoardWithSkills;