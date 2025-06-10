import { Router } from "express";
import User from "../controllers/User.js";

const user = new User();
const userRoutes = Router();

userRoutes.get("/", (req, res, next) => user.read(req, res, next));
userRoutes.get("/:id", (req, res, next) => user.read(req, res, next));
userRoutes.post("/", (req, res, next) => user.create(req, res, next));
userRoutes.put("/:id", (req, res, next) => user.update(req, res, next));
userRoutes.delete("/:id", (req, res, next) => user.delete(req, res, next));

export default userRoutes;
