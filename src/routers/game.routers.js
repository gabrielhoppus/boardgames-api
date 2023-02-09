import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controllers.js";
import { gameSchema } from "../schemas/game.schema.js";
import { validateSchema } from "../middleware/validate.middleware.js";

const gameRouter = Router();

gameRouter.get("/games", getGames);
gameRouter.post("/games", validateSchema(gameSchema), postGames);


export default gameRouter;
