//import { Hono } from 'hono'
//import { testClient } from 'hono/testing'
import { describe, it, expect } from "vitest";
import app from "../src/routes/accounts";

describe("Accounts endpoint", () => {
  //const client = testClient(app)

  it("should return accounts", async () => {
    // Call the endpoint using the typed client
    // Notice the type safety for query parameters (if defined in the route)
    // and the direct access via .$get()
    const res = await app.request("/", {
      method: "GET",
    });

    // Assertions
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      query: "hono",
      results: ["result1", "result2"],
    });
  });
});
