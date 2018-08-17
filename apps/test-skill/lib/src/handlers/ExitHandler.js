"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExitYesHandler_1 = require("./ExitYesHandler");
const ExitNoHandler_1 = require("./ExitNoHandler");
class ExitHandler {
    static handler() {
        return {
            RepeatingIntent() {
                if (this.attributes.repeat || this.attributes.repeat != '') {
                    this.emit(':ask', this.attributes.repeat);
                }
                else {
                    this.emit(':ask', this.t('Sorry, there is nothing to repeat'));
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
                this.emit(':tell', this.t('GOODBYE'));
            },
            'AMAZON.StopIntent': function () {
                this.emit(':tell', this.t('GOODBYE'));
            },
            'AMAZON.FallbackIntent': function () {
                this.emit(':ask', this.t('Sorry I didn\'t get that'));
            },
            'Unhandled': function () {
                this.emit(':ask', 'Sorry I didn\'t get that');
            },
            SessionEndedRequest() {
                this.emit(':tell', this.t('GOODBYE'));
            },
        };
    }
}
exports.default = ExitHandler;
//# sourceMappingURL=ExitHandler.js.map