import { ReactNode } from "react";

export type MenuProps = {
  key: string;
  path: string;
  show: boolean;
  name: string;
  element: ReactNode;
  id: string;
  icon: ReactNode;
  parent?: string;
  children?: {
    key: string;
    parent: string;
    show: boolean;
    path: string;
    name: string;
    element: ReactNode;
    id: string;
    icon?: ReactNode;
  }[];
}[];
