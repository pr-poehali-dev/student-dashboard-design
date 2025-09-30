import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("all");
  const [projectSearch, setProjectSearch] = useState("");
  const [financePeriod, setFinancePeriod] = useState("1");

  const [studentData, setStudentData] = useState({
    lastName: "Иванов",
    firstName: "Алексей",
    middleName: "Сергеевич",
    birthDate: "15.03.2002",
    city: "Москва",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
    education: [
      { institution: "МГУ им. М.В. Ломоносова", degree: "Бакалавр", field: "Информатика", years: "2020-2024" }
    ],
    work: [
      { company: "Tech Solutions", position: "Junior Developer", period: "2023-настоящее время" }
    ],
    achievements: [
      { title: "Победитель хакатона 2023", date: "Ноябрь 2023", icon: "Trophy" },
      { title: "Сертификат React Developer", date: "Сентябрь 2023", icon: "Award" },
      { title: "Top Student Award", date: "Июнь 2023", icon: "Medal" }
    ],
    projects: [
      { name: "E-commerce Platform", status: "В разработке", progress: 75, tech: ["React", "Node.js"] },
      { name: "Mobile App", status: "Завершен", progress: 100, tech: ["React Native"] },
      { name: "AI Chatbot", status: "В разработке", progress: 45, tech: ["Python", "TensorFlow"] }
    ]
  });

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Завершить модуль аутентификации", description: "Реализовать JWT токены", completed: true, createdAt: "2024-01-15" },
    { id: "2", title: "Код-ревью проекта", description: "Проверить pull requests", completed: false, createdAt: "2024-01-16" },
    { id: "3", title: "Написать тесты", description: "Unit тесты для API", completed: false, createdAt: "2024-01-17" }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", type: "income", amount: 50000, category: "Зарплата", description: "Зарплата за январь", date: "2024-01-31" },
    { id: "2", type: "expense", amount: 15000, category: "Обучение", description: "Онлайн курс", date: "2024-01-15" },
    { id: "3", type: "income", amount: 20000, category: "Фриланс", description: "Проект для клиента", date: "2024-02-10" },
    { id: "4", type: "expense", amount: 3000, category: "Транспорт", description: "Проездной", date: "2024-02-01" }
  ]);

  const [editForm, setEditForm] = useState({
    firstName: studentData.firstName,
    lastName: studentData.lastName,
    middleName: studentData.middleName,
    birthDate: studentData.birthDate,
    city: studentData.city,
    avatar: studentData.avatar
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: ""
  });

  const [newTransaction, setNewTransaction] = useState({
    type: "income" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    setStudentData({ ...studentData, ...editForm });
    setEditDialogOpen(false);
    toast({ title: "Профиль обновлен", description: "Изменения успешно сохранены" });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "" });
    setTaskDialogOpen(false);
    toast({ title: "Задача добавлена", description: "Новая задача создана успешно" });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({ title: "Задача удалена" });
  };

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) return;
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date
    };
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      type: "income",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
    setTransactionDialogOpen(false);
    toast({ title: "Транзакция добавлена", description: "Операция успешно записана" });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({ title: "Транзакция удалена" });
  };

  const getFilteredTransactions = () => {
    const monthsAgo = parseInt(financePeriod);
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };

  const calculateBalance = () => {
    const filtered = getFilteredTransactions();
    const income = filtered.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  const exportToPDF = () => {
    toast({ title: "Экспорт в PDF", description: "Функция в разработке. Статистика будет сохранена в PDF." });
  };

  const exportToExcel = () => {
    const { income, expense, balance } = calculateBalance();
    const completedTasksCount = tasks.filter(t => t.completed).length;
    
    const csvContent = [
      ["Метрика", "Значение"],
      ["Дней активности", stats.totalDays],
      ["Дней подряд", stats.loginStreak],
      ["Выполнено задач", completedTasksCount],
      ["Всего задач", tasks.length],
      ["Активных проектов", stats.activeProjects],
      ["Доходы", income],
      ["Расходы", expense],
      ["Баланс", balance]
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "statistics.csv";
    link.click();
    toast({ title: "Экспорт завершен", description: "Статистика сохранена в Excel" });
  };

  const filteredProjects = studentData.projects.filter((project) => {
    const matchesFilter = projectFilter === "all" || 
      (projectFilter === "active" && project.status === "В разработке") ||
      (projectFilter === "completed" && project.status === "Завершен");
    const matchesSearch = project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      project.tech.some(tech => tech.toLowerCase().includes(projectSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    loginStreak: 12,
    totalDays: 45,
    completedTasks: tasks.filter(t => t.completed).length,
    totalTasks: tasks.length,
    activeProjects: 3,
    completedProjects: 7
  };

  const weeklyActivity = [
    { day: "Пн", value: 8 },
    { day: "Вт", value: 6 },
    { day: "Ср", value: 10 },
    { day: "Чт", value: 7 },
    { day: "Пт", value: 9 },
    { day: "Сб", value: 5 },
    { day: "Вс", value: 4 }
  ];

  const projectProgress = [
    { month: "Янв", completed: 2 },
    { month: "Фев", completed: 3 },
    { month: "Мар", completed: 5 },
    { month: "Апр", completed: 4 },
    { month: "Май", completed: 6 },
    { month: "Июн", completed: 7 }
  ];

  const { income, expense, balance } = calculateBalance();

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${studentData.coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={studentData.avatar} alt={studentData.firstName} />
              <AvatarFallback className="text-3xl">{studentData.firstName[0]}{studentData.lastName[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">
                  {studentData.lastName} {studentData.firstName} {studentData.middleName}
                </h1>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="Edit" size={16} />
                      Редактировать
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Редактировать профиль</DialogTitle>
                      <DialogDescription>
                        Измените информацию о себе
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Аватар</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={editForm.avatar} />
                            <AvatarFallback>{editForm.firstName[0]}{editForm.lastName[0]}</AvatarFallback>
                          </Avatar>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input
                          id="lastName"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя</Label>
                        <Input
                          id="firstName"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName">Отчество</Label>
                        <Input
                          id="middleName"
                          value={editForm.middleName}
                          onChange={(e) => setEditForm({ ...editForm, middleName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Дата рождения</Label>
                        <Input
                          id="birthDate"
                          value={editForm.birthDate}
                          onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Город</Label>
                        <Input
                          id="city"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleEditProfile}>
                        Сохранить
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  <span>{studentData.birthDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  <span>{studentData.city}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Card className="bg-primary text-white">
                <CardContent className="p-4 text-center">
                  <Icon name="Flame" size={24} className="mx-auto mb-1" />
                  <div className="text-2xl font-bold">{stats.loginStreak}</div>
                  <div className="text-xs opacity-90">дней подряд</div>
                </CardContent>
              </Card>
              <Card className="bg-accent text-white">
                <CardContent className="p-4 text-center">
                  <Icon name="CheckCircle2" size={24} className="mx-auto mb-1" />
                  <div className="text-2xl font-bold">{stats.completedTasks}</div>
                  <div className="text-xs opacity-90">задач выполнено</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white shadow-sm p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="ListTodo" size={16} className="mr-2" />
              Задачи
            </TabsTrigger>
            <TabsTrigger value="finance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Wallet" size={16} className="mr-2" />
              Финансы
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="FolderKanban" size={16} className="mr-2" />
              Проекты
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Trophy" size={16} className="mr-2" />
              Достижения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="GraduationCap" size={20} />
                    Образование
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studentData.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-semibold text-gray-900">{edu.institution}</h4>
                      <p className="text-sm text-gray-600">{edu.degree} • {edu.field}</p>
                      <p className="text-xs text-gray-500 mt-1">{edu.years}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Briefcase" size={20} />
                    Опыт работы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studentData.work.map((job, index) => (
                    <div key={index} className="border-l-2 border-accent pl-4">
                      <h4 className="font-semibold text-gray-900">{job.company}</h4>
                      <p className="text-sm text-gray-600">{job.position}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.period}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex justify-end gap-2">
              <Button onClick={exportToPDF} variant="outline" size="sm" className="gap-2">
                <Icon name="FileText" size={16} />
                Экспорт в PDF
              </Button>
              <Button onClick={exportToExcel} variant="outline" size="sm" className="gap-2">
                <Icon name="FileSpreadsheet" size={16} />
                Экспорт в Excel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Дней активности</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.totalDays}</div>
                  <p className="text-xs text-gray-500 mt-1">Всего дней на платформе</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Прогресс задач</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</div>
                  <Progress value={stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">{stats.completedTasks} из {stats.totalTasks} задач</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Активные проекты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.activeProjects}</div>
                  <p className="text-xs text-gray-500 mt-1">{stats.completedProjects} завершено</p>
                </CardContent>
              </Card>

              <Card className={balance >= 0 ? "bg-green-50" : "bg-red-50"}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Баланс</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {balance.toLocaleString()} ₽
                  </div>
                  <p className="text-xs text-gray-500 mt-1">За {financePeriod} мес.</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Недельная активность</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-48">
                    {weeklyActivity.map((day) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                          style={{ height: `${(day.value / 10) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Динамика проектов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectProgress.map((month) => (
                      <div key={month.month} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 w-12">{month.month}</span>
                        <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent flex items-center justify-end pr-3 text-white text-xs font-medium transition-all"
                            style={{ width: `${(month.completed / 7) * 100}%` }}
                          >
                            {month.completed}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Финансы</span>
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
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Icon name="TrendingUp" size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Доходы</p>
                        <p className="text-lg font-bold text-green-600">{income.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Icon name="TrendingDown" size={20} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Расходы</p>
                        <p className="text-lg font-bold text-red-600">{expense.toLocaleString()} ₽</p>
                      </div>
                    </div>
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
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                            {task.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Мои задачи</h2>
              <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить задачу
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая задача</DialogTitle>
                    <DialogDescription>Создайте новую задачу для отслеживания</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="taskTitle">Название</Label>
                      <Input
                        id="taskTitle"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Название задачи"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taskDesc">Описание</Label>
                      <Textarea
                        id="taskDesc"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Описание задачи"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleAddTask}>Создать</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <p className="text-xs text-gray-400 mt-2">{task.createdAt}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Учет финансов</h2>
              <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить операцию
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая операция</DialogTitle>
                    <DialogDescription>Добавьте доход или расход</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Тип операции</Label>
                      <Select value={newTransaction.type} onValueChange={(value: "income" | "expense") => setNewTransaction({ ...newTransaction, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Доход</SelectItem>
                          <SelectItem value="expense">Расход</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Сумма</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <Input
                        id="category"
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                        placeholder="Зарплата, Обучение, и т.д."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transDesc">Описание</Label>
                      <Input
                        id="transDesc"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        placeholder="Описание операции"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Дата</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setTransactionDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleAddTransaction}>Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Период анализа</span>
                  <Select value={financePeriod} onValueChange={setFinancePeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 месяц</SelectItem>
                      <SelectItem value="3">3 месяца</SelectItem>
                      <SelectItem value="6">6 месяцев</SelectItem>
                      <SelectItem value="12">1 год</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Доходы</p>
                    <p className="text-2xl font-bold text-green-600">{income.toLocaleString()} ₽</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Расходы</p>
                    <p className="text-2xl font-bold text-red-600">{expense.toLocaleString()} ₽</p>
                  </div>
                  <div className={`text-center p-4 rounded-lg ${balance >= 0 ? "bg-blue-50" : "bg-orange-50"}`}>
                    <p className="text-sm text-gray-600 mb-2">Баланс</p>
                    <p className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                      {balance.toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {getFilteredTransactions().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                          <Icon 
                            name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} 
                            size={20} 
                            className={transaction.type === "income" ? "text-green-600" : "text-red-600"}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{transaction.category}</h4>
                          <p className="text-sm text-gray-600">{transaction.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`text-xl font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString()} ₽
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search" className="text-sm font-medium mb-2 block">Поиск</Label>
                    <div className="relative">
                      <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Название проекта или технология..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Label htmlFor="filter" className="text-sm font-medium mb-2 block">Фильтр</Label>
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                      <SelectTrigger id="filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все проекты</SelectItem>
                        <SelectItem value="active">В разработке</SelectItem>
                        <SelectItem value="completed">Завершенные</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon name="FolderX" size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Проекты не найдены</h3>
                  <p className="text-sm text-gray-500">Попробуйте изменить параметры поиска</p>
                </CardContent>
              </Card>
            ) : (
              filteredProjects.map((project, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <Badge variant={project.status === "Завершен" ? "default" : "secondary"} className="mt-2">
                        {project.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">{project.progress}%</span>
                    </div>
                  </div>
                  <Progress value={project.progress} className="mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentData.achievements.map((achievement, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Icon name={achievement.icon as any} size={24} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{achievement.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;