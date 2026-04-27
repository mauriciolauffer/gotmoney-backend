/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// import { Hono } from "hono";
import { Hono } from "hono/tiny";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { basicAuth } from "hono/basic-auth";
import { secureHeaders } from "hono/secure-headers";

import accounts from "./routes/accounts";
import categories from "./routes/categories";
import session from "./routes/session";
import transactions from "./routes/transactions";
import users from "./routes/users";

const app = new Hono().basePath("/api");

//app.use(csrf());
// app.use(secureHeaders());

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      message: err.message,
      cause: err?.cause,
    },
    500,
  );
});
app.notFound((ctx) => ctx.json({ message: "Not Found", ok: false }, 404));

app.route("/accounts", accounts);
app.route("/categories", categories);
app.route("/session", session);
app.route("/transactions", transactions);
app.route("/users", users);

export default app;
