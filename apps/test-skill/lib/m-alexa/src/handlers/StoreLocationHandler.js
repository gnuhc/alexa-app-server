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
const MiscUtil_1 = require("../utils/MiscUtil");
const DynamoDBUtil_1 = require("../utils/DynamoDBUtil");
const ConversationHelper_1 = require("../../../shared/utils/ConversationHelper");
const StoreDialogFactory_1 = require("../../../shared/dialog/StoreDialogFactory");
const AlexaConvoImpl_1 = require("../../../shared/agent/AlexaConvoImpl");
class StoreLocationHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = new DynamoDBUtil_1.default(this.alexa);
            var alexaConvo = new AlexaConvoImpl_1.default(this.alexa);
            var attr = '';
            this.user = yield data.findOrInitiate(this.alexaUserId);
            if (this.user.saved) {
                attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                alexaConvo.parameters = JSON.parse(attr);
            }
            const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
            deviceUtil.checkAddressPermission()
                .subscribe(res => {
                if (!res) {
                    ConversationHelper_1.default.askForPermission(this.alexa);
                }
                else {
                    if (!this.user.saved) {
                        MiscUtil_1.default.getStore(deviceUtil, this.alexa)
                            .subscribe(res => {
                            alexaConvo = deviceUtil.checkSlotValue(this.alexa, alexaConvo);
                            alexaConvo.saveToStorage('store_name', res.name);
                            alexaConvo.saveToStorage('store_address', res.address.line1 + ', ' + res.address.city + ', ' +
                                res.address.state + ', ' + res.address.zipCode);
                            alexaConvo.saveToStorage('macysStore', res);
                            this.alexa.handler.state = 'EVENTS_NOT_EXIST';
                            const dialog = StoreDialogFactory_1.default.getMainStoreResponse(alexaConvo, res);
                            const speech = ' Would you like to find another location?';
                            //data.updateUser(this.alexaUserId, this.alexa.attributes, this.user);
                            this.alexa.emit(':ask', dialog + speech);
                        });
                    }
                    else {
                        delete alexaConvo.parameters.weekend;
                        delete alexaConvo.parameters.date;
                        alexaConvo = deviceUtil.checkSlotValue(this.alexa, alexaConvo);
                        this.alexa.handler.state = 'EVENTS_NOT_EXIST';
                        this.alexa.emit(':ask', StoreDialogFactory_1.default.getSavedDialog(alexaConvo) + ' ' +
                            StoreDialogFactory_1.default.getTimeDialogResponseOnly(alexaConvo, this.user.attr.macysStore) + ' ' +
                            StoreDialogFactory_1.default.askLocationQuestion());
                    }
                }
            });
        });
    }
}
exports.default = StoreLocationHandler;
//# sourceMappingURL=StoreLocationHandler.js.map