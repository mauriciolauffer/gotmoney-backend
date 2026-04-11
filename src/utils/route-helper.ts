import { Context } from "hono";

/**
 * Standardizes common logic such as retrieving the JWT payload and database binding from the Hono context.
 * @param c - The Hono context.
 * @returns An object containing the database binding and the request user.
 */
export function getContextData(c: Context) {
  const db = c.env.DB as D1Database;
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  return { db, reqUser };
}

export default {
  getContextData,
};
