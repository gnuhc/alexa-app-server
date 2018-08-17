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
class FindHoursHandler extends HandlerBase_1.default {
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
            if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
                alexaConvo.preDelete();
            }
            alexaConvo.saveToStorage('eventsIntent', false);
            alexaConvo.saveToStorage('nearStoreIntent', false);
            alexaConvo.saveToStorage('find_location_event', false);
            alexaConvo.saveToStorage('subIntent', false);
            alexaConvo.saveToStorage('hoursIntent', true);
            alexaConvo.saveToStorage('storeIntent', true);
            deviceUtil.checkAddressPermission()
                .subscribe(res => {
                if (!res) {
                    alexaConvo.askForPermission();
                }
                else {
                    if (!alexaConvo.getStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY)) {
                        deviceUtil.getLatLng(alexaConvo)
                            .subscribe(res => {
                            alexaConvo.saveToStorage('storeIntent', true);
                            alexaConvo.saveToStorage('hoursIntent', true);
                            StoreUtil_1.default.launchStoreConvo(alexaConvo, (finalResponse) => {
                                this.alexa.handler.state = alexaConvo.getStorage('context');
                                alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, finalResponse);
                                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                            });
                        });
                    }
                    else {
                        alexaConvo.saveToStorage('storeIntent', true);
                        alexaConvo.saveToStorage('hoursIntent', true);
                        StoreUtil_1.default.launchStoreConvo(alexaConvo, (finalResponse) => {
                            this.alexa.handler.state = alexaConvo.getStorage('context');
                            alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, finalResponse);
                            data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                        });
                    }
                }
            });
        });
    }
}
exports.default = FindHoursHandler;
//# sourceMappingURL=FindHoursHandler.js.map