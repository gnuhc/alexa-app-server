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
const AlexaDeviceUtil_1 = require("../utils/AlexaDeviceUtil");
const DynamoDBUtil_1 = require("../utils/DynamoDBUtil");
const AlexaConvoImpl_1 = require("../utils/AlexaConvoImpl");
const StoreUtil_1 = require("../../../shared/utils/StoreUtil");
const AgentConstants_1 = require("../../../shared/AgentConstants");
const ConvoResponse_1 = require("../../../shared/agent/ConvoResponse");
class FindHoursHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const alexaConvo = new AlexaConvoImpl_1.default(this.alexa, this.alexaUserId, this.event);
            const data = new DynamoDBUtil_1.default(this.alexa);
            const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
            let convoResponse = new ConvoResponse_1.default('', true, true);
            this.user = yield data.findOrInitiate(this.alexaUserId);
            if (this.user.saved) {
                const attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
            }
            if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
                alexaConvo.preDelete();
            }
            alexaConvo.saveToStorage('eventsIntent', false);
            alexaConvo.saveToStorage('nearStoreIntent', false);
            alexaConvo.saveToStorage('find_location_event', false);
            alexaConvo.saveToStorage('subIntent', false);
            alexaConvo.saveToStorage('hoursIntent', true);
            alexaConvo.saveToStorage('storeIntent', true);
            alexaConvo.saveToStorage('fallbackCount', 0);
            const permission = yield deviceUtil.checkAddressPermission();
            if (!permission) {
                alexaConvo.hasPermission();
            }
            else {
                alexaConvo.saveToStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY, this.checkAddressSlots(alexaConvo));
                if (alexaConvo.getStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY)) {
                    yield deviceUtil.getLatLng(alexaConvo);
                    console.log("IN MOST RECENT STORE");
                    console.log("USER COORD EXIST IN STORE IF1: " + JSON.stringify(alexaConvo.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES)));
                    alexaConvo.saveToStorage('storeIntent', true);
                    alexaConvo.saveToStorage('hoursIntent', true);
                    convoResponse = yield StoreUtil_1.default.launchStoreConvo(alexaConvo, (finalResponse) => {
                        alexaConvo.removeFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
                        this.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, finalResponse);
                        data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                    });
                }
                else if (alexaConvo.getStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY)) {
                    console.log("IN SAVED STORE");
                    console.log("USER COORD EXIST IN STORE IF2: " + JSON.stringify(alexaConvo.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES)));
                    alexaConvo.saveToStorage('storeIntent', true);
                    alexaConvo.saveToStorage('hoursIntent', true);
                    convoResponse = yield StoreUtil_1.default.launchStoreConvo(alexaConvo, (finalResponse) => {
                        alexaConvo.removeFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
                        this.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, finalResponse);
                        data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                    });
                }
                else {
                    yield deviceUtil.getLatLng(alexaConvo);
                    console.log("USER COORD EXIST IN STORE IF3: " + JSON.stringify(alexaConvo.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES)));
                    alexaConvo.saveToStorage('storeIntent', true);
                    alexaConvo.saveToStorage('hoursIntent', true);
                    convoResponse = yield StoreUtil_1.default.launchStoreConvo(alexaConvo, (finalResponse) => {
                        alexaConvo.removeFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
                        this.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, finalResponse);
                        data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                    });
                }
                if (convoResponse.isAsk) {
                    alexaConvo.ask(convoResponse.finalString);
                }
                else {
                    alexaConvo.close(convoResponse.finalString);
                }
                // send out analytics or any destroy configs
                yield alexaConvo.onStop();
            }
        });
    }
    checkAddressSlots(conv) {
        let string = '';
        let count = 0;
        if (conv.getEntity('city')) {
            string += conv.getEntity('city');
        }
        if (conv.getEntity('state')) {
            string += conv.getEntity('state');
        }
        if (conv.getZipEntity('zipcode')) {
            string += conv.getZipEntity('zipcode');
        }
        return string;
    }
}
exports.default = FindHoursHandler;
//# sourceMappingURL=FindHoursHandler.js.map