import { Hono } from "hono";
import * as validator from "../middleware/validate_user";
import * as session from "./session_process";
import { login, signup } from "../auth/local";
import { facebookAuth } from "../auth/facebook";
import { googleAuth } from "../auth/google";
import { sign } from "hono/jwt";

type Bindings = {
  SESSION_SECRET: string;
};

const sessionRouter = new Hono<{ Bindings: Bindings }>();

sessionRouter.get("/logout", session.userLogout);

sessionRouter.get("/loggedin", session.ok);

sessionRouter.post("/login", validator.isValidLogin, async (c) => {
  try {
    const user = await login(c);
    const secret = c.env.SESSION_SECRET || "tasmanianDevil";
    const token = await sign(user, secret);
    return c.json({ ...user, token });
  } catch (err: any) {
    return c.json({ message: err.message }, 401);
  }
});

sessionRouter.post("/facebook", async (c) => {
  try {
    const profile = await c.req.json();
    const user = await facebookAuth(profile, c.env);
    const secret = c.env.SESSION_SECRET || "tasmanianDevil";
    const token = await sign(user, secret);
    return c.json({ ...user, token });
  } catch (err: any) {
    return c.json({ message: err.message }, 401);
  }
});

sessionRouter.post("/google", async (c) => {
  try {
    const profile = await c.req.json();
    const user = await googleAuth(profile, c.env);
    const secret = c.env.SESSION_SECRET || "tasmanianDevil";
    const token = await sign(user, secret);
    return c.json({ ...user, token });
  } catch (err: any) {
    return c.json({ message: err.message }, 401);
  }
});

sessionRouter.put("/recovery", validator.isValidRecovery, session.passwordRecovery);

sessionRouter.post("/signup", validator.isValidSignup, async (c) => {
  try {
    const user = await signup(c);
    const secret = c.env.SESSION_SECRET || "tasmanianDevil";
    const token = await sign(user, secret);
    return c.json({ ...user, token }, 201);
  } catch (err: any) {
    const status = err.status || 500;
    return c.json({ message: err.message }, status);
  }
});

export default sessionRouter;
