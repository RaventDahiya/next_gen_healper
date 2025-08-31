"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface TestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssistantAdded: () => void;
}

const TestDialog: React.FC<TestDialogProps> = ({
  open,
  onOpenChange,
  onAssistantAdded,
}) => {
  return (
    <div>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Add New Assistant</h2>
            <p className="mb-4">Dialog is working!</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onAssistantAdded();
                  onOpenChange(false);
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDialog;
