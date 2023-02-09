import { gameSchema } from "../schemas/game.schema.js";

export async function validateGame(req, res, next) {
    const gameValidation = gameSchema.validate(
        req.body,
        { abortEarly: false });

    if (gameValidation.error){
        res.status(400).send(gameValidation.error.details)
        return;
    }
    next();
}