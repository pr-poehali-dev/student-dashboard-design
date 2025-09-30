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

export const priorityColors = ['bg-gray-200', 'bg-blue-200', 'bg-yellow-200', 'bg-orange-200', 'bg-red-200'];