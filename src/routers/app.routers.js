import { Router } from "express";
import gameRouter from "./game.routers.js";

const router = Router();

router.use(gameRouter);

export default router;