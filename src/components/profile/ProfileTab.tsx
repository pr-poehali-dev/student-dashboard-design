import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  isCurrent: boolean;
}

interface Work {
  id: string;
  company: string;
  position: string;
  startYear: string;
  endYear: string;
  isCurrent: boolean;
  description: string;
}

interface ProfileTabProps {
  education: Education[];
  work: Work[];
  onAddEducation: () => void;
  onEditEducation: (edu: Education) => void;
  onDeleteEducation: (id: string) => void;
  onAddWork: () => void;
  onEditWork: (work: Work) => void;
  onDeleteWork: (id: string) => void;
}

export const ProfileTab = ({
  education,
  work,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
  onAddWork,
  onEditWork,
  onDeleteWork
}: ProfileTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="GraduationCap" size={20} />
              Образование
            </CardTitle>
            <Button size="sm" variant="outline" onClick={onAddEducation}>
              <Icon name="Plus" size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="border-l-2 border-primary pl-4 relative group">
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onEditEducation(edu)}>
                  <Icon name="Edit" size={14} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDeleteEducation(edu.id)} className="text-red-600">
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
              <h4 className="font-semibold text-gray-900">{edu.institution}</h4>
              <p className="text-sm text-gray-600">{edu.degree} • {edu.field}</p>
              <p className="text-xs text-gray-500 mt-1">
                {edu.startYear} - {edu.isCurrent ? 'по н.в.' : edu.endYear}
              </p>
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
            <Button size="sm" variant="outline" onClick={onAddWork}>
              <Icon name="Plus" size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {work.map((job) => (
            <div key={job.id} className="border-l-2 border-accent pl-4 relative group">
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onEditWork(job)}>
                  <Icon name="Edit" size={14} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDeleteWork(job.id)} className="text-red-600">
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
              <h4 className="font-semibold text-gray-900">{job.company}</h4>
              <p className="text-sm text-gray-600">{job.position}</p>
              <p className="text-xs text-gray-500 mt-1">
                {job.startYear} - {job.isCurrent ? 'по н.в.' : job.endYear}
              </p>
              {job.description && (
                <p className="text-sm text-gray-700 mt-2">{job.description}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};