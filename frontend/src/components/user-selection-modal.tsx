import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: string;
  role: string;
  username: string;
  avatarImg: string | null;
  verified: boolean;
}

interface UserSelectionModalProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

export function UserSelectionModal({
  isOpen,
  onClose,
  onSelectUser,
  users,
}: UserSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a User</DialogTitle>
          <DialogDescription>
            Pilih user yang ingin dihubungkan
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-[300px] pr-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
              onClick={() => onSelectUser(user)}>
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
