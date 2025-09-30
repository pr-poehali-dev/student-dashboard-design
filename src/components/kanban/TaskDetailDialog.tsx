import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { KanbanTask, TaskComment } from "./types";
import { toast } from "@/components/ui/use-toast";

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: KanbanTask | null;
  onUpdate: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  availableSkills: string[];
  availableTags: string[];
  onAddSkill: (skill: string) => void;
  onAddTag: (tag: string) => void;
}

export const TaskDetailDialog = ({
  open,
  onOpenChange,
  task,
  onUpdate,
  onDelete,
  availableSkills,
  availableTags,
  onAddSkill,
  onAddTag
}: TaskDetailDialogProps) => {
  const [editedTask, setEditedTask] = useState<KanbanTask | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentFile, setCommentFile] = useState<File | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newExecutor, setNewExecutor] = useState("");

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task, comments: task.comments || [] });
    }
  }, [task]);

  if (!editedTask) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: TaskComment = {
      id: Date.now().toString(),
      author: editedTask.creator,
      text: newComment,
      file: commentFile ? URL.createObjectURL(commentFile) : undefined,
      fileName: commentFile?.name,
      timestamp: new Date().toISOString()
    };

    const updated = {
      ...editedTask,
      comments: [...(editedTask.comments || []), comment]
    };
    setEditedTask(updated);
    onUpdate(updated);
    setNewComment("");
    setCommentFile(null);
    toast({ title: "Комментарий добавлен" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCommentFile(file);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!editedTask.skills.includes(newSkill)) {
      const updated = {
        ...editedTask,
        skills: [...editedTask.skills, newSkill]
      };
      setEditedTask(updated);
      onUpdate(updated);
      onAddSkill(newSkill);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = {
      ...editedTask,
      skills: editedTask.skills.filter(s => s !== skill)
    };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const tags = editedTask.tags || [];
    if (!tags.includes(newTag)) {
      const updated = {
        ...editedTask,
        tags: [...tags, newTag]
      };
      setEditedTask(updated);
      onUpdate(updated);
      onAddTag(newTag);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    const updated = {
      ...editedTask,
      tags: (editedTask.tags || []).filter(t => t !== tag)
    };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const handleAddExecutor = () => {
    if (!newExecutor.trim()) return;
    if (!editedTask.executors.includes(newExecutor)) {
      const updated = {
        ...editedTask,
        executors: [...editedTask.executors, newExecutor]
      };
      setEditedTask(updated);
      onUpdate(updated);
    }
    setNewExecutor("");
  };

  const handleRemoveExecutor = (executor: string) => {
    const updated = {
      ...editedTask,
      executors: editedTask.executors.filter(e => e !== executor)
    };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const updateField = (field: keyof KanbanTask, value: any) => {
    const updated = { ...editedTask, [field]: value };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const handleToggleComplete = () => {
    const updated = { ...editedTask, completed: !editedTask.completed };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const handleDeleteTask = () => {
    onDelete(editedTask.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Input
                value={editedTask.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="ghost" size="icon" onClick={handleDeleteTask} className="text-red-600">
                <Icon name="Trash2" size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 pr-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={editedTask.completed}
                  onCheckedChange={handleToggleComplete}
                />
                <span className="text-sm font-medium">Отметить выполненной</span>
              </div>

              <div>
                <Label>Описание</Label>
                <Textarea
                  value={editedTask.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Добавьте описание задачи..."
                  className="min-h-[100px] mt-2"
                />
              </div>

              <div>
                <Label className="text-lg font-semibold">Комментарии</Label>
                <div className="space-y-3 mt-4">
                  {editedTask.comments?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString("ru-RU")}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                      {comment.file && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                          <Icon name="Paperclip" size={14} />
                          <a href={comment.file} target="_blank" rel="noopener noreferrer">
                            {comment.fileName || "Файл"}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Написать комментарий..."
                    className="min-h-[80px]"
                  />
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button type="button" variant="outline" size="sm" className="gap-2">
                        <Icon name="Paperclip" size={16} />
                        {commentFile ? commentFile.name : "Прикрепить файл"}
                      </Button>
                    </label>
                    <Button onClick={handleAddComment} size="sm">
                      Отправить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <Label className="text-xs text-gray-600">Создатель</Label>
                <p className="text-sm font-medium mt-1">{editedTask.creator}</p>
              </div>

              <div>
                <Label className="text-xs text-gray-600">Ответственный</Label>
                <Input
                  value={editedTask.responsible}
                  onChange={(e) => updateField("responsible", e.target.value)}
                  placeholder="Укажите ответственного"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Исполнители</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedTask.executors.map((executor) => (
                    <Badge key={executor} variant="secondary" className="gap-1">
                      {executor}
                      <Icon
                        name="X"
                        size={12}
                        className="cursor-pointer"
                        onClick={() => handleRemoveExecutor(executor)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newExecutor}
                    onChange={(e) => setNewExecutor(e.target.value)}
                    placeholder="Добавить исполнителя"
                    onKeyDown={(e) => e.key === "Enter" && handleAddExecutor()}
                  />
                  <Button size="icon" variant="outline" onClick={handleAddExecutor}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-600">Дата начала</Label>
                <Input
                  type="date"
                  value={editedTask.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Дедлайн</Label>
                <Input
                  type="date"
                  value={editedTask.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Приоритет</Label>
                <Select
                  value={editedTask.priority.toString()}
                  onValueChange={(value) => updateField("priority", parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Низкий</SelectItem>
                    <SelectItem value="2">Средний</SelectItem>
                    <SelectItem value="3">Высокий</SelectItem>
                    <SelectItem value="4">Срочный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600">Баллы</Label>
                <Input
                  type="number"
                  value={editedTask.points}
                  onChange={(e) => updateField("points", parseInt(e.target.value) || 1)}
                  min="1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Навыки</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedTask.skills.map((skill) => (
                    <Badge key={skill} className="gap-1">
                      {skill}
                      <Icon
                        name="X"
                        size={12}
                        className="cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Select value={newSkill} onValueChange={setNewSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выбрать из библиотеки" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={handleAddSkill}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Или введите новый"
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600">Теги</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editedTask.tags || []).map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1">
                      {tag}
                      <Icon
                        name="X"
                        size={12}
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Select value={newTag} onValueChange={setNewTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выбрать из библиотеки" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={handleAddTag}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Или введите новый"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};