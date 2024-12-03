import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type AppHeaderProps = {
  actionBtn?: React.ReactNode; // Hanya menerima ReactNode
  linkAction?: string; // Sebagai fallback jika `actionBtn` tidak tersedia
  title: string;
  subtitle?: string;
  additionalContent?: React.ReactNode;
};

export function AppHeader({
  actionBtn,
  linkAction,
  title,
  subtitle,
  additionalContent,
}: AppHeaderProps) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-row items-center justify-between",
        additionalContent ? "md:items-start" : "items-center"
      )}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-2">
          {actionBtn || (
            <Button variant="ghost" size="icon" asChild>
              <Link to={linkAction ?? "/"}>
                <ArrowLeft />
              </Link>
            </Button>
          )}
          <div>
            <h1 className="text-lg font-medium">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
      {additionalContent && (
        <div className="mt-2 md:mt-0">{additionalContent}</div>
      )}
    </div>
  );
}
