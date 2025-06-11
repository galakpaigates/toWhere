import { Router } from "express";
import Flight from "../controllers/Flight.js";

const flight = new Flight();
const flightRoutes = Router();

flightRoutes.get("/", (req, res, next) => flight.read(req, res, next));
flightRoutes.get("/:id", (req, res, next) => flight.read(req, res, next));
flightRoutes.post("/", (req, res, next) => flight.create(req, res, next));
flightRoutes.put("/:id", (req, res, next) => flight.update(req, res, next));
flightRoutes.delete("/:id", (req, res, next) => flight.delete(req, res, next));

export default flightRoutes;
