"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NoIntentHandler_1 = require("./NoIntentHandler");
const YesIntentHandler_1 = require("./YesIntentHandler");
const RepeatHandler_1 = require("./RepeatHandler");
const FindStoreHandler_1 = require("./FindStoreHandler");
const FindHoursHandler_1 = require("./FindHoursHandler");
const FindEventsHandler_1 = require("./FindEventsHandler");
const AffirmationsHandler_1 = require("./AffirmationsHandler");
const FindFAQHandler_1 = require("./FindFAQHandler");
const ForgetHandler_1 = require("./ForgetHandler");
class FAQQuestionHandler {
    static handler() {
        return {
            RepeatingIntent() {
                const repeatHandler = new RepeatHandler_1.default(this);
                repeatHandler.respond();
            },
            ForgetIntent() {
                const forgetHandler = new ForgetHandler_1.default(this);
                forgetHandler.respond();
            },
            FindHoursIntent() {
                const findHoursHandler = new FindHoursHandler_1.default(this);
                findHoursHandler.respond();
            },
            FindStoreIntent() {
                const findStoreHandler = new FindStoreHandler_1.default(this);
                findStoreHandler.respond();
            },
            FindEventsIntent() {
                const findEventsHandler = new FindEventsHandler_1.default(this);
                findEventsHandler.respond();
                this.handler.state = 'EVENTS_MAIN_EXIST';
            },
            FindFAQIntent() {
                const findFAQHandler = new FindFAQHandler_1.default(this);
                findFAQHandler.respond();
            },
            AffirmationsIntent() {
                const affirmationsHandler = new AffirmationsHandler_1.default(this);
                affirmationsHandler.respond();
            },
            'AMAZON.NoIntent': function () {
                const noIntentHandler = new NoIntentHandler_1.default(this);
                noIntentHandler.respond();
                this.handler.state = '';
            },
            'AMAZON.YesIntent': function () {
                const yesIntentHandler = new YesIntentHandler_1.default(this);
                yesIntentHandler.respond();
                this.handler.state = '';
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
exports.default = FAQQuestionHandler;
//# sourceMappingURL=FAQQuestionHandler.js.map