import { userProp } from "./user";

export interface decreeListProps {
  id: string;
  user: userProp | null;
  category: {
    name: string;
    id: number;
  };
  title: string;
  description: string;
  status: "approved" | "rejected" | "draft";
  effective_date: string;
  expired_date: string;
  file_path: string;
  createdAt: string;
  updatedAt: string;
}
