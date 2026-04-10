import { Temporal } from "temporal-polyfill";

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
  createdon: Temporal.Instant;
  createdAt?: Temporal.Instant;
  updatedAt?: Temporal.Instant;
}

export default IUser;
