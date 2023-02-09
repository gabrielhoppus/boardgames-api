import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controllers.js";
import { gameSchema } from "../schemas/game.schema.js";
import { validateSchema } from "../middleware/validate.middleware.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", validateSchema(gameSchema), postGames);


export default router;
