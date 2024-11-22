import { Loader2 } from "lucide-react";

const LoadingScreen: React.FC = ({
  message = "Loading...",
}: {
  message?: string;
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
