import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Stats {
  totalDays: number;
  completedTasks: number;
  totalTasks: number;
  activeProjects: number;
}

interface DashboardTabProps {
  stats: Stats;
  balance: number;
  income: number;
  expense: number;
  tasks: Task[];
  financePeriod: string;
  setFinancePeriod: (period: string) => void;
  toggleTask: (id: string) => void;
  onExport: () => void;
}

export const DashboardTab = ({
  stats,
  balance,
  income,
  expense,
  tasks,
  financePeriod,
  setFinancePeriod,
  toggleTask,
  onExport
}: DashboardTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onExport} variant="outline" size="sm" className="gap-2">
          <Icon name="FileSpreadsheet" size={16} />
          Экспорт в Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Дней активности</p>
            <p className="text-3xl font-bold text-primary">{stats.totalDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Прогресс задач</p>
            <p className="text-3xl font-bold text-accent">{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</p>
            <Progress value={stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Активные проекты</p>
            <p className="text-3xl font-bold">{stats.activeProjects}</p>
          </CardContent>
        </Card>
        <Card className={balance >= 0 ? "bg-green-50" : "bg-red-50"}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Баланс</p>
            <p className={`text-3xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {balance.toLocaleString()} ₽
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Финансы</CardTitle>
              <Select value={financePeriod} onValueChange={setFinancePeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 месяц</SelectItem>
                  <SelectItem value="3">3 месяца</SelectItem>
                  <SelectItem value="6">6 месяцев</SelectItem>
                  <SelectItem value="12">1 год</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Доходы</p>
              <p className="text-lg font-bold text-green-600">{income.toLocaleString()} ₽</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Расходы</p>
              <p className="text-lg font-bold text-red-600">{expense.toLocaleString()} ₽</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Последние задачи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                  <p className={`text-sm ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};