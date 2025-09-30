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
import KanbanBoard from "@/components/KanbanBoard";
import ImageCropDialog from "@/components/ImageCropDialog";
import { EducationDialog, WorkDialog, AchievementDialog } from "@/components/ProfileEditDialogs";

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

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  years: string;
}

interface Work {
  id: string;
  company: string;
  position: string;
  period: string;
}

interface Achievement {
  id: string;
  title: string;
  month: string;
  year: string;
  description: string;
  icon: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("all");
  const [projectSearch, setProjectSearch] = useState("");
  const [financePeriod, setFinancePeriod] = useState("1");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [tempAvatar, setTempAvatar] = useState("");
  
  const [eduDialogOpen, setEduDialogOpen] = useState(false);
  const [workDialogOpen, setWorkDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const [studentData, setStudentData] = useState({
    lastName: "Иванов",
    firstName: "Алексей",
    middleName: "Сергеевич",
    birthDate: "15.03.2002",
    city: "Москва",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop"
  });

  const [education, setEducation] = useState<Education[]>([
    { id: "1", institution: "МГУ им. М.В. Ломоносова", degree: "Бакалавр", field: "Информатика", years: "2020-2024" }
  ]);

  const [work, setWork] = useState<Work[]>([
    { id: "1", company: "Tech Solutions", position: "Junior Developer", period: "2023-настоящее время" }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "1", title: "Победитель хакатона 2023", month: "Ноябрь", year: "2023", description: "Первое место в университетском хакатоне", icon: "Trophy" },
    { id: "2", title: "Сертификат React Developer", month: "Сентябрь", year: "2023", description: "Завершил курс по React", icon: "Award" },
    { id: "3", title: "Top Student Award", month: "Июнь", year: "2023", description: "Лучший студент курса", icon: "Medal" }
  ]);

  const [projects] = useState([
    { name: "E-commerce Platform", status: "В разработке", progress: 75, tech: ["React", "Node.js"] },
    { name: "Mobile App", status: "Завершен", progress: 100, tech: ["React Native"] },
    { name: "AI Chatbot", status: "В разработке", progress: 45, tech: ["Python", "TensorFlow"] }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Завершить модуль аутентификации", description: "Реализовать JWT токены", completed: true, createdAt: "2024-01-15" },
    { id: "2", title: "Код-ревью проекта", description: "Проверить pull requests", completed: false, createdAt: "2024-01-16" }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", type: "income", amount: 50000, category: "Зарплата", description: "Зарплата за январь", date: "2024-01-31" },
    { id: "2", type: "expense", amount: 15000, category: "Обучение", description: "Онлайн курс", date: "2024-01-15" }
  ]);

  const [editForm, setEditForm] = useState({
    firstName: studentData.firstName,
    lastName: studentData.lastName,
    middleName: studentData.middleName,
    birthDate: studentData.birthDate,
    city: studentData.city
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
        setTempAvatar(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setStudentData({ ...studentData, avatar: croppedImage });
    toast({ title: "Аватар обновлен" });
  };

  const handleEditProfile = () => {
    setStudentData({ ...studentData, ...editForm });
    setEditDialogOpen(false);
    toast({ title: "Профиль обновлен" });
  };

  const handleSaveEducation = (edu: Education) => {
    if (editingEdu) {
      setEducation(education.map(e => e.id === edu.id ? edu : e));
      toast({ title: "Образование обновлено" });
    } else {
      setEducation([...education, edu]);
      toast({ title: "Образование добавлено" });
    }
    setEditingEdu(null);
  };

  const handleDeleteEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
    toast({ title: "Образование удалено" });
  };

  const handleSaveWork = (w: Work) => {
    if (editingWork) {
      setWork(work.map(item => item.id === w.id ? w : item));
      toast({ title: "Опыт работы обновлен" });
    } else {
      setWork([...work, w]);
      toast({ title: "Опыт работы добавлен" });
    }
    setEditingWork(null);
  };

  const handleDeleteWork = (id: string) => {
    setWork(work.filter(w => w.id !== id));
    toast({ title: "Опыт работы удален" });
  };

  const handleSaveAchievement = (ach: Achievement) => {
    if (editingAchievement) {
      setAchievements(achievements.map(a => a.id === ach.id ? ach : a));
      toast({ title: "Достижение обновлено" });
    } else {
      setAchievements([...achievements, ach]);
      toast({ title: "Достижение добавлено" });
    }
    setEditingAchievement(null);
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
    toast({ title: "Достижение удалено" });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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
    toast({ title: "Транзакция добавлена" });
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

  const exportToExcel = () => {
    const { income, expense, balance } = calculateBalance();
    const completedTasksCount = tasks.filter(t => t.completed).length;
    
    const csvContent = [
      ["Метрика", "Значение"],
      ["Дней активности", 45],
      ["Дней подряд", 12],
      ["Выполнено задач", completedTasksCount],
      ["Всего задач", tasks.length],
      ["Активных проектов", 3],
      ["Доходы", income],
      ["Расходы", expense],
      ["Баланс", balance]
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "statistics.csv";
    link.click();
    toast({ title: "Экспорт завершен" });
  };

  const filteredProjects = projects.filter((project) => {
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
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={studentData.avatar} alt={studentData.firstName} />
                <AvatarFallback className="text-3xl">{studentData.firstName[0]}{studentData.lastName[0]}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                <Icon name="Camera" size={16} />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            
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
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input id="lastName" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя</Label>
                        <Input id="firstName" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName">Отчество</Label>
                        <Input id="middleName" value={editForm.middleName} onChange={(e) => setEditForm({ ...editForm, middleName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Дата рождения</Label>
                        <Input id="birthDate" value={editForm.birthDate} onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Город</Label>
                        <Input id="city" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Отмена</Button>
                      <Button onClick={handleEditProfile}>Сохранить</Button>
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
          <TabsList className="bg-white shadow-sm p-1 flex-wrap h-auto">
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
              Kanban
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="GraduationCap" size={20} />
                      Образование
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={() => { setEditingEdu(null); setEduDialogOpen(true); }}>
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-primary pl-4 relative group">
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => { setEditingEdu(edu); setEduDialogOpen(true); }}>
                          <Icon name="Edit" size={14} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteEducation(edu.id)} className="text-red-600">
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                      <h4 className="font-semibold text-gray-900">{edu.institution}</h4>
                      <p className="text-sm text-gray-600">{edu.degree} • {edu.field}</p>
                      <p className="text-xs text-gray-500 mt-1">{edu.years}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Briefcase" size={20} />
                      Опыт работы
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={() => { setEditingWork(null); setWorkDialogOpen(true); }}>
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {work.map((job) => (
                    <div key={job.id} className="border-l-2 border-accent pl-4 relative group">
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => { setEditingWork(job); setWorkDialogOpen(true); }}>
                          <Icon name="Edit" size={14} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteWork(job.id)} className="text-red-600">
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
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
            <div className="flex justify-end">
              <Button onClick={exportToExcel} variant="outline" size="sm" className="gap-2">
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
          </TabsContent>

          <TabsContent value="tasks">
            <KanbanBoard />
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
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Тип</Label>
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
                      <Label>Сумма</Label>
                      <Input type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Категория</Label>
                      <Input value={newTransaction.category} onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Дата</Label>
                      <Input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setTransactionDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleAddTransaction}>Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {getFilteredTransactions().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                        <Icon name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} size={20} className={transaction.type === "income" ? "text-green-600" : "text-red-600"} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{transaction.category}</h4>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`text-xl font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString()} ₽
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => deleteTransaction(transaction.id)} className="text-red-600">
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardContent className="p-4 flex gap-4">
                <div className="flex-1">
                  <Label>Поиск</Label>
                  <Input placeholder="Название или технология..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} />
                </div>
                <div className="w-48">
                  <Label>Фильтр</Label>
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="active">В разработке</SelectItem>
                      <SelectItem value="completed">Завершенные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {filteredProjects.map((project, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <Badge className="mt-2">{project.status}</Badge>
                    </div>
                    <span className="text-2xl font-bold text-primary">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="mb-4" />
                  <div className="flex gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Достижения</h2>
              <Button onClick={() => { setEditingAchievement(null); setAchievementDialogOpen(true); }} className="gap-2">
                <Icon name="Plus" size={16} />
                Добавить достижение
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingAchievement(achievement); setAchievementDialogOpen(true); }}>
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteAchievement(achievement.id)} className="text-red-600">
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-full">
                        <Icon name={achievement.icon as any} size={24} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{achievement.month} {achievement.year}</p>
                        {achievement.description && (
                          <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ImageCropDialog 
        open={cropDialogOpen} 
        onOpenChange={setCropDialogOpen} 
        imageSrc={tempAvatar}
        onCropComplete={handleCropComplete}
      />
      
      <EducationDialog 
        open={eduDialogOpen} 
        onOpenChange={setEduDialogOpen} 
        education={editingEdu}
        onSave={handleSaveEducation}
      />
      
      <WorkDialog 
        open={workDialogOpen} 
        onOpenChange={setWorkDialogOpen} 
        work={editingWork}
        onSave={handleSaveWork}
      />
      
      <AchievementDialog 
        open={achievementDialogOpen} 
        onOpenChange={setAchievementDialogOpen} 
        achievement={editingAchievement}
        onSave={handleSaveAchievement}
      />
    </div>
  );
};

export default Index;