import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controllers";
import { gameSchema } from "../schemas/game.schema.js";
import { validateGame } from "../middleware/game.middleware.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", validateGame(gameSchema), postGames);

export default router;
