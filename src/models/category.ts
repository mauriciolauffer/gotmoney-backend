import { Temporal } from "temporal-polyfill";

export interface ICategory {
  idcategory: number;
  iduser: number;
  description: string;
  budget: number;
  createdAt?: Temporal.Instant;
  updatedAt?: Temporal.Instant;
}

export default ICategory;
