import { Hono } from "hono";
import * as category from "./category_process";
import * as isValid from "../middleware/validate_category";

const categoryRouter = new Hono();

categoryRouter.post("/", isValid.validateCategory, category.create);
categoryRouter.get("/", category.read);
categoryRouter.put("/:id", isValid.validateCategory, category.update);
categoryRouter.delete("/:id", category.remove);

export default categoryRouter;
