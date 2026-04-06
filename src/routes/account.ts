import { Hono } from "hono";
import * as account from "./account_process";
import * as isValid from "../middleware/validate_account";

const accountRouter = new Hono();

accountRouter.post("/", isValid.validateAccount, account.create);
accountRouter.get("/", account.read);
accountRouter.put("/:id", isValid.validateAccount, account.update);
accountRouter.delete("/:id", account.remove);

export default accountRouter;
