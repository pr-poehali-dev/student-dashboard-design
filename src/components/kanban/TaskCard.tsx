import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { KanbanTask, priorityColors } from './types';

interface TaskCardProps {
  task: KanbanTask;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  onClick: (task: KanbanTask) => void;
  onToggleComplete: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onClick, onToggleComplete }: TaskCardProps) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(task)}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5"
          />
          <h4 className={`font-semibold text-sm flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
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
            {task.skills.slice(0, 2).map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {task.skills.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{task.skills.length - 2}
              </Badge>
            )}
          </div>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{task.deadline}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="h-6 px-2"
          >
            <Icon name="Edit" size={12} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;