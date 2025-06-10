import { Router } from "express";

const homeRoute = Router();

homeRoute.get("/", (req, res) => {
    console.log("+++ URL: ", req.url);
    res.json({ status: 200, message: "Welcome Home!" });
});

export default homeRoute;
