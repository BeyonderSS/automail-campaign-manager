"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ReusableAlert({
  triggerText = "Open Alert",
  dialogTitle = "Alert Title",
  dialogDescription = "Alert description goes here.",
  cancelText = "Cancel",
  actionText ,
  onCancel = () => {},
  onAction = () => {},
  triggerProps = {},
  cancelProps = {},
  actionProps = {},
  isLoading=false,
  children,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCancel = () => {
    onCancel();
    setIsDialogOpen(false);
  };

  const handleAction = () => {
    onAction();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button {...triggerProps} onClick={() => setIsDialogOpen(true)}>
        {triggerText}
      </Button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          {children}
          <AlertDialogFooter>
            <AlertDialogCancel {...cancelProps} onClick={handleCancel}>
              {cancelText}
            </AlertDialogCancel>
            {actionText&&
            <AlertDialogAction disabled={isLoading} {...actionProps} onClick={handleAction}>
              {actionText}
            </AlertDialogAction>
            }
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
