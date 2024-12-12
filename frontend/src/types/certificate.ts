import { userProp } from "./user";

export interface certificationListProps {
  id: string;
  title: string;
  description: string;
  date: string;
  file_path: string;
  createdAt: string;
  updatedAt: string;
  user: userProp;
}

export interface categoryListProps {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
