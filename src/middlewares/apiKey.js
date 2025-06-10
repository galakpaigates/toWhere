const API_KEY = "5993736a-401d-4a67-b299-eccca320dd35";

export default function authenticateRoutes(req, res, next) {
    const apiKey = req.headers.authorization;

    if (!apiKey || apiKey != API_KEY)
        return next(
            res.status(404).json({ status: 404, message: "Not Found" })
        );

    return next();
}
