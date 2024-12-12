import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type NotificationType = "success" | "error" | "info";

interface NotificationDialogProps {
  type: NotificationType;
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  redirect?: string;
}

export function NotificationDialog({
  type,
  title,
  message,
  isOpen,
  onClose,
  redirect,
}: NotificationDialogProps) {
  const [open, setOpen] = useState(isOpen);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();

    if (redirect) {
      navigate(redirect, { replace: true });
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "info":
        return <AlertCircle className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
