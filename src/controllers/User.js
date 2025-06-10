import { UserModel } from "../models.js";
import { USER_ROLES } from "../utils/CONSTANTS.js";
import Errors from "../utils/responses/Error.js";
import Success from "../utils/responses/Success.js";
import { camelToTitleCase } from "../utils/utils.js";

export default class User {
    create = async (req, res, next) => {
        try {
            const newUser = req.body;
            const currUser = req.headers.currUser;

            newUser.createdBy = currUser._id;
            newUser.updatedBy = currUser._id;
            newUser.changes = [`Created by ${currUser.username}`];

            await UserModel.validate(newUser);

            if (
                newUser.role == "super admin" &&
                currUser.role != "super admin"
            ) {
                return next(
                    Errors.unauthorized(
                        "Only a SUPER ADMIN can create a SUPER ADMIN user"
                    )
                );
            } else if (newUser.role && !USER_ROLES.includes(newUser.role))
                return next(Errors.badRequest("Invalid user role"));

            const users = await UserModel.create(newUser);

            next(Success.ok(res, "User Created", users));
        } catch (err) {
            console.error("SERVER ERROR: ");
            console.log(err, "\n");

            // handle duplicate email records
            if (err.message.startsWith("E11000")) {
                const errKey = Object.keys(err.keyValue)[0];
                next(
                    Errors.conflict(
                        `User with the ${errKey} '${err.errorResponse.keyValue[errKey]}' already exists`
                    )
                );
            } else if (err.errors) {
                // sampleMessage = "Validation failed: email: Path `email` is required."
                const field = err.message.split(": ", 2)[1];
                const errDetails = err?.errors;
                const kind = errDetails ? errDetails[field].kind : null;
                const message = camelToTitleCase(
                    err.message.split(": Path ")[1]?.split(".")[0]
                );

                if (kind && kind == "required")
                    next(Errors.badRequest(message));
                else if (
                    err.errors[field].kind == "user defined" &&
                    err.errors[field].path == "email"
                )
                    next(Errors.badRequest("Invalid email address"));
                else next(Errors.internalServerError());
            } else next(Errors.internalServerError());
        }
    };

    read = async (req, res, next) => {
        try {
            const userId = req.params.id;

            if (userId) {
                const user = await UserModel.find({ _id: userId }, { __v: 0 });
                next(Success.ok(res, "User Retrieved", user));
            }

            const users = await UserModel.find({}, { __v: 0 });
            next(Success.ok(res, "Users Retrieved", users));
        } catch (err) {
            console.error("!!!!!! SERVER ERROR: ", err);
            next(
                res
                    .status(500)
                    .send("Unable to process request, please try again!")
            );
        }
    };

    update = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const newUser = req.body;
            const currUser = req.headers.currUser;

            newUser.updatedBy = currUser._id;

            if (
                newUser.role &&
                newUser.role == "super admin" &&
                currUser.role != "super admin"
            ) {
                return next(
                    Errors.unauthorized(
                        "Only a 'super admin' can assign a 'super admin' user role"
                    )
                );
            } else if (newUser.role && !USER_ROLES.includes(newUser.role))
                return next(Errors.badRequest("Invalid user role"));

            const userToSave = await UserModel.findById(userId);

            if (!userToSave)
                return next(Errors.notFound("User does not exists"));

            if (newUser.name) {
                userToSave.changes.push({
                    activity: `'${currUser.username}' changed name from '${userToSave.name}' to '${newUser.name}'`,
                    timestamp: new Date(),
                });
                userToSave.name = newUser.name;
            }
            if (newUser.username) {
                userToSave.changes.push({
                    activity: `${currUser.username} changed username from ${userToSave.username} to ${newUser.username}`,
                    timestamp: new Date(),
                });
                userToSave.username = newUser.username;
            }
            if (newUser.email) {
                userToSave.changes.push({
                    activity: `'${currUser.username}' changed email from '${userToSave.email}' to '${newUser.email}'`,
                    timestamp: new Date(),
                });
                userToSave.email = newUser.email;
            }
            if (newUser.role) {
                if (currUser.role != "super admin")
                    return next(
                        Errors.unauthorized(
                            "Only 'super admin' can assign roles"
                        )
                    );

                userToSave.changes.push({
                    activity: `'${currUser.username}' changed role from '${userToSave.role}' to '${newUser.role}'`,
                    timestamp: new Date(),
                });
                userToSave.role = newUser.role;
            }

            userToSave.updatedAt = new Date();

            await UserModel.validate(userToSave);
            await UserModel.updateOne({ _id: userId }, userToSave);

            next(Success.noContent(res, "User Updated"));
        } catch (err) {
            console.error("\nSERVER ERROR: ");
            console.log(err, "\n");

            // handle duplicate email records
            if (err.message.startsWith("E11000")) {
                const errKey = Object.keys(err.keyValue)[0];
                next(
                    Errors.conflict(
                        `User with the ${errKey} '${err.errorResponse.keyValue[errKey]}' already exists`
                    )
                );
            } else if (err.errors) {
                // sampleMessage = "Validation failed: email: Path `email` is required."
                const field = err.message.split(": ", 2)[1];
                const errDetails = err?.errors;
                const kind = errDetails ? errDetails[field].kind : null;
                const message = camelToTitleCase(
                    err.message.split(": Path ")[1]?.split(".")[0]
                );

                if (kind && kind == "required")
                    next(Errors.badRequest(message));
                else if (
                    err.errors[field].kind == "user defined" &&
                    err.errors[field].path == "email"
                )
                    next(Errors.badRequest("Invalid email address"));
                else next(Errors.internalServerError());
            } else next(Errors.internalServerError());
        }
    };

    delete = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const currUser = req.headers.currUser;

            await UserModel.updateOne(
                { _id: userId },
                {
                    $push: {
                        changes: [
                            {
                                activity: `${currUser.username}' deleted this record`,
                                timestamp: new Date(),
                            },
                        ],
                    },
                }
            );

            await UserModel.deleteOne({ _id: userId });
            next(Success.noContent(res, "User Deleted"));
        } catch (err) {
            next(Errors.internalServerError());
        }
    };
}
