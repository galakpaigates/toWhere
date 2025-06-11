import mongoose, { Schema, Types } from "mongoose";
import validator from "validator";
import {
    validateAirportCode,
    validateCapacity,
    validateCountry,
    validateFlightDuration,
    validateNationality,
    validateUserRole,
} from "./utils/validation.js";
import {
    MAX_CAPACITY,
    MAX_FLIGHT_DURATION,
    MIN_CAPACITY,
    MIN_FLIGHT_DURATION,
} from "./utils/CONSTANTS.js";

const userSchema = new Schema(
    {
        name: {
            required: true,
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            validate: [validator.isEmail, "Invalid email address"],
            lowercase: true,
            trim: true,
            unique: true,
            required: true,
        },
        role: {
            type: String,
            lowercase: true,
            trim: true,
            validate: [validateUserRole, "Invalid user role"],
            default: "standard",
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        changes: {
            type: Array,
            requird: true,
            default: [
                {
                    activity: "Created",
                    timestamp: new Date(),
                },
            ],
        },
    },
    { timestamps: true }
);
export const UserModel = mongoose.model("user", userSchema);

const flightSchema = new Schema(
    {
        destination: {
            required: true,
            type: String,
            ref: "airport",
            validate: [
                validateAirportCode,
                "Invalid destination airport, destination must be a valid airport code",
            ],
        },
        origin: {
            required: true,
            type: String,
            ref: "airport",
            validate: [
                validateAirportCode,
                "Invalid origin airport, origin must be a valid airport code",
            ],
        },
        duration: {
            type: Number,
            required: true,
            validate: [
                validateFlightDuration,
                `Invalid flight duration, must be between ${MIN_FLIGHT_DURATION} to ${MAX_FLIGHT_DURATION} minutes`,
            ],
        },
        capacity: {
            type: Number,
            required: true,
            validate: [
                validateCapacity,
                `Invalid capacity, capacity must be between ${MIN_CAPACITY} to ${MAX_CAPACITY}`,
            ],
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        changes: {
            type: Array,
            requird: true,
            default: [
                {
                    activity: "Created",
                    timestamp: new Date(),
                },
            ],
        },
    },
    { timestamps: true }
);
export const FlightModel = mongoose.model("flight", flightSchema);

const passengerSchema = new Schema(
    {
        firstName: {
            required: true,
            type: String,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            validate: [validator.isEmail, "Invalid email address"],
            lowercase: true,
            trim: true,
            unique: true,
            required: true,
        },
        passportNumber: {
            type: String,
            required: true,
        },
        nationality: {
            type: String,
            required: true,
            validate: [validateNationality, "Invalid nationality"],
        },
        flight: {
            type: Types.ObjectId,
            required: true,
            ref: "flight",
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        changes: {
            type: Array,
            requird: true,
            default: [
                {
                    activity: "Created",
                    timestamp: new Date(),
                },
            ],
        },
    },
    { timestamps: true }
);
export const PassengerModel = mongoose.model("passenger", passengerSchema);
