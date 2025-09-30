import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Project {
  name: string;
  status: string;
  progress: number;
  tech: string[];
}

interface ProjectsTabProps {
  projects: Project[];
  projectFilter: string;
  setProjectFilter: (filter: string) => void;
  projectSearch: string;
  setProjectSearch: (search: string) => void;
}

export const ProjectsTab = ({
  projects,
  projectFilter,
  setProjectFilter,
  projectSearch,
  setProjectSearch
}: ProjectsTabProps) => {
  const filteredProjects = projects.filter((project) => {
    const matchesFilter = projectFilter === "all" || 
      (projectFilter === "active" && project.status === "В разработке") ||
      (projectFilter === "completed" && project.status === "Завершен");
    const matchesSearch = project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      project.tech.some(tech => tech.toLowerCase().includes(projectSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
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
    </div>
  );
};