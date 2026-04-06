import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger as honoLogger } from 'hono/logger';
import mongoose from 'mongoose';
import accountRouter from './routes/account';
import categoryRouter from './routes/category';
import sessionRouter from './routes/session';
import transactionRouter from './routes/transaction';
import userRouter from './routes/user';
import logger from './utils/logger';
import { jwtMiddleware } from './auth/jwt';

type Bindings = {
  DB_URL: string;
  SESSION_SECRET: string;
  CORS_ORIGIN: string;
  NODE_ENV: string;
}

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', honoLogger());
app.use('*', secureHeaders());
app.use('*', async (c, next) => {
  const corsOrigin = c.env.CORS_ORIGIN === '*' ? '*' : c.env.CORS_ORIGIN;
  const middleware = cors({
    origin: corsOrigin,
    allowHeaders: ['Content-Type', 'x-xsrf-token', 'X-CSRF-Token', 'x-csrf-token', 'X-Requested-With', 'Accept',
      'Expires', 'Last-Modified', 'Cache-Control', 'Access_token', 'Authorization', 'Cookie'],
    exposeHeaders: ['Set-Cookie', 'x-xsrf-token', 'X-CSRF-Token', 'x-csrf-token', 'X-Got-Money'],
    credentials: true,
  });
  return middleware(c, next);
});

// Database connection
let isConnected = false;
app.use('*', async (c, next) => {
  if (!isConnected) {
    try {
      await mongoose.connect(c.env.DB_URL, {
        ssl: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as any);
      isConnected = true;
      logger.info('Connected to MongoDB');
    } catch (err) {
      logger.error('MongoDB connection error:', err);
      return c.json({ error: 'Database connection failed' }, 500);
    }
  }
  await next();
});

// Authentication Middleware
app.use('/api/account/*', async (c, next) => {
    const middleware = jwtMiddleware(c.env.SESSION_SECRET || 'tasmanianDevil');
    return middleware(c, next);
});
app.use('/api/category/*', async (c, next) => {
    const middleware = jwtMiddleware(c.env.SESSION_SECRET || 'tasmanianDevil');
    return middleware(c, next);
});
app.use('/api/transaction/*', async (c, next) => {
    const middleware = jwtMiddleware(c.env.SESSION_SECRET || 'tasmanianDevil');
    return middleware(c, next);
});
app.use('/api/user/*', async (c, next) => {
    const middleware = jwtMiddleware(c.env.SESSION_SECRET || 'tasmanianDevil');
    return middleware(c, next);
});

// Routes
app.route('/api/account', accountRouter);
app.route('/api/category', categoryRouter);
app.route('/api/session', sessionRouter);
app.route('/api/transaction', transactionRouter);
app.route('/api/user', userRouter);

// Root route
app.get('/', (c) => c.text('GotMoney API is running!'));

// Error handling
app.onError((err, c) => {
  logger.error(err);
  const status = (err as any).status || 500;
  return c.json({
    message: err.message,
    error: c.env.NODE_ENV === 'development' ? err : {},
    validationErrors: (err as any).validationErrors,
  }, status as any);
});

app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404);
});

export default app;
