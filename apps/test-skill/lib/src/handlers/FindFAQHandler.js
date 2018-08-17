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
const FaqDialogFactory_1 = require("../shared/dialog/FaqDialogFactory");
const AlexaConvoImpl_1 = require("../utils/AlexaConvoImpl");
const DynamoDBUtil_1 = require("../utils/DynamoDBUtil");
const AgentConstants_1 = require("../shared/AgentConstants");
class FindFAQHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const alexaConvo = new AlexaConvoImpl_1.default(this.alexa);
            const data = new DynamoDBUtil_1.default(this.alexa);
            this.user = yield data.findOrInitiate(this.alexaUserId);
            if (this.user.saved) {
                const attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
            }
            let entity = '';
            let response = '';
            if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
                alexaConvo.preDelete();
            }
            if (!(this.alexa.event.request.intent.slots.faqslot).hasOwnProperty('resolutions')) {
                return alexaConvo.ask(FaqDialogFactory_1.default.globalHelpResponse());
            }
            entity = this.alexa.event.request.intent.slots.faqslot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            if (entity) {
                if (entity === 'rewards') {
                    response = FaqDialogFactory_1.default.starRewardsResponseSSML();
                }
                else if (entity === 'returns') {
                    response = FaqDialogFactory_1.default.returnPolicy();
                }
                else {
                    response = FaqDialogFactory_1.default.globalHelpResponse();
                }
            }
            else {
                response = FaqDialogFactory_1.default.globalHelpResponse();
            }
            console.log("FAQINTENT");
            this.alexa.handler.state = 'FAQ';
            alexaConvo.saveToStorage('faqIntent', true);
            response += ' Can I help you with anything else today?';
            alexaConvo.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, response);
            data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
            return alexaConvo.ask(response);
        });
    }
}
exports.default = FindFAQHandler;
//# sourceMappingURL=FindFAQHandler.js.map