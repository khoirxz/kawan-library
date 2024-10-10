export interface ListUsersProps {
  key: number;
  id: number;
  role: string;
  name: string;
  username: string;
  phone: string;
}

export type UserFormProps = {
  name: string;
  username: string;
  password: string;
  role: string;
  phone: string;
  avatarImg?: null;
};

export type UserProps = {
  id: number;
  name: string;
  username: string;
};
