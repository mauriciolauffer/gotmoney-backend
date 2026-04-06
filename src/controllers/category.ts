import db from '../models/category';
import CustomErrors from '../utils/errors';

export class Category {
  props: any;

  constructor(data: any = {}) {
    this.setProperties(data);
  }

  setProperties({ idcategory, iduser, description, budget }: any) {
    this.props = {
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
    const docs = await db.findOne({ iduser, idcategory }).lean().exec();
    if (docs) {
      return new Category(docs);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async getAll(iduser: number): Promise<any[]> {
    const docs = await db.find({ iduser }).sort({ description: 1 }).lean().exec();
    return docs || [];
  }

  async create(): Promise<any> {
    return db.create(this.props);
  }

  async update(): Promise<any> {
    const docs = await db.findOneAndUpdate(
      { iduser: this.props.iduser, idcategory: this.props.idcategory },
      {
        description: this.props.description,
        budget: this.props.budget,
      }
    ).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async delete(): Promise<any> {
    const docs = await db.findOneAndDelete({
      iduser: this.props.iduser,
      idcategory: this.props.idcategory,
    }).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }
}

export default Category;
