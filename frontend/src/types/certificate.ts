import { userProp } from "./user";

export interface certificationListProps {
  id: string;
  name: string;
  description: string;
  date: string;
  file_path: string;
  createdAt: string;
  updatedAt: string;
  user: userProp;
}

export interface categoryListProps {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
