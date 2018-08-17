"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FindStoreHandler_1 = require("./FindStoreHandler");
const FindHoursHandler_1 = require("./FindHoursHandler");
const FindEventsHandler_1 = require("./FindEventsHandler");
const AffirmationsHandler_1 = require("./AffirmationsHandler");
const FindFAQHandler_1 = require("./FindFAQHandler");
const LaunchRequestHandler_1 = require("./LaunchRequestHandler");
const RepeatHandler_1 = require("./RepeatHandler");
const SessionEndedHandler_1 = require("./SessionEndedHandler");
const ForgetHandler_1 = require("./ForgetHandler");
const HelpHandler_1 = require("./HelpHandler");
class LaunchHandler {
    static handler() {
        const amazonObj = LaunchHandler.getAmazonDefaultIntents();
        return Object.assign({ LaunchRequest() {
                const launchRequestHandler = new LaunchRequestHandler_1.default(this);
                launchRequestHandler.respond();
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
            RepeatingIntent() {
                const repeatHandler = new RepeatHandler_1.default(this);
                repeatHandler.respond();
            },
            ForgetIntent() {
                const forgetHandler = new ForgetHandler_1.default(this);
                forgetHandler.respond();
            }, 'Unhandled': function () {
                this.emit(':ask', 'Sorry, I didn’t get that. I can repeat what we were just chatting about, or give you our help menu. Say “repeat”, or “help”.');
            }, SessionEndedRequest() {
                const sessionEndedHandler = new SessionEndedHandler_1.default(this);
                sessionEndedHandler.respond();
            } }, amazonObj);
    }
    static getAmazonDefaultIntents() {
        return {
            'AMAZON.NoIntent': function () {
                this.emit(':ask', 'Sorry, I didn’t get that. I can repeat what we were just chatting about, or give you our help menu. Say “repeat”, or “help”.');
            },
            'AMAZON.YesIntent': function () {
                this.emit(':ask', 'Sorry, I didn’t get that. I can repeat what we were just chatting about, or give you our help menu. Say “repeat”, or “help”.');
            },
            'AMAZON.CancelIntent': function () {
                this.emit(':tell', this.t('OK, BYE'));
            },
            'AMAZON.HelpIntent': function () {
                const helpHandler = new HelpHandler_1.default(this);
                helpHandler.respond();
            },
            'AMAZON.StopIntent': function () {
                this.emit(':tell', this.t('OK, BYE'));
            },
            'AMAZON.FallbackIntent': function () {
                this.emit(':ask', 'Sorry, I didn’t get that. I can repeat what we were just chatting about, or give you our help menu. Say “repeat”, or “help”.');
            }
        };
    }
}
exports.default = LaunchHandler;
//# sourceMappingURL=LaunchHandler.js.map