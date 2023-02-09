import { Router } from "express";
import router from "./game.routers.js";

const appRouter = Router();

appRouter.use(router);

export default appRouter;