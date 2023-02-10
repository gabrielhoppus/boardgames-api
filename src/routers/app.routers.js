import { Router } from "express";
import customerRouter from "./customers.routers.js";
import gameRouter from "./game.routers.js";

const router = Router();

router.use([gameRouter, customerRouter]);

export default router;