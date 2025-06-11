import { FlightModel } from "../models.js";
import Errors from "../utils/responses/Error.js";
import Success from "../utils/responses/Success.js";
import { validateObjectId } from "../utils/validation.js";

export default class Flight {
    create = async (req, res, next) => {
        try {
            const newFlight = req.body;
            const currUser = req.headers.currUser;

            newFlight.createdBy = currUser._id;
            newFlight.updatedBy = currUser._id;
            newFlight.changes = [`Created by ${currUser.username}`];

            if (currUser.role != "super admin" && currUser.role != "manager") {
                return next(
                    Errors.unauthorized(
                        "Only a 'manager' or 'super admin' can create a flight."
                    )
                );
            }

            await FlightModel.validate(newFlight);

            // ensure flight origin and destination differ
            if (newFlight.origin == newFlight.destination) {
                return next(
                    Errors.badRequest(
                        "Flight origin and destination can not be the same"
                    )
                );
            }

            const flights = await FlightModel.create(newFlight);

            next(Success.created(res, "Flight Created", flights));
        } catch (err) {
            console.error("SERVER ERROR: ");
            console.log(err, "\n");

            if (!!err.errors) {
                const errFields = Object.keys(err.errors);

                // handle error one at a time not to overwhelm user
                // sampleMessage = "destination: ValidatorError: Path `destination` is required."
                const field = errFields[0];
                const kind = err.errors[field].kind;

                if (kind && kind == "required")
                    next(Errors.badRequest(err.errors[field].message.slice(5)));
                else if (err.errors[field].kind == "user defined")
                    next(Errors.badRequest(err.errors[field].message));
                else next(Errors.internalServerError());
            } else next(Errors.internalServerError());
        }
    };

    read = async (req, res, next) => {
        try {
            const flightId = req.params.id;

            if (flightId) {
                if (!validateObjectId(flightId))
                    return next(Errors.badRequest("Invalid Flight ID"));

                const flight = await FlightModel.findById(flightId, { __v: 0 });

                if (!flight) return next(Errors.notFound("Flight not found"));

                return next(Success.ok(res, "Flight Retrieved", flight));
            }

            const flights = await FlightModel.find({}, { __v: 0 });
            next(Success.ok(res, "Flights Retrieved", flights));
        } catch (err) {
            console.error("!!!!!! SERVER ERROR: ", err);
            next(Errors.internalServerError());
        }
    };

    update = async (req, res, next) => {
        try {
            const flightId = req.params.id;

            if (!validateObjectId(flightId))
                return next(Errors.badRequest("Invalid Flight ID"));

            const newFlight = req.body;
            const currUser = req.headers.currUser;

            newFlight.updatedBy = currUser._id;

            if (currUser.role != "manager" && currUser.role != "super admin") {
                return next(
                    Errors.unauthorized(
                        "Only a 'super admin' or 'manager' can update flight info"
                    )
                );
            }

            const flightToSave = await FlightModel.findById(flightId);

            if (!flightToSave)
                return next(Errors.notFound("Flight does not exists"));

            if (newFlight.destination) {
                flightToSave.changes.push({
                    activity: `'${currUser.username}' changed destination from '${flightToSave.destination}' to '${newFlight.destination}'`,
                    timestamp: new Date(),
                });
                flightToSave.destination = newFlight.destination;
            }
            if (newFlight.origin) {
                flightToSave.changes.push({
                    activity: `${currUser.username} changed origin from ${flightToSave.origin} to ${newFlight.origin}`,
                    timestamp: new Date(),
                });
                flightToSave.origin = newFlight.origin;
            }
            if (newFlight.duration) {
                flightToSave.changes.push({
                    activity: `'${currUser.username}' changed duration from '${flightToSave.duration}' to '${newFlight.duration}'`,
                    timestamp: new Date(),
                });
                flightToSave.duration = newFlight.duration;
            }
            if (newFlight.capacity) {
                flightToSave.changes.push({
                    activity: `'${currUser.username}' changed capacity from '${flightToSave.capacity}' to '${newFlight.capacity}'`,
                    timestamp: new Date(),
                });
                flightToSave.capacity = newFlight.capacity;
            }

            flightToSave.updatedAt = new Date();

            await FlightModel.validate(flightToSave);

            if (flightToSave.origin == flightToSave.destination)
                return next(
                    Errors.badRequest(
                        "Flight origin and destination can not be the same"
                    )
                );

            await FlightModel.updateOne({ _id: flightId }, flightToSave);

            next(Success.noContent(res, "Flight Updated"));
        } catch (err) {
            console.error("SERVER ERROR: ");
            console.log(err, "\n");

            if (!!err.errors) {
                const errFields = Object.keys(err.errors);

                // handle error one at a time not to overwhelm user
                // sampleMessage = "destination: ValidatorError: Path `destination` is required."
                const field = errFields[0];
                const kind = err.errors[field].kind;

                if (kind && kind == "required")
                    next(Errors.badRequest(err.errors[field].message.slice(5)));
                else if (err.errors[field].kind == "user defined")
                    next(Errors.badRequest(err.errors[field].message));
                else next(Errors.internalServerError());
            } else next(Errors.internalServerError());
        }
    };

    delete = async (req, res, next) => {
        try {
            const flightId = req.params.id;

            if (!validateObjectId(flightId))
                return next(Errors.badRequest("Invalid Flight ID"));

            const currUser = req.headers.currUser;

            if (currUser.role != "manager" && currUser.role != "super admin") {
                return next(
                    Errors.unauthorized(
                        "Only a 'super admin' or 'manager' can update flight info"
                    )
                );
            }

            await FlightModel.updateOne(
                { _id: flightId },
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

            const deletedFlight = await FlightModel.deleteOne({
                _id: flightId,
            });

            if (deletedFlight.deletedCount <= 0)
                return next(Errors.notFound("Flight not found"));

            next(Success.noContent(res, "Flight Deleted"));
        } catch (err) {
            next(Errors.internalServerError());
        }
    };
}
