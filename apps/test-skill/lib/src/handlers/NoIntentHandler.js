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
class NoIntentHandler extends HandlerBase_1.default {
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
                let attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
            }
            if (alexaConvo.alexa.attributes.faqIntent) {
                this.alexa.handler.state == '';
                alexaConvo.deleteFromStorage('faqIntent');
                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                this.alexa.emit(':tell', 'Okay, talk to you soon!');
            }
            else if (this.alexa.handler.state == 'EVENTS_MAIN_NOT_EXIST') {
                this.alexa.handler.state == 'EXIT';
                this.alexa.emitWithState('ExitQuestionIntent');
            }
            else if (this.alexa.handler.state == 'EVENTS_MAIN_ONE_EXIST') {
                this.alexa.handler.state == 'EXIT';
                this.alexa.emitWithState('ExitQuestionIntent');
            }
            else {
                this.alexa.emit(':ask', 'You can say more to hear more about this event or say next to hear about the next event or ask for a different location or say stop to exit');
            }
        });
    }
}
exports.default = NoIntentHandler;
//# sourceMappingURL=NoIntentHandler.js.map