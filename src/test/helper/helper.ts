import faker from 'faker';

const ID_ACCOUNT = 9999999999;
const ID_CATEGORY = 9999999999;
const ID_TRANSACTION = 9999999999;
const ID_USER = 9999999999;

export const getFakeUser = () => {
  return {
    iduser: ID_USER,
    name: faker.name.findName(),
    email: faker.internet.email(),
    createdon: faker.date.past().toJSON(),
    passwd: faker.internet.password(),
    alert: faker.random.boolean(),
    active: true,
    facebook: faker.internet.password(),
    google: faker.internet.password(),
    twitter: faker.internet.password(),
  };
};

export const getFakeAccount = () => {
  return {
    iduser: ID_USER,
    idaccount: ID_ACCOUNT,
    idtype: faker.random.number(),
    description: faker.finance.accountName().substring(0, 45),
    creditlimit: parseFloat(faker.finance.amount()),
    balance: parseFloat(faker.finance.amount()),
    openingdate: faker.date.future().toJSON(),
    duedate: 25,
  };
};

export const getFakeAccountType = () => {
  return {
    idtype: faker.random.number(),
    description: faker.finance.accountName(),
    icon: faker.image.avatar(),
    inactive: faker.random.boolean(),
  };
};

export const getFakeCategory = () => {
  return {
    iduser: ID_USER,
    idcategory: ID_CATEGORY,
    description: faker.finance.accountName(),
    budget: faker.random.number(),
  };
};

export const getFakeTransaction = () => {
  return {
    iduser: ID_USER,
    idtransaction: ID_TRANSACTION,
    idaccount: ID_ACCOUNT,
    idparent: faker.random.number(),
    idstatus: 5,
    description: faker.lorem.words(),
    instalment: '7',
    amount: parseFloat(faker.finance.amount()),
    type: 'C',
    startdate: faker.date.past().toJSON(),
    duedate: faker.date.future().toJSON(),
    tag: faker.internet.color(),
    origin: 'W',
  };
};

export const getMongoDbModelMock = () => {
  return {
    where: function() {
      return this;
    },
    sort: function() {
      return this;
    },
    lean: function() {
      return this;
    },
    exec: function() {
      return this;
    },
  };
};

export default {
  getFakeUser,
  getFakeAccount,
  getFakeAccountType,
  getFakeCategory,
  getFakeTransaction,
  getMongoDbModelMock,
};
