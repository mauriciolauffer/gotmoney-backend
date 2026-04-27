import { Hono } from "hono/tiny";

const app = new Hono();

app.post("/", (ctx) => {
  const { limit, offset } = ctx.req.query();
  const posts = { limit, offset };
  return ctx.json({ posts });
});
app.get("/", (ctx) => {
  const { limit, offset } = ctx.req.query();
  const posts = { limit, offset };
  return ctx.json({ posts });
});
app.put("/:id", (ctx) => {
  const { limit, offset } = ctx.req.query();
  const posts = { limit, offset };
  return ctx.json({ posts });
});
app.delete("/:id", (ctx) => {
  const { limit, offset } = ctx.req.query();
  const posts = { limit, offset };
  return ctx.json({ posts });
});

export default app;
