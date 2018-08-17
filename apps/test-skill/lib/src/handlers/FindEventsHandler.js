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
const StoreUtil_1 = require("../shared/utils/StoreUtil");
const AgentConstants_1 = require("../shared/AgentConstants");
class FindEventsHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const alexaConvo = new AlexaConvoImpl_1.default(this.alexa);
            const data = new DynamoDBUtil_1.default(this.alexa);
            const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
            this.user = yield data.findOrInitiate(this.alexaUserId);
            if (this.user.saved) {
                const attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
            }
            delete alexaConvo.alexa.attributes.address;
            console.log("IN EVENTS");
            if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
                alexaConvo.preDelete();
            }
            alexaConvo.saveToStorage('context', 'EVENTS_MAIN_EXIST');
            alexaConvo.saveToStorage('eventsIntent', true);
            alexaConvo.saveToStorage('hoursIntent', false);
            alexaConvo.saveToStorage('storeIntent', false);
            alexaConvo.saveToStorage('nearStoreIntent', false);
            alexaConvo.saveToStorage('find_location_event', false);
            alexaConvo.saveToStorage('subIntent', false);
            deviceUtil.checkAddressPermission()
                .subscribe(res => {
                if (!res) {
                    alexaConvo.askForPermission();
                }
                else {
                    if (!alexaConvo.getStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY)) {
                        console.log("EVENTS HAS MOST RECENT");
                        deviceUtil.getLatLng(alexaConvo)
                            .subscribe(res => {
                            StoreUtil_1.default.launchEventConvo(alexaConvo, false, (finalResponse) => {
                                this.alexa.handler.state = alexaConvo.getStorage('context');
                                alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                                alexaConvo.deleteFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
                                alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, finalResponse);
                                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                                this.alexa.attributes = alexaConvo.alexa.attributes;
                            });
                        });
                    }
                    else {
                        console.log("EVENTS DOES NOT HAVE MOST RECENT");
                        StoreUtil_1.default.launchEventConvo(alexaConvo, false, (finalResponse) => {
                            this.alexa.handler.state = alexaConvo.getStorage('context');
                            alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                            alexaConvo.deleteFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
                            alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, finalResponse);
                            data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                            this.alexa.attributes = alexaConvo.alexa.attributes;
                        });
                    }
                }
            });
        });
    }
}
exports.default = FindEventsHandler;
//# sourceMappingURL=FindEventsHandler.js.map