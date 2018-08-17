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
const AgentHelpFactory_1 = require("../../../shared/dialog/AgentHelpFactory");
const ExitQuestionHandler_1 = require("./ExitQuestionHandler");
const HelpHandler_1 = require("./HelpHandler");
const FallbackIntentHandler_1 = require("./FallbackIntentHandler");
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
            ExitQuestionIntent() {
                const exitQuestionHandler = new ExitQuestionHandler_1.default(this);
                exitQuestionHandler.respond();
                this.handler.state = 'EXIT';
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
            'AMAZON.HelpIntent': function () {
                const helpHandler = new HelpHandler_1.default(this);
                helpHandler.respond();
            },
            'AMAZON.CancelIntent': function () {
                this.emit(':tell', AgentHelpFactory_1.default.getBye());
            },
            'AMAZON.StopIntent': function () {
                const exitQuestionHandler = new ExitQuestionHandler_1.default(this);
                exitQuestionHandler.respond();
                this.handler.state = 'EXIT';
            },
            'AMAZON.FallbackIntent': function () {
                const fallbackIntentHandler = new FallbackIntentHandler_1.default(this);
                fallbackIntentHandler.respond();
            },
            'Unhandled': function () {
                this.emit(':ask', AgentHelpFactory_1.default.getSorry(), AgentHelpFactory_1.default.getSorry());
            },
            SessionEndedRequest() {
                this.emit(':tell', AgentHelpFactory_1.default.getBye());
            },
        };
    }
}
exports.default = FAQQuestionHandler;
//# sourceMappingURL=FAQQuestionHandler.js.map