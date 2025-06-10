export default class Success {
    static async #send(res, code, message, data) {
        res.status(code).json(
            data
                ? {
                      status: code,
                      message: message,
                      data,
                  }
                : {
                      status: code,
                      message: message,
                  }
        );
    }

    static alreadyReported(res, message) {
        this.#send(res, 208, message || "Already Reported");
    }

    static created(res, message, data) {
        this.#send(res, 201, message || "Created", data);
    }

    static noContent(res, message) {
        this.#send(res, 204, message || "No Content");
    }

    static ok(res, message, data) {
        this.#send(res, 200, message || "OK", data);
    }
}
