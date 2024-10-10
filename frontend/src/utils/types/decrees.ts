export interface ListDecreeProps {
  key?: number;
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  effective_date: string;
  expired_date: string | null;
  file_path: string;
  createdAt: string;
  updatedAt: string;
}
