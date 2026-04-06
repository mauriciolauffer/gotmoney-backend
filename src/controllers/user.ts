import bcrypt from 'bcryptjs';
import sha256 from 'crypto-js/sha256';
import base64 from 'crypto-js/enc-base64';
import md5 from 'crypto-js/md5';
import db from '../models/user';
import CustomErrors from '../utils/errors';

export class User {
  props: any;

  constructor(data: any = {}) {
    this.setProperties(data);
  }

  setProperties({ iduser, name, gender, birthdate, email, createdon, passwd, alert, facebook, google, twitter }: any) {
    this.props = {
      iduser,
      name,
      gender: gender || 'F',
      birthdate: birthdate || null,
      email,
      createdon: createdon || null,
      passwd: passwd || null,
      alert,
      active: true,
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
    const docs = await db.findOne({ iduser }).lean().exec();
    if (docs) {
      return new User(docs);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async findByEmail(email: string): Promise<User> {
    const docs = await db.findOne({ email }).lean().exec();
    if (docs) {
      return new User(docs);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async findByFacebook(facebook: string): Promise<User> {
    const docs = await db.findOne({ facebook }).lean().exec();
    if (docs) {
      return new User(docs);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async findByGoogle(google: string): Promise<User> {
    const docs = await db.findOne({ google }).lean().exec();
    if (docs) {
      return new User(docs);
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
    const result = await bcrypt.compare(preHashPassword, this.props.passwd);
    if (result === true) {
      return;
    } else {
      throw new Error('Invalid password!');
    }
  }

  setId() {
    this.props.iduser = Date.now();
  }

  setAutoPassword() {
    this.props.passwd = md5(sha256([Math.random().toString(), new Date().toISOString()].join('gotMONEYapp'))).toString();
  }

  async create(): Promise<any> {
    const hash = await this.hashPassword(this.props.passwd);
    this.props.passwd = hash;
    this.props.active = true;
    this.props.createdon = new Date();
    return db.create(this.props);
  }

  async update(): Promise<any> {
    const docs = await db.findOneAndUpdate(
      { iduser: this.props.iduser },
      {
        name: this.props.name,
        alert: this.props.alert,
      }
    ).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async updateFacebook(): Promise<any> {
    const docs = await db.findOneAndUpdate({ iduser: this.props.iduser }, { facebook: this.props.facebook }).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async updateGoogle(): Promise<any> {
    const docs = await db.findOneAndUpdate({ iduser: this.props.iduser }, { google: this.props.google }).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async updatePassword(): Promise<any> {
    const hash = await this.hashPassword(this.props.passwd);
    const docs = await db.findOneAndUpdate({ iduser: this.props.iduser }, { passwd: hash }).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async delete(): Promise<any> {
    const docs = await db.findOneAndDelete({ iduser: this.props.iduser }).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }
}

export default User;
