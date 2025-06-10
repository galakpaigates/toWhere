import { USER_ROLES } from "./CONSTANTS.js";

/**
 * Checks if the given msisdn is valid or not.
 * @param {Array} msisdns - An array of msisdn (Contacts) to be validated.
 * @returns {void}
 *
 * @throws Will throw an error if the contact doesn't start with 231.
 * @throws Will throw an error if the contact number or email is invalid.
 */
export const msisdnValidation = (msisdns, entity, data) => {
    if (!msisdns.length || !msisdns[0]) return false;

    if (typeof msisdns == "string") msisdns = [msisdns];

    const contacts = msisdns;
    const serviceCode = ["555", "88", "77"];

    for (let contact of contacts) {
        if (!contact.startsWith("0") && !contact.startsWith("231")) {
            contact = "231" + contact;
        }

        // Remove country code from the msisdn if added to the msisdn.
        let contactNumber;

        if (contact.startsWith("0")) {
            contactNumber = contact.slice(1);
        } else if (contact.startsWith("231")) {
            contactNumber = contact.slice(3);
        }

        const contactRange = contactNumber.length;

        // Check if contact number starts with either of the serviceCode elements.
        const validCode = serviceCode.some((val) =>
            contactNumber.startsWith(val)
        );

        // Msisdn range must be 9 digits and a valid code.
        if (contactRange !== 9 || !validCode || !contactNumber) {
            throw Errors.badRequest(
                `Invalid ${entity ? entity + " " : ""}phone number!`,
                data ? data : null
            );
        }
    }

    return { valid: true };
};

/**
 * Checks if the given email is valid or not.
 * @param {string} email - The email to be validated.
 * @returns {void}
 *
 * @throws Will throw an error if the email address is invalid.
 *
 */
export const emailValidation = (email, entity, data) => {
    const isValidEmail = validator.isEmail(email.trim());
    if (!isValidEmail) {
        throw Errors.badRequest(
            `Invalid ${entity ? entity + " " : ""}email address!`,
            data
        );
    }
};

export function validateUserRole(role) {
    if (!role) return true;

    return USER_ROLES.includes(role);
}
