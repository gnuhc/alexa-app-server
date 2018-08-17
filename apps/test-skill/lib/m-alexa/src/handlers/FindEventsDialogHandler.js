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
class FindEventsDialogHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const alexaConvo = new AlexaConvoImpl_1.default(this.alexa, this.alexaUserId, this.event);
            const data = new DynamoDBUtil_1.default(this.alexa);
            const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
            this.user = yield data.findOrInitiate(this.alexaUserId);
            if (this.user.saved) {
                const attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
            }
            alexaConvo.saveToStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY, this.checkAddressSlots(alexaConvo));
            alexaConvo.saveToStorage('eventsIntent', true);
            StoreUtil_1.default.launchEventConvo(alexaConvo, false, () => {
                this.alexa.handler.state = alexaConvo.getStorage('context');
                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
            });
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
        if (conv.getEntity('zipcode')) {
            string += conv.getEntity('zipcode');
        }
        return string;
    }
}
exports.default = FindEventsDialogHandler;
//# sourceMappingURL=FindEventsDialogHandler.js.map