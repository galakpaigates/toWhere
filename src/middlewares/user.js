import { UserModel } from "../models.js";

export async function recognizeUser(req, res, next) {
    try {
        const userId = req.headers.user_id;
        if (!userId) {
            return next(
                res.status(400).json({
                    status: 400,
                    message: "User ID is required",
                })
            );
        }

        const currUser = await UserModel.findById(userId);
        if (!currUser) {
            return next(
                res.status(404).json({
                    status: 404,
                    message: "User Not Found",
                })
            );
        }

        req.headers.currUser = currUser;
        next();
    } catch (err) {
        console.log("!!! SERVER ERROR: ", err);

        next(
            res.status(500).json({
                status: 500,
                message: "Unable to process request, try again",
            })
        );
    }
}
