import { createMiddleware } from 'hono/factory'
import passport from './passport'

export const isUserAuthenticated = createMiddleware(async (c, next) => {
    const session = c.get('session');
    if (session && session.passport && session.passport.user) {
        c.set('user', session.passport.user);
        await next();
    } else {
        return c.json({ message: 'Unauthorized' }, 401);
    }
});

export const localLogin = createMiddleware(async (c, next) => {
    const body = await c.req.json();
    const user = await new Promise((resolve, reject) => {
        passport.authenticate('local-login', (err, user, info) => {
            if (err) reject(err);
            if (!user) reject(info);
            resolve(user);
        })(c.req, c.res);
    });
    const session = c.get('session');
    session.passport = { user: user };
    c.set('user', user);
    await next();
});

export const localSignup = createMiddleware(async (c, next) => {
    const body = await c.req.json();
    const user = await new Promise((resolve, reject) => {
        passport.authenticate('local-signup', (err, user, info) => {
            if (err) reject(err);
            if (!user) reject(info);
            resolve(user);
        })(c.req, c.res);
    });
    const session = c.get('session');
    session.passport = { user: user };
    c.set('user', user);
    await next();
});

export const facebookAuth = createMiddleware(async (c, next) => {
    const body = await c.req.json();
    const user = await new Promise((resolve, reject) => {
        passport.authenticate('facebook', (err, user, info) => {
            if (err) reject(err);
            if (!user) reject(info);
            resolve(user);
        })(c.req, c.res);
    });
    const session = c.get('session');
    session.passport = { user: user };
    c.set('user', user);
    await next();
});

export const googleAuth = createMiddleware(async (c, next) => {
    const body = await c.req.json();
    const user = await new Promise((resolve, reject) => {
        passport.authenticate('google', (err, user, info) => {
            if (err) reject(err);
            if (!user) reject(info);
            resolve(user);
        })(c.req, c.res);
    });
    const session = c.get('session');
    session.passport = { user: user };
    c.set('user', user);
    await next();
});
