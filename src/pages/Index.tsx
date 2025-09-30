import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icon";
import KanbanBoard from "@/components/KanbanBoard";
import ImageCropDialog from "@/components/ImageCropDialog";
import { EducationDialog, WorkDialog, AchievementDialog } from "@/components/ProfileEditDialogs";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTab } from "@/components/profile/ProfileTab";
import { DashboardTab } from "@/components/dashboard/DashboardTab";
import { FinanceTab } from "@/components/finance/FinanceTab";
import { ProjectsTab } from "@/components/projects/ProjectsTab";
import { AchievementsTab } from "@/components/achievements/AchievementsTab";

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
      <ProfileHeader 
        studentData={studentData}
        stats={stats}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditProfile={handleEditProfile}
        handleAvatarUpload={handleAvatarUpload}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <ProfileTab 
              education={education}
              work={work}
              onAddEducation={() => { setEditingEdu(null); setEduDialogOpen(true); }}
              onEditEducation={(edu) => { setEditingEdu(edu); setEduDialogOpen(true); }}
              onDeleteEducation={handleDeleteEducation}
              onAddWork={() => { setEditingWork(null); setWorkDialogOpen(true); }}
              onEditWork={(w) => { setEditingWork(w); setWorkDialogOpen(true); }}
              onDeleteWork={handleDeleteWork}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardTab 
              stats={stats}
              balance={balance}
              income={income}
              expense={expense}
              tasks={tasks}
              financePeriod={financePeriod}
              setFinancePeriod={setFinancePeriod}
              toggleTask={toggleTask}
              onExport={exportToExcel}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <KanbanBoard />
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <FinanceTab 
              transactions={getFilteredTransactions()}
              transactionDialogOpen={transactionDialogOpen}
              setTransactionDialogOpen={setTransactionDialogOpen}
              newTransaction={newTransaction}
              setNewTransaction={setNewTransaction}
              handleAddTransaction={handleAddTransaction}
              deleteTransaction={deleteTransaction}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsTab 
              projects={projects}
              projectFilter={projectFilter}
              setProjectFilter={setProjectFilter}
              projectSearch={projectSearch}
              setProjectSearch={setProjectSearch}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <AchievementsTab 
              achievements={achievements}
              onAdd={() => { setEditingAchievement(null); setAchievementDialogOpen(true); }}
              onEdit={(ach) => { setEditingAchievement(ach); setAchievementDialogOpen(true); }}
              onDelete={handleDeleteAchievement}
            />
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