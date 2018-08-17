"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FindLocationDialogHandler_1 = require("./FindLocationDialogHandler");
const FindLocationSubHandler_1 = require("./FindLocationSubHandler");
const FindStoreHandler_1 = require("./FindStoreHandler");
const FindHoursHandler_1 = require("./FindHoursHandler");
const FindEventsHandler_1 = require("./FindEventsHandler");
const AffirmationsHandler_1 = require("./AffirmationsHandler");
const FindFAQHandler_1 = require("./FindFAQHandler");
const ExitQuestionHandler_1 = require("./ExitQuestionHandler");
const RepeatHandler_1 = require("./RepeatHandler");
const FindEventsMoreHandler_1 = require("./FindEventsMoreHandler");
const FindEventsDifferentSubHandler_1 = require("./FindEventsDifferentSubHandler");
const SessionEndedHandler_1 = require("./SessionEndedHandler");
const FallbackIntentHandler_1 = require("./FallbackIntentHandler");
const UnhandledIntentHandler_1 = require("./UnhandledIntentHandler");
const ForgetHandler_1 = require("./ForgetHandler");
const HelpHandler_1 = require("./HelpHandler");
const YesIntentHandler_1 = require("./YesIntentHandler");
class EventsMainOneExistHandler {
    static handler() {
        return {
            FindLocationIntent() {
                const findLocationSubHandler = new FindLocationSubHandler_1.default(this);
                findLocationSubHandler.respond();
            },
            FindLocationDialogIntent() {
                const findLocationDialogHandler = new FindLocationDialogHandler_1.default(this);
                findLocationDialogHandler.respond();
            },
            FindEventsIntent() {
                const findEventsHandler = new FindEventsHandler_1.default(this);
                findEventsHandler.respond();
                this.handler.state = 'EVENTS_MAIN_EXIST';
            },
            FindEventsMoreIntent() {
                const findEventsMoreHandler = new FindEventsMoreHandler_1.default(this);
                findEventsMoreHandler.respond();
            },
            FindEventsDifferentIntent() {
                const findEventsDifferentSubHandler = new FindEventsDifferentSubHandler_1.default(this);
                findEventsDifferentSubHandler.respond();
            },
            FindHoursIntent() {
                const findHoursHandler = new FindHoursHandler_1.default(this);
                findHoursHandler.respond();
            },
            FindStoreIntent() {
                const findStoreHandler = new FindStoreHandler_1.default(this);
                findStoreHandler.respond();
            },
            FindFAQIntent() {
                const findFAQHandler = new FindFAQHandler_1.default(this);
                findFAQHandler.respond();
            },
            AffirmationsIntent() {
                const affirmationsHandler = new AffirmationsHandler_1.default(this);
                affirmationsHandler.respond();
            },
            ExitQuestionIntent() {
                const exitQuestionHandler = new ExitQuestionHandler_1.default(this);
                exitQuestionHandler.respond();
                this.handler.state = 'EXIT';
            },
            RepeatingIntent() {
                const repeatHandler = new RepeatHandler_1.default(this);
                repeatHandler.respond();
            },
            ForgetIntent() {
                const forgetHandler = new ForgetHandler_1.default(this);
                forgetHandler.respond();
            },
            'AMAZON.NoIntent': function () {
                this.emitWithState('ExitQuestionIntent');
            },
            'AMAZON.YesIntent': function () {
                const yesIntentHandler = new YesIntentHandler_1.default(this);
                yesIntentHandler.respond();
            },
            'AMAZON.CancelIntent': function () {
                this.emitWithState('ExitQuestionIntent');
                this.handler.state = 'EXIT';
            },
            'AMAZON.HelpIntent': function () {
                const helpHandler = new HelpHandler_1.default(this);
                helpHandler.respond();
            },
            'AMAZON.StopIntent': function () {
                this.emitWithState('ExitQuestionIntent');
                this.handler.state = 'EXIT';
            },
            'AMAZON.FallbackIntent': function () {
                const fallbackIntentHandler = new FallbackIntentHandler_1.default(this);
                fallbackIntentHandler.respond();
            },
            'Unhandled': function () {
                const unhandledIntentHandler = new UnhandledIntentHandler_1.default(this);
                unhandledIntentHandler.respond();
            },
            SessionEndedRequest() {
                const sessionEndedHandler = new SessionEndedHandler_1.default(this);
                sessionEndedHandler.respond();
            },
        };
    }
}
exports.default = EventsMainOneExistHandler;
//# sourceMappingURL=EventsMainOneExistHandler.js.map