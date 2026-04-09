import { Hono } from "hono";
import * as transaction from "./transaction_process";
import * as validate from "../middleware/validate_transaction";

const transactionRouter = new Hono();

transactionRouter.post("/", validate.isValidCreate, transaction.create);
transactionRouter.get("/", transaction.read);
transactionRouter.put("/:id", validate.isValid, transaction.update);
transactionRouter.delete("/:id", transaction.remove);

export default transactionRouter;
