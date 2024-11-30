export interface userProp {
  id: string;
  role: "user" | "admin";
  username: string;
  avatarImg?: string | null;
  verified: boolean;
  user_data: userDataProps | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface userDataProps {
  id: number;
  user_id: string;
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
