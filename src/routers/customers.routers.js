import { Router } from "express";
import { getCustomer, getCustomers, postCustomers, updateCustomer } from "../controllers/customers.controllers.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomer);
customerRouter.post("/customers", validateSchema(customerSchema), postCustomers);
customerRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomer)


export default customerRouter;