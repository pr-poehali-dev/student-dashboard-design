import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Achievement {
  id: string;
  title: string;
  month: string;
  year: string;
  description: string;
  icon: string;
}

interface AchievementsTabProps {
  achievements: Achievement[];
  onAdd: () => void;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
}

export const AchievementsTab = ({
  achievements,
  onAdd,
  onEdit,
  onDelete
}: AchievementsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Достижения</h2>
        <Button onClick={onAdd} className="gap-2">
          <Icon name="Plus" size={16} />
          Добавить достижение
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="hover:shadow-lg transition-shadow group">
            <CardContent className="p-6">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onEdit(achievement)}>
                  <Icon name="Edit" size={14} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(achievement.id)} className="text-red-600">
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
    </div>
  );
};