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
const StoreUtil_1 = require("../../../shared/utils/StoreUtil");
const DynamoDBUtil_1 = require("../utils/DynamoDBUtil");
const AlexaConvoImpl_1 = require("../utils/AlexaConvoImpl");
const AgentConstants_1 = require("../../../shared/AgentConstants");
const ConvoResponse_1 = require("../../../shared/agent/ConvoResponse");
class FindLocationDialogHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const alexaConvo = new AlexaConvoImpl_1.default(this.alexa, this.alexaUserId, this.event);
            const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
            const data = new DynamoDBUtil_1.default(this.alexa);
            let convoResponse = new ConvoResponse_1.default('', true, true);
            this.user = yield data.findOrInitiate(this.alexaUserId);
            if (this.user.saved) {
                const attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
            }
            let str = this.checkAddressSlots(alexaConvo);
            if (str === 'fallback' || str === '') {
                this.alexa.emitWithState('AMAZON.FallbackIntent');
            }
            else {
                alexaConvo.saveToStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY, str);
                alexaConvo.saveToStorage('nearStoreIntent', false);
                alexaConvo.saveToStorage('subIntent', false);
                alexaConvo.saveToStorage('hoursIntent', false);
                alexaConvo.saveToStorage('fallbackCount', 0);
                if (alexaConvo.getStorage('find_location_event') ||
                    this.alexa.handler.state === 'EVENTS_MAIN_ONE_EXIST' ||
                    this.alexa.handler.state === 'EVENTS_MAIN_NOT_EXIST' ||
                    this.alexa.handler.state === 'EVENTS_MAIN_EXIST') {
                    alexaConvo.saveToStorage('eventsIntent', true);
                    convoResponse = yield StoreUtil_1.default.launchEventConvo(alexaConvo, false, (finalResponse) => {
                        this.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.saveToStorage('find_location_event', false);
                        alexaConvo.alexa.attributes.state = alexaConvo.getStorage('context');
                        alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.removeFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
                        alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, finalResponse);
                        data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                    });
                }
                else {
                    convoResponse = yield StoreUtil_1.default.launchStoreConvo(alexaConvo, (finalResponse) => {
                        this.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.alexa.attributes.state = alexaConvo.getStorage('context');
                        alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.removeFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
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
        let zip = 0;
        if (conv.getEntity('city')) {
            string += conv.getEntity('city');
            count++;
        }
        if (conv.getEntity('state')) {
            string += conv.getEntity('state');
            count++;
        }
        if (conv.getZipEntity('zipcode')) {
            if (conv.getZipEntity('zipcode').length < 5 ||
                conv.getZipEntity('zipcode').length > 5) {
                return 'fallback';
            }
            string += conv.getZipEntity('zipcode');
            zip = 1;
        }
        if (count < 2 && zip === 0) {
            return 'fallback';
        }
        return string;
    }
}
exports.default = FindLocationDialogHandler;
//# sourceMappingURL=FindLocationDialogHandler.js.map