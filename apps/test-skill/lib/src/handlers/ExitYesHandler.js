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
const AgentConstants_1 = require("../shared/AgentConstants");
const ExitDialogFactory_1 = require("../shared/dialog/ExitDialogFactory");
class ExitYesHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            let alexaConvo = new AlexaConvoImpl_1.default(this.alexa);
            const data = new DynamoDBUtil_1.default(this.alexa);
            let attr = yield data.findAttributes(this.alexaUserId);
            this.alexa.attributes = JSON.parse(attr);
            alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY, alexaConvo.getStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY));
            alexaConvo.deleteFromStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY);
            alexaConvo.deleteFromStorage(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
            alexaConvo.deleteFromStorage('nearStoreIntent');
            alexaConvo.deleteFromStorage('storeIntent');
            alexaConvo.deleteFromStorage('eventsIntent');
            alexaConvo.deleteFromStorage('hoursIntent');
            alexaConvo.deleteFromStorage(AgentConstants_1.default.STORAGE_EVENT_INDEX_KEY);
            alexaConvo.deleteFromStorage(AgentConstants_1.default.STORAGE_EVENTS_LEFT_KEY);
            alexaConvo.deleteFromStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY);
            data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
            this.alexa.emit(':tell', ExitDialogFactory_1.default.sayGoodByeSaved());
        });
    }
}
exports.default = ExitYesHandler;
//# sourceMappingURL=ExitYesHandler.js.map