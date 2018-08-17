"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LaunchRequestHandler_1 = require("./LaunchRequestHandler");
const FindHoursHandler_1 = require("./FindHoursHandler");
class HandlerBuilder {
    constructor(alexa) {
        this.alexa = alexa;
    }
    launchRequest() {
        this.mainObj['LaunchRequest'] = () => {
            const launchRequestHandler = new LaunchRequestHandler_1.default(this.alexa);
            launchRequestHandler.respond();
        };
        return this;
    }
    findHoursIntent() {
        this.mainObj['FindHoursIntent'] = () => {
            const findHoursHandler = new FindHoursHandler_1.default(this.alexa);
            findHoursHandler.respond();
        };
        return this;
    }
}
exports.default = HandlerBuilder;
//# sourceMappingURL=HandlerBuilder.js.map