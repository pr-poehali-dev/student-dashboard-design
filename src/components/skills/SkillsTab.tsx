import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";

export interface Skill {
  id: string;
  name: string;
  type: 'hard' | 'soft';
  points: number;
  level: number;
}

interface SkillsTabProps {
  skills: Skill[];
  onUpdateSkills: (skills: Skill[]) => void;
}

const calculateLevel = (points: number): number => {
  return Math.floor(points / 10) + 1;
};

const getLevelProgress = (points: number): number => {
  return (points % 10) * 10;
};

const getNextLevelPoints = (points: number): number => {
  return (Math.floor(points / 10) + 1) * 10;
};

export const SkillsTab = ({ skills, onUpdateSkills }: SkillsTabProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'hard' | 'soft'>('all');
  const [newSkill, setNewSkill] = useState({
    name: '',
    type: 'hard' as 'hard' | 'soft'
  });

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast({ title: "Ошибка", description: "Введите название навыка", variant: "destructive" });
      return;
    }

    const existingSkill = skills.find(s => s.name.toLowerCase() === newSkill.name.toLowerCase());
    if (existingSkill) {
      toast({ title: "Ошибка", description: "Такой навык уже существует", variant: "destructive" });
      return;
    }

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      type: newSkill.type,
      points: 0,
      level: 1
    };

    onUpdateSkills([...skills, skill]);
    setNewSkill({ name: '', type: 'hard' });
    setDialogOpen(false);
    toast({ title: "Навык добавлен" });
  };

  const handleDeleteSkill = (skillId: string) => {
    onUpdateSkills(skills.filter(s => s.id !== skillId));
    toast({ title: "Навык удален" });
  };

  const filteredSkills = skills.filter(skill => {
    if (filterType === 'all') return true;
    return skill.type === filterType;
  });

  const hardSkills = skills.filter(s => s.type === 'hard');
  const softSkills = skills.filter(s => s.type === 'soft');

  const totalPoints = skills.reduce((sum, skill) => sum + skill.points, 0);
  const avgLevel = skills.length > 0 
    ? (skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Навыки</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить навык
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый навык</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Название навыка</Label>
                <Input
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="Например: React, Коммуникация"
                />
              </div>
              <div className="space-y-2">
                <Label>Тип навыка</Label>
                <Select 
                  value={newSkill.type} 
                  onValueChange={(value: 'hard' | 'soft') => setNewSkill({ ...newSkill, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hard">Hard skill (Технический)</SelectItem>
                    <SelectItem value="soft">Soft skill (Личностный)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddSkill}>Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Icon name="Brain" size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего навыков</p>
                <p className="text-2xl font-bold">{skills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Icon name="TrendingUp" size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего баллов</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Icon name="Award" size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Средний уровень</p>
                <p className="text-2xl font-bold">{avgLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
        >
          Все ({skills.length})
        </Button>
        <Button
          variant={filterType === 'hard' ? 'default' : 'outline'}
          onClick={() => setFilterType('hard')}
          className={filterType === 'hard' ? '' : 'border-blue-300'}
        >
          Hard Skills ({hardSkills.length})
        </Button>
        <Button
          variant={filterType === 'soft' ? 'default' : 'outline'}
          onClick={() => setFilterType('soft')}
          className={filterType === 'soft' ? '' : 'border-green-300'}
        >
          Soft Skills ({softSkills.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const level = calculateLevel(skill.points);
          const progress = getLevelProgress(skill.points);
          const nextLevel = getNextLevelPoints(skill.points);

          return (
            <Card 
              key={skill.id} 
              className={`hover:shadow-lg transition-shadow ${
                skill.type === 'hard' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-green-500'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <Badge 
                      className={`mt-2 ${
                        skill.type === 'hard' 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {skill.type === 'hard' ? 'Hard Skill' : 'Soft Skill'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-red-600 -mt-2 -mr-2"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Уровень</span>
                  <span className="text-2xl font-bold text-primary">{level}</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{skill.points} баллов</span>
                    <span>до {nextLevel}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Баллы начисляются за выполненные задачи с этим навыком
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Icon name="BookOpen" size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {filterType === 'all' ? 'Нет навыков' : `Нет ${filterType === 'hard' ? 'hard' : 'soft'} навыков`}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Добавьте навыки, чтобы отслеживать свой прогресс
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить первый навык
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};