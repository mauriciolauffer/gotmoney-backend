import { describe, it, expect, vi, afterEach } from 'vitest';
import nodemailer from 'nodemailer';
import mailer from '../../../utils/mailer';

const email = 'test@example.com';
const password = 'password';
const error = new Error('Error Mail');
const config = {
  EMAIL_HOST: 'smtp.example.com',
  EMAIL_PORT: '465',
  EMAIL_USER: 'user',
  EMAIL_PASSWORD: 'pass',
  EMAIL_FROM: 'from@example.com'
};

const fakeSendEmailResolved = {
  sendMail: vi.fn(() => Promise.resolve()),
};

const fakeSendEmailRejected = {
  sendMail: vi.fn(() => Promise.reject(error)),
};

describe('Mailer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('#sendRecoveryPassword()', () => {
    it('should send email for Recovery Password', async () => {
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(fakeSendEmailResolved as any);
      await mailer.sendRecoveryPassword(email, password, config);
      expect(fakeSendEmailResolved.sendMail).toHaveBeenCalled();
    });

    it('should fail when send email for Recovery Password', async () => {
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(fakeSendEmailRejected as any);
      const promise = mailer.sendRecoveryPassword(email, password, config);
      await expect(promise).rejects.toThrow('Error Mail');
    });
  });

  describe('#sendNewUser()', () => {
    it('should send email for New User', async () => {
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(fakeSendEmailResolved as any);
      await mailer.sendNewUser(email, password, config);
      expect(fakeSendEmailResolved.sendMail).toHaveBeenCalled();
    });

    it('should fail when send email for New User', async () => {
      vi.spyOn(nodemailer, 'createTransport').mockReturnValue(fakeSendEmailRejected as any);
      const promise = mailer.sendNewUser(email, password, config);
      await expect(promise).rejects.toThrow('Error Mail');
    });
  });
});
