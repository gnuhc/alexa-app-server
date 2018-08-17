"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const HandlerBase_1 = require("./HandlerBase");
const DynamoDBUtil_1 = require("../utils/DynamoDBUtil");
const AgentConstants_1 = require("../../../shared/AgentConstants");
class SessionEndedHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = new DynamoDBUtil_1.default(this.alexa);
            let attr = yield data.findAttributes(this.alexaUserId);
            if (!!this.alexa.attributes) {
                this.alexa.attributes = JSON.parse(attr);
                if (this.alexa.attributes.hasOwnProperty(AgentConstants_1.default.ENTITY_ADDRESS_KEY)) {
                    delete this.alexa.attributes.address;
                }
                if (this.alexa.attributes.hasOwnProperty('most_recent_store')) {
                    delete this.alexa.attributes.most_recent_store;
                }
                if (this.alexa.attributes.hasOwnProperty('nearStoreIntent')) {
                    delete this.alexa.attributes.nearStoreIntent;
                }
                if (this.alexa.attributes.hasOwnProperty('storeIntent')) {
                    delete this.alexa.attributes.storeIntent;
                }
                if (this.alexa.attributes.hasOwnProperty('hoursIntent')) {
                    delete this.alexa.attributes.hoursIntent;
                }
                if (this.alexa.attributes.hasOwnProperty('eventsIntent')) {
                    delete this.alexa.attributes.eventsIntent;
                }
                if (this.alexa.attributes.hasOwnProperty('find_location_event')) {
                    delete this.alexa.attributes.find_location_event;
                }
                if (this.alexa.attributes.hasOwnProperty('subIntent')) {
                    delete this.alexa.attributes.subIntent;
                }
                if (this.alexa.attributes.hasOwnProperty('fallbackCount')) {
                    delete this.alexa.attributes.fallbackCount;
                }
                if (this.alexa.attributes.hasOwnProperty(AgentConstants_1.default.STORAGE_REPEAT_KEY)) {
                    delete this.alexa.attributes.repeat;
                }
                if (this.alexa.attributes.hasOwnProperty(AgentConstants_1.default.STORAGE_EVENT_INDEX_KEY)) {
                    delete this.alexa.attributes.event_index;
                }
                if (this.alexa.attributes.hasOwnProperty(AgentConstants_1.default.STORAGE_EVENTS_LEFT_KEY)) {
                    delete this.alexa.attributes.events_left;
                }
                data.updateUser(this.alexaUserId, this.alexa.attributes, this.user);
            }
            this.alexa.handler.state = '';
        });
    }
}
exports.default = SessionEndedHandler;
//# sourceMappingURL=SessionEndedHandler.js.map