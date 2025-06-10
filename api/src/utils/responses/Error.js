export default class Errors {
    static #send(status, message, data) {
        return data
            ? {
                  status: status,
                  message: message,
                  data: data,
              }
            : {
                  status: status,
                  message: message,
              };
    }

    /**
     * Returns an error object.
     * @param {string} message - The error message.
     * @returns {Object} An error object.
     */
    static badRequest(message, data) {
        return this.#send(400, message || "Bad Request", data);
    }

    /**
     * Returns an error object.
     * @param {string} message - The error message.
     * @returns {Object} An error object.
     */
    static unauthorized(message) {
        return this.#send(401, message || "Unauthorized");
    }

    /**
     * @param {string} message - The error message
     * @returns {Object} An error object
     */
    static forbidden(message) {
        return this.#send(403, message || "Forbidden");
    }

    static notFound(message) {
        return this.#send(404, message || "Not Found");
    }

    /**
     * Returns an error object.
     * @param {string} message - The error message.
     * @returns {Object} An error object.
     */

    static conflict(message, data) {
        return this.#send(409, message || "Conflict", data);
    }

    /**
     * Returns an error object.
     * @param {string} message - The error message.
     * @returns {Object} An error object.
     */
    static internalServerError(message) {
        return this.#send(
            500,
            message || "Unable to process request, try again"
        );
    }
}
