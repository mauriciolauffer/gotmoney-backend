export interface ICategory {
  idcategory: number;
  iduser: number;
  description: string;
  budget: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default ICategory;
