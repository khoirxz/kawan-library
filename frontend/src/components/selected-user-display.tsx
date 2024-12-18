import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userProp } from "@/types/user";

interface SelectedUserDisplayProps {
  user: userProp;
  onRemove: () => void;
}

export function SelectedUserDisplay({
  user,
  onRemove,
}: SelectedUserDisplayProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-accent rounded-md">
      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-sm text-muted-foreground">{user.role}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
        <span className="sr-only">Remove associated user</span>
      </Button>
    </div>
  );
}
