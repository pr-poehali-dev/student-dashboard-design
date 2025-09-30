import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { KanbanTask, priorityColors } from './types';

interface TaskCardProps {
  task: KanbanTask;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm">{task.title}</h4>
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