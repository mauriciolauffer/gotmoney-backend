import { jwt } from 'hono/jwt';

export const jwtMiddleware = (secret: string) => jwt({
  secret: secret,
  alg: 'HS256',
});
