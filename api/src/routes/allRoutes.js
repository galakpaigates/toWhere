import { Router } from "express";

import userRoutes from "./user.js";
import flightRoutes from "./flight.js";

const allRoutes = Router();

allRoutes.use("/users", userRoutes);
allRoutes.use("/flights", flightRoutes);

export default allRoutes;
