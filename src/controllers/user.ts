import bcrypt from "bcryptjs";
import sha256 from "crypto-js/sha256";
import base64 from "crypto-js/enc-base64";
import md5 from "crypto-js/md5";
import { IUser } from "../models/user";
import CustomErrors from "../utils/errors";

export class User {
  props: IUser;
  db: D1Database;

  constructor(db: D1Database, data: any = {}) {
    this.db = db;
    this.props = this.setProperties(data);
  }

  setProperties({
    iduser,
    name,
    _gender,
    _birthdate,
    email,
    createdon,
    passwd,
    alert,
    active,
    facebook,
    google,
    twitter,
  }: any): IUser {
    return {
      iduser,
      name,
      email,
      createdon: createdon || null,
      passwd: passwd || null,
      alert: !!alert,
      active: active !== undefined ? !!active : true,
      facebook: facebook || null,
      google: google || null,
      twitter: twitter || null,
    };
  }

  getProperties() {
    const props = { ...this.props };
    delete props.passwd;
    return props;
  }

  async findById(iduser: number): Promise<User> {
    const result = await this.db
      .prepare("SELECT * FROM Users WHERE iduser = ?")
      .bind(iduser)
      .first<IUser>();

    if (result) {
      return new User(this.db, result);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async findByEmail(email: string): Promise<User> {
    const result = await this.db
      .prepare("SELECT * FROM Users WHERE email = ?")
      .bind(email)
      .first<IUser>();

    if (result) {
      return new User(this.db, result);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async findByFacebook(facebook: string): Promise<User> {
    const result = await this.db
      .prepare("SELECT * FROM Users WHERE facebook = ?")
      .bind(facebook)
      .first<IUser>();

    if (result) {
      return new User(this.db, result);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async findByGoogle(google: string): Promise<User> {
    const result = await this.db
      .prepare("SELECT * FROM Users WHERE google = ?")
      .bind(google)
      .first<IUser>();

    if (result) {
      return new User(this.db, result);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  _preHashPassword(password: string): string {
    return base64.stringify(sha256(password));
  }

  async hashPassword(password: string): Promise<string> {
    const preHashPassword = this._preHashPassword(password);
    return bcrypt.hash(preHashPassword, 10);
  }

  async verifyPassword(password: string): Promise<void> {
    const preHashPassword = this._preHashPassword(password);
    const result = await bcrypt.compare(preHashPassword, this.props.passwd!);
    if (result === true) {
      return;
    } else {
      throw new Error("Invalid password!");
    }
  }

  setId() {
    this.props.iduser = Date.now();
  }

  setAutoPassword() {
    this.props.passwd = md5(
      sha256([Math.random().toString(), new Date().toISOString()].join("gotMONEYapp")),
    ).toString();
  }

  async create(): Promise<any> {
    const hash = await this.hashPassword(this.props.passwd!);
    this.props.passwd = hash;
    this.props.active = true;
    this.props.createdon = new Date();

    return this.db
      .prepare(
        "INSERT INTO Users (iduser, email, name, passwd, alert, active, facebook, google, twitter, createdon, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(
        this.props.iduser,
        this.props.email,
        this.props.name,
        this.props.passwd,
        this.props.alert ? 1 : 0,
        this.props.active ? 1 : 0,
        this.props.facebook,
        this.props.google,
        this.props.twitter,
        this.props.createdon.toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
      )
      .run();
  }

  async update(): Promise<any> {
    const result = await this.db
      .prepare("UPDATE Users SET name = ?, alert = ?, updatedAt = ? WHERE iduser = ?")
      .bind(this.props.name, this.props.alert ? 1 : 0, new Date().toISOString(), this.props.iduser)
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async updateFacebook(): Promise<any> {
    const result = await this.db
      .prepare("UPDATE Users SET facebook = ?, updatedAt = ? WHERE iduser = ?")
      .bind(this.props.facebook, new Date().toISOString(), this.props.iduser)
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async updateGoogle(): Promise<any> {
    const result = await this.db
      .prepare("UPDATE Users SET google = ?, updatedAt = ? WHERE iduser = ?")
      .bind(this.props.google, new Date().toISOString(), this.props.iduser)
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async updatePassword(): Promise<any> {
    const hash = await this.hashPassword(this.props.passwd!);
    const result = await this.db
      .prepare("UPDATE Users SET passwd = ?, updatedAt = ? WHERE iduser = ?")
      .bind(hash, new Date().toISOString(), this.props.iduser)
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async delete(): Promise<any> {
    const result = await this.db
      .prepare("DELETE FROM Users WHERE iduser = ?")
      .bind(this.props.iduser)
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }
}

export default User;
