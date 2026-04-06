import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as localAuth from '../../../auth/local';
import User from '../../../controllers/user';
import mailer from '../../../utils/mailer';

describe('Local Auth', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('#login', () => {
    it('should login successfully', async () => {
      const userProps = { email: 'test@example.com', passwd: 'password', iduser: 1 };
      const c = {
        req: {
          json: vi.fn().mockResolvedValue({ email: 'test@example.com', passwd: 'password' })
        }
      } as any;

      const userInstance = new User();
      userInstance.props = userProps;
      vi.spyOn(User.prototype, 'findByEmail').mockResolvedValue(userInstance);
      vi.spyOn(User.prototype, 'verifyPassword').mockResolvedValue(undefined);

      const result = await localAuth.login(c);
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error on invalid password', async () => {
      const c = {
        req: {
          json: vi.fn().mockResolvedValue({ email: 'test@example.com', passwd: 'wrong' })
        }
      } as any;

      vi.spyOn(User.prototype, 'findByEmail').mockResolvedValue(new User());
      vi.spyOn(User.prototype, 'verifyPassword').mockRejectedValue(new Error('Invalid'));

      await expect(localAuth.login(c)).rejects.toThrow('Invalid username/password!');
    });
  });
});
