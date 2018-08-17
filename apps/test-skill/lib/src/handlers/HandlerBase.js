"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Handler {
    constructor(alexa) {
        this.alexa = alexa;
        this.event = alexa.event;
        this.alexaUserId = this.event.context.System.user.userId;
    }
}
exports.default = Handler;
//# sourceMappingURL=HandlerBase.js.map