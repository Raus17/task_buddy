"use client";

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Editor } from "@/components/ui/tiptap-editor";

interface TaskDrawerProps {
  onSave: (task: {
    title: string;
    description: string;
    date: string;
    status: string;
    category: string;
    attachment?: File;
  }) => void;
}

const categories = ["Work", "Personal"];

const TaskDrawer: React.FC<TaskDrawerProps> = ({ onSave }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To-Do");
  const [taskCategory, setTaskCategory] = useState("Work");
  const [taskDate, setTaskDate] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!taskTitle || !taskStatus || !taskDate) {
      alert("Task title, status, and due date are required!");
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      status: taskStatus,
      category: taskCategory,
      attachment: attachment || undefined,
    };

    onSave(newTask);
    setIsOpen(false);

    // Reset fields after saving
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("To-Do");
    setTaskCategory("Work");
    setTaskDate("");
    setAttachment(null);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full bg-purple-600 text-white">+ Add Task</Button>
      </DrawerTrigger>
      <DrawerContent className="p-5">
        <h2 className="text-lg font-semibold text-center mb-4">Create Task</h2>
        
        <Label>Task Title</Label>
        <Input
          type="text"
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="mb-3"
        />
        
        <Label>Description</Label>
        <Editor
          value={taskDescription}
          onChange={setTaskDescription}
          className="mb-3"
        />
        
        <Label>Attachment</Label>
        <Input
          type="file"
          onChange={(e) => setAttachment(e.target.files?.[0] || null)}
          className="mb-3"
        />
        
        <Label>Category</Label>
        <div className="flex gap-2 mb-3">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={taskCategory === cat ? "default" : "outline"}
              onClick={() => setTaskCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        
        <Label>Due Date</Label>
        <DatePicker
          value={taskDate}
          onChange={setTaskDate}
          className="mb-3"
        />
        
        <Label>Status</Label>
        <Select onValueChange={setTaskStatus} value={taskStatus}>
          <SelectTrigger className="mb-3" />
          <SelectContent>
            <SelectItem value="To-Do">To-Do</SelectItem>
            <SelectItem value="In-Progress">In-Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-purple-600 text-white">Create</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TaskDrawer;
