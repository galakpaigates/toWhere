import { Router } from "express";
import userRoutes from "./user.js";

const allRoutes = Router();

allRoutes.use("/users", userRoutes);

export default allRoutes;
