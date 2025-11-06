import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'sessions',
});

store.on('error', function (error) {
  console.log(error);
});

export default store;
