"use client";

import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthContext } from "@/contex/AuthContext";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface SimpleAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssistantAdded: () => void;
}

const SimpleAddDialog: React.FC<SimpleAddDialogProps> = ({
  open,
  onOpenChange,
  onAssistantAdded,
}) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  const createAssistant = useMutation(api.userAiAssistants.CreateUserAssistant);

  const handleAdd = async () => {
    if (!name.trim() || !title.trim() || !instruction.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!user?._id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await createAssistant({
        uid: user._id,
        name: name.trim(),
        title: title.trim(),
        instruction: instruction.trim(),
      });

      toast.success("Assistant added successfully!");
      onAssistantAdded();
      setName("");
      setTitle("");
      setInstruction("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating assistant:", error);
      toast.error("Failed to create assistant. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Assistant</DialogTitle>
          <DialogDescription>Create a new AI assistant</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Assistant Name *</label>
            <Input
              placeholder="Enter assistant name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input
              placeholder="Enter assistant title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Instruction *</label>
            <Textarea
              placeholder="What should this assistant do?"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Assistant</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleAddDialog;
