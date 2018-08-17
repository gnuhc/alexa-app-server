"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExitYesHandler_1 = require("./ExitYesHandler");
const ExitNoHandler_1 = require("./ExitNoHandler");
const AgentHelpFactory_1 = require("../../../shared/dialog/AgentHelpFactory");
const FallbackIntentHandler_1 = require("./FallbackIntentHandler");
class ExitHandler {
    static handler() {
        return {
            RepeatingIntent() {
                if (this.attributes.repeat || this.attributes.repeat != '') {
                    this.emit(':ask', this.attributes.repeat);
                }
                else {
                    this.emit(':ask', AgentHelpFactory_1.default.getNoRepeat(), AgentHelpFactory_1.default.getNoRepeat());
                }
            },
            'AMAZON.NoIntent': function () {
                const exitNoHandler = new ExitNoHandler_1.default(this);
                exitNoHandler.respond();
            },
            'AMAZON.YesIntent': function () {
                const exitYesHandler = new ExitYesHandler_1.default(this);
                exitYesHandler.respond();
            },
            'AMAZON.CancelIntent': function () {
                console.log("EXIT CANCEL");
                this.emit(':tell', AgentHelpFactory_1.default.getBye());
            },
            'AMAZON.StopIntent': function () {
                console.log("EXIT STOP");
                this.emit(':tell', AgentHelpFactory_1.default.getBye());
            },
            'AMAZON.FallbackIntent': function () {
                console.log("EXIT FALLBACK");
                const fallbackIntentHandler = new FallbackIntentHandler_1.default(this);
                fallbackIntentHandler.respond();
            },
            'Unhandled': function () {
                this.emit(':ask', AgentHelpFactory_1.default.getSorry(), AgentHelpFactory_1.default.getSorry());
            },
            SessionEndedRequest() {
                console.log("SESSION ENDED");
                this.emit(':tell', AgentHelpFactory_1.default.getBye());
            },
        };
    }
}
exports.default = ExitHandler;
//# sourceMappingURL=ExitHandler.js.map