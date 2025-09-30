import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { KanbanColumn as KanbanColumnType, KanbanTask } from './types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  index: number;
  tasks: KanbanTask[];
  onEditColumn: (column: KanbanColumnType) => void;
  onDeleteColumn: (columnId: string) => void;
  onEditTask: (task: KanbanTask) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: KanbanTask) => void;
  onToggleTaskComplete: (taskId: string) => void;
}

export const KanbanColumnComponent = ({
  column,
  index,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onTaskClick,
  onToggleTaskComplete
}: KanbanColumnProps) => {
  return (
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
                  <Badge variant="secondary">{tasks.length}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditColumn(column)}
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  {column.isDeletable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteColumn(column.id)}
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
                    {tasks.map((task, taskIndex) => (
                      <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEditTask}
                              onDelete={onDeleteTask}
                              onClick={onTaskClick}
                              onToggleComplete={onToggleTaskComplete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Button
                variant="ghost"
                className="w-full mt-2 justify-start text-gray-600"
                onClick={() => onAddTask(column.id)}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить задачу
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanColumnComponent;