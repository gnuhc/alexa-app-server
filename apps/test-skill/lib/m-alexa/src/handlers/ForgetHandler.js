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
const AlexaConvoImpl_1 = require("../utils/AlexaConvoImpl");
const ForgetDialogFactory_1 = require("../../../shared/dialog/ForgetDialogFactory");
const AgentConstants_1 = require("../../../shared/AgentConstants");
class ForgetHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            let alexaConvo = new AlexaConvoImpl_1.default(this.alexa, this.alexaUserId, this.event);
            const data = new DynamoDBUtil_1.default(this.alexa);
            this.user = yield data.findOrInitiate(this.alexaUserId);
            if (this.user.saved) {
                const attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
            }
            alexaConvo.saveToStorage('fallbackCount', 0);
            if (alexaConvo.getStorage('saved_store')) {
                this.alexa.handler.state = 'EVENTS_EXIST';
                alexaConvo.removeFromStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY);
                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                this.alexa.emit(':ask', ForgetDialogFactory_1.default.askForget(), ForgetDialogFactory_1.default.askForget());
            }
            else {
                this.alexa.handler.state = 'EVENTS_EXIST';
                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                this.alexa.emit(':ask', ForgetDialogFactory_1.default.askNotForget(), ForgetDialogFactory_1.default.askNotForget());
            }
        });
    }
}
exports.default = ForgetHandler;
//# sourceMappingURL=ForgetHandler.js.map