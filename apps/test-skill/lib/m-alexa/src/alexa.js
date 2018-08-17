"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const resources_1 = require("./etc/resources");
const LaunchHandler_1 = require("./handlers/LaunchHandler");
const EventsExistHandler_1 = require("./handlers/EventsExistHandler");
const EventsNotExistHandler_1 = require("./handlers/EventsNotExistHandler");
const EventsMainExistHandler_1 = require("./handlers/EventsMainExistHandler");
const EventsMainOneExistHandler_1 = require("./handlers/EventsMainOneExistHandler");
const EventsMainNotExistHandler_1 = require("./handlers/EventsMainNotExistHandler");
const FAQQuestionHandler_1 = require("./handlers/FAQQuestionHandler");
const ExitHandler_1 = require("./handlers/ExitHandler");
exports.handler = ((event, context, callback) => {
    const alexa = Alexa.handler(event, context); // TODO: Handle exceptions.
    alexa.appId = process.env.alexa_app_id;
    alexa.resources = resources_1.default;
    alexa.registerHandlers(LaunchHandler_1.default.handler(), Alexa.CreateStateHandler('EVENTS_NOT_EXIST', (EventsNotExistHandler_1.default.handler())), Alexa.CreateStateHandler('EVENTS_EXIST', (EventsExistHandler_1.default.handler())), Alexa.CreateStateHandler('EVENTS_MAIN_EXIST', (EventsMainExistHandler_1.default.handler())), Alexa.CreateStateHandler('EVENTS_MAIN_ONE_EXIST', (EventsMainOneExistHandler_1.default.handler())), Alexa.CreateStateHandler('EVENTS_MAIN_NOT_EXIST', (EventsMainNotExistHandler_1.default.handler())), Alexa.CreateStateHandler('FAQ', (FAQQuestionHandler_1.default.handler())), Alexa.CreateStateHandler('EXIT', (ExitHandler_1.default.handler())));
    alexa.execute();
});
//# sourceMappingURL=alexa.js.map