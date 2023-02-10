import { Router } from "express";
import customerRouter from "./customers.routers.js";
import gameRouter from "./game.routers.js";
import rentalRouter from "./rentals.routers.js";

const router = Router();

router.use([gameRouter, customerRouter, rentalRouter]);

export default router;