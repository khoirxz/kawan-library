import { certificationListProps } from "./certificate";
import { decreeListProps } from "./decree";

export interface userProp {
  id: string;
  role: "user" | "admin";
  username: string;
  avatarImg?: string | null;
  verified: boolean;
  user_data?: userDataProps | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface userDataProps {
  id: number;
  user_id: string;
  nik: string;
  firstName: string;
  lastName: string;
  dateBirth: string;
  gender: "male" | "female";
  religion: "islam" | "kristen" | "katolik" | "hindu" | "budha" | "0";
  maritalStatus: "single" | "married" | "widow";
  createdAt: string;
  updatedAt: string;
}

export interface userGeographyProps {
  id: number;
  user_id: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface userContactProps {
  id: number;
  user_id: string;
  email: string;
  phone: string;
  emergency_contact: string;
  instagram: string;
  facebook: string;
  createdAt: string;
  updatedAt: string;
}

export interface userEmployeProps {
  id: number;
  user_id: string;
  position: string;
  status: "active" | "inactive";
  salary: number;
  supervisor_info: {
    id: string;
    username: string;
    role: "user" | "admin";
    avatarImg: string | null;
    verified: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface userJobHistoryProps {
  id: number;
  user_id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string;
  job_description: string;
  location: string;
  is_current: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface userProfileProps extends userProp {
  user_data: userDataProps | null;
  user_contact: userContactProps | null;
  user_data_employe: userEmployeProps | null;
  user_geography: userGeographyProps | null;
  job_history: userJobHistoryProps | null;
  certifications: certificationListProps[] | null;
  decrees: decreeListProps[] | null;
}

export interface userPortfolioProps extends userProp {
  user_info: userDataProps | null;
  user_contact: userContactProps | null;
  user_geography: userGeographyProps | null;
  certifications: certificationListProps[] | null;
}
