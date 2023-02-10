import { Router } from "express";
import { getRentals, postRentals } from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middleware/validate.middleware.js";

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals", postRentals);



export default rentalRouter;
