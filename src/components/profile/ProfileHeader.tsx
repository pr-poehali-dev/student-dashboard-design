import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface StudentData {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  city: string;
  avatar: string;
  coverImage: string;
}

interface Stats {
  loginStreak: number;
  completedTasks: number;
}

interface ProfileHeaderProps {
  studentData: StudentData;
  stats: Stats;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  editForm: {
    firstName: string;
    lastName: string;
    middleName: string;
    birthDate: string;
    city: string;
  };
  setEditForm: (form: any) => void;
  handleEditProfile: () => void;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({
  studentData,
  stats,
  editDialogOpen,
  setEditDialogOpen,
  editForm,
  setEditForm,
  handleEditProfile,
  handleAvatarUpload
}: ProfileHeaderProps) => {
  return (
    <>
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
      </div>
    </>
  );
};