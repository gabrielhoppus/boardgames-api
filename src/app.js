import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import routers from "./routers/app.routers.js";

const app = express();
app.use(cors());
app.use(express.json());
// app.use(routers);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`))