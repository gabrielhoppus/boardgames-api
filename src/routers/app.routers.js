import { Router } from "express";
import gameRouters from "./game.routers.js";

const router = Router();

router.use(gameRouters);

export default router;