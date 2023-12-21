export class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
