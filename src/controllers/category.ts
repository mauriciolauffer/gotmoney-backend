import { ICategory } from "../models/category";
import CustomErrors from "../utils/errors";

export class Category {
  props: ICategory;
  db: D1Database;

  constructor(db: D1Database, data: any = {}) {
    this.db = db;
    this.props = this.setProperties(data);
  }

  setProperties({ idcategory, iduser, description, budget }: any): ICategory {
    return {
      idcategory,
      iduser,
      description,
      budget: budget || 0,
    };
  }

  getProperties() {
    return { ...this.props };
  }

  async findById(iduser: number, idcategory: number): Promise<Category> {
    const result = await this.db
      .prepare("SELECT * FROM Categories WHERE iduser = ? AND idcategory = ?")
      .bind(iduser, idcategory)
      .first<ICategory>();

    if (result) {
      return new Category(this.db, result);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async getAll(iduser: number): Promise<ICategory[]> {
    const { results } = await this.db
      .prepare("SELECT * FROM Categories WHERE iduser = ? ORDER BY description ASC")
      .bind(iduser)
      .all<ICategory>();

    return results || [];
  }

  async create(): Promise<any> {
    return this.db
      .prepare(
        "INSERT INTO Categories (idcategory, iduser, description, budget, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(
        this.props.idcategory,
        this.props.iduser,
        this.props.description,
        this.props.budget,
        new Date().toISOString(),
        new Date().toISOString(),
      )
      .run();
  }

  async update(): Promise<any> {
    const result = await this.db
      .prepare(
        "UPDATE Categories SET description = ?, budget = ?, updatedAt = ? WHERE iduser = ? AND idcategory = ?",
      )
      .bind(
        this.props.description,
        this.props.budget,
        new Date().toISOString(),
        this.props.iduser,
        this.props.idcategory,
      )
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async delete(): Promise<any> {
    const result = await this.db
      .prepare("DELETE FROM Categories WHERE iduser = ? AND idcategory = ?")
      .bind(this.props.iduser, this.props.idcategory)
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }
}

export default Category;
