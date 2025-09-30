import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

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

const iconOptions = ['Trophy', 'Award', 'Medal', 'Star', 'Target', 'Zap', 'Crown', 'Gem', 'Heart', 'Sparkles'];

export const EducationDialog = ({ 
  open, 
  onOpenChange, 
  education, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  education: Education | null; 
  onSave: (data: Education) => void;
}) => {
  const [form, setForm] = useState<Partial<Education>>(education || {
    institution: '',
    degree: '',
    field: '',
    years: ''
  });

  const handleSave = () => {
    if (!form.institution || !form.degree) {
      toast({ title: 'Ошибка', description: 'Заполните обязательные поля', variant: 'destructive' });
      return;
    }
    onSave({ ...form, id: education?.id || Date.now().toString() } as Education);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{education ? 'Редактировать образование' : 'Добавить образование'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Учебное заведение *</Label>
            <Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Степень *</Label>
            <Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Бакалавр, Магистр..." />
          </div>
          <div className="space-y-2">
            <Label>Специальность</Label>
            <Input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Годы обучения</Label>
            <Input value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} placeholder="2020-2024" />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const WorkDialog = ({ 
  open, 
  onOpenChange, 
  work, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  work: Work | null; 
  onSave: (data: Work) => void;
}) => {
  const [form, setForm] = useState<Partial<Work>>(work || {
    company: '',
    position: '',
    period: ''
  });

  const handleSave = () => {
    if (!form.company || !form.position) {
      toast({ title: 'Ошибка', description: 'Заполните обязательные поля', variant: 'destructive' });
      return;
    }
    onSave({ ...form, id: work?.id || Date.now().toString() } as Work);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{work ? 'Редактировать опыт работы' : 'Добавить опыт работы'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Компания *</Label>
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Должность *</Label>
            <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Период</Label>
            <Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="2023-настоящее время" />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AchievementDialog = ({ 
  open, 
  onOpenChange, 
  achievement, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  achievement: Achievement | null; 
  onSave: (data: Achievement) => void;
}) => {
  const [form, setForm] = useState<Partial<Achievement>>(achievement || {
    title: '',
    month: '',
    year: '',
    description: '',
    icon: 'Trophy'
  });

  const handleSave = () => {
    if (!form.title || !form.month || !form.year) {
      toast({ title: 'Ошибка', description: 'Заполните обязательные поля', variant: 'destructive' });
      return;
    }
    onSave({ ...form, id: achievement?.id || Date.now().toString() } as Achievement);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{achievement ? 'Редактировать достижение' : 'Добавить достижение'}</DialogTitle>
          <DialogDescription>Опишите ваше достижение</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Название *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Месяц *</Label>
              <Select value={form.month} onValueChange={(value) => setForm({ ...form, month: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Год *</Label>
              <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Иконка</Label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  className={`p-3 rounded-lg border-2 transition-all hover:bg-gray-50 ${
                    form.icon === icon ? 'border-primary bg-primary/10' : 'border-gray-200'
                  }`}
                >
                  <Icon name={icon as any} size={24} className="mx-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default { EducationDialog, WorkDialog, AchievementDialog };