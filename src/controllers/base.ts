export abstract class BaseController<T> {
  props: T;
  db: D1Database;

  constructor(db: D1Database, data: any = {}) {
    this.db = db;
    this.props = this.setProperties(data);
  }

  abstract setProperties(data: any): T;

  getProperties(): T {
    if (this.props === null || typeof this.props !== "object") {
      return this.props;
    }
    if (Array.isArray(this.props)) {
      return [...this.props] as unknown as T;
    }
    return { ...this.props };
  }
}

export default BaseController;
