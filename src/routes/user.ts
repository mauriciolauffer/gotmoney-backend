import { Hono } from "hono";
import * as user from "./user_process";
import * as validator from "../middleware/validate_user";

const userRouter = new Hono();

userRouter.get("/:id", user.read);
userRouter.put("/:id", validator.isValidUpdate, user.update);

export default userRouter;
