import express from "express";
import allRoutes from "./src/routes/allRoutes.js";
import authenticateAPIKeys from "./src/middlewares/apiKey.js";
import homeRoute from "./src/routes/home.js";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { responseEnhancer } from "express-response-formatter";

import { recognizeUser } from "./src/middlewares/user.js";

const app = express();

config();

app.use(express.json());
app.use(
    express.urlencoded({
        limit: "5mb",
        extended: true,
    })
);
app.use(morgan("dev"));
app.use(cors({ credentials: true }));
app.use(responseEnhancer());

app.use("/api", authenticateAPIKeys, recognizeUser, allRoutes);
app.use("/", homeRoute);

app.use((req, res, next) => {
    next(Errors.notFound("Not Found"));
});

// Error Middleware
app.use(async (error, request, response, next) => {
    return next(response.status(error.status || 500).json(error));
});

export default app;
