import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(errorHandler);

export default app;
