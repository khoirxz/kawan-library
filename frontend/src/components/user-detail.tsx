import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDetailProps {
  name: string;
  imageUrl: string;
  email: string;
}

export function UserDetail({ name, imageUrl, email }: UserDetailProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-card rounded-lg shadow-sm">
      <Avatar className="h-16 w-16">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
