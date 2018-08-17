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
const StoreUtil_1 = require("../shared/utils/StoreUtil");
const DynamoDBUtil_1 = require("../utils/DynamoDBUtil");
const AlexaConvoImpl_1 = require("../utils/AlexaConvoImpl");
const AgentConstants_1 = require("../shared/AgentConstants");
class FindLocationDialogHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const alexaConvo = new AlexaConvoImpl_1.default(this.alexa);
            const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
            const data = new DynamoDBUtil_1.default(this.alexa);
            this.user = yield data.findOrInitiate(this.alexaUserId);
            if (this.user.saved) {
                const attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
            }
            console.log("ADDRESS SLOTS: " + JSON.stringify(this.checkAddressSlots(alexaConvo)));
            alexaConvo.saveToStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY, this.checkAddressSlots(alexaConvo));
            alexaConvo.saveToStorage('nearStoreIntent', false);
            alexaConvo.saveToStorage('subIntent', false);
            alexaConvo.saveToStorage('hoursIntent', false);
            if (alexaConvo.getStorage('find_location_event') ||
                this.alexa.handler.state === 'EVENTS_MAIN_ONE_EXIST' ||
                this.alexa.handler.state === 'EVENTS_MAIN_NOT_EXIST') {
                alexaConvo.saveToStorage('eventsIntent', true);
                StoreUtil_1.default.launchEventConvo(alexaConvo, true, () => {
                    this.alexa.handler.state = alexaConvo.getStorage('context');
                    alexaConvo.saveToStorage('find_location_event', false);
                    alexaConvo.alexa.attributes.state = alexaConvo.getStorage('context');
                    alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                    alexaConvo.deleteFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
                    data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                });
            }
            else {
                StoreUtil_1.default.launchStoreConvo(alexaConvo, () => {
                    this.alexa.handler.state = alexaConvo.getStorage('context');
                    alexaConvo.alexa.attributes.state = alexaConvo.getStorage('context');
                    alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                    alexaConvo.deleteFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
                    data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                });
            }
        });
    }
    checkAddressSlots(conv) {
        let string = '';
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
exports.default = FindLocationDialogHandler;
//# sourceMappingURL=FindLocationDialogHandler.js.map