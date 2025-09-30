import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const studentData = {
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
  };

  const stats = {
    loginStreak: 12,
    totalDays: 45,
    completedTasks: 89,
    totalTasks: 120,
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
              <h1 className="text-3xl font-bold text-gray-900">
                {studentData.lastName} {studentData.firstName} {studentData.middleName}
              </h1>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="text-3xl font-bold text-accent">{Math.round((stats.completedTasks / stats.totalTasks) * 100)}%</div>
                  <Progress value={(stats.completedTasks / stats.totalTasks) * 100} className="mt-2" />
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
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {studentData.projects.map((project, index) => (
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
            ))}
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