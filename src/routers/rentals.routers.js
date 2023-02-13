import { Router } from "express";
import {
    closeRental,
    deleteRental,
    getRentals,
    postRentals
} from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { rentalSchema } from "../schemas/rentals.schema.js";

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals", validateSchema(rentalSchema), postRentals);
rentalRouter.post("/rentals/:id/return", closeRental);
rentalRouter.delete("/rentals/:id", deleteRental)



export default rentalRouter;
