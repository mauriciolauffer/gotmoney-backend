export interface IUser {
  iduser: number;
  email: string;
  name: string;
  passwd?: string;
  alert: boolean;
  active: boolean;
  facebook?: string;
  google?: string;
  twitter?: string;
  createdon: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IUser;
