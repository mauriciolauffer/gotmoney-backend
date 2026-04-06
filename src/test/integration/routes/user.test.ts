import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import app from '../../../index';
import User from '../../../controllers/user';
import Account from '../../../controllers/account';
import Category from '../../../controllers/category';
import AccountType from '../../../controllers/accounttype';
import * as Helper from '../../helper/helper';
import { sign } from 'hono/jwt';
import mongoose from 'mongoose';

const payloadBase = Helper.getFakeUser();

describe('Routing User Integration', () => {
  let token: string;
  const env = {
    SESSION_SECRET: 'tasmanianDevil',
    CORS_ORIGIN: '*',
    NODE_ENV: 'development',
    DB_URL: 'mongodb://localhost/test'
  };

  beforeEach(async () => {
    vi.spyOn(User.prototype, 'findById').mockResolvedValue(new User(payloadBase));
    vi.spyOn(User.prototype, 'update').mockResolvedValue({});
    vi.spyOn(Account.prototype, 'getAll').mockResolvedValue([]);
    vi.spyOn(Category.prototype, 'getAll').mockResolvedValue([]);
    vi.spyOn(AccountType.prototype, 'getAll').mockResolvedValue([]);
    vi.spyOn(mongoose, 'connect').mockResolvedValue(mongoose as any);

    token = await sign(payloadBase, env.SESSION_SECRET);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/user/:id', () => {
    it('should get user', async () => {
      const res = await app.request(`/api/user/${payloadBase.iduser}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }, env);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toBeDefined();
    });
  });

  describe('PUT /api/user/:id', () => {
    it('should update user, no password', async () => {
      const payload = { ...payloadBase, name: 'Updated Name' };
      const res = await app.request(`/api/user/${payload.iduser}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }, env);
      expect(res.status).toBe(200);
    });
  });
});
