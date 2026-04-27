import type { Bindings } from "../types";
import { Hono } from "hono/tiny";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (ctx) => {
  const payload = await ctx.req.json();
  const { results } = await ctx.env.DEV_GOTMONEY_DB.prepare(
    "INSERT * FROM accounts",
  )
    .bind(payload)
    .run();
  ctx.status(201);
  return ctx.json(results);
});

app.get("/", async (ctx) => {
  //  throw new Error("oiiii")
  const { limit, offset } = ctx.req.query();
  const { results } = await ctx.env.DEV_GOTMONEY_DB.prepare(
    "SELECT * FROM accounts",
  )
    .run();
  return ctx.json(results);
});

app.get("/:id", async (ctx) => {
  const { results } = await ctx.env.DEV_GOTMONEY_DB.prepare(
    "SELECT * FROM accounts WHERE idaccount = ? LIMIT 1",
  )
    .bind(ctx.req.param("id"))
    .run();
  console.dir(results);
  const res1 = await ctx.env.DEV_GOTMONEY_DB.prepare(
    "SELECT * FROM accounts WHERE idaccount = ? LIMIT 1",
  )
    .bind(ctx.req.param("id"))
    .run();
  console.dir(res1);
  const res2 = await ctx.env.DEV_GOTMONEY_DB.prepare(
    "SELECT * FROM accounts WHERE idaccount = ? LIMIT 1",
  )
    .bind(ctx.req.param("id"))
    .first();
  console.dir(res2);
  return ctx.json(results);
});

app.put("/:id", async (ctx) => {
  const payload = await ctx.req.json();
  const { results } = await ctx.env.DEV_GOTMONEY_DB.prepare(
    "UPDATE * FROM accounts WHERE idaccount = ?",
  )
    .bind(payload, ctx.req.param("id"))
    .run();
  return ctx.json(results);
});

app.delete("/:id", async (ctx) => {
  const { results } = await ctx.env.DEV_GOTMONEY_DB.prepare(
    "DELETE FROM accounts WHERE idaccount = ?",
  )
    .bind(ctx.req.param("id"))
    .run();
  return ctx.json(results);
});

export default app;
