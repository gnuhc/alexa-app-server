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
class FallbackIntentHandler extends HandlerBase_1.default {
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
                let attr = yield data.findAttributes(this.alexaUserId);
                this.user.attr = JSON.parse(attr);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
            }
            alexaConvo.saveToStorage('fallbackCount', alexaConvo.getStorage('fallbackCount') + 1);
            if (alexaConvo.getStorage('fallbackCount') === 3) {
                //alexaConvo.saveToStorage('fallbackCount', alexaConvo.getStorage('fallbackCount') + 1);
                this.alexa.emit(':ask', 'I don’t understand your question, but I’d like to. How about trying the help menu? Just say, “help”. ');
            }
            else if (alexaConvo.getStorage('fallbackCount') === 4) {
                alexaConvo.saveToStorage('fallbackCount', 0);
                this.alexa.emit(':tell', '');
            }
            else {
                //alexaConvo.saveToStorage('fallbackCount', alexaConvo.getStorage('fallbackCount') + 1);
                if (alexaConvo.getStorage('subIntent')) {
                    this.alexa.emit(':ask', 'Sorry, I didn’t catch that. To find a store, I need to hear both a city and a state, or a valid 5-digit zip code. ');
                }
                else {
                    this.alexa.emit(':ask', 'Sorry, I didn’t get that. I can repeat what we were just chatting about, or give you our help menu. Say “repeat”, or “help”.');
                }
            }
            // if (alexaConvo.getStorage('subIntent')) {
            //   this.alexa.emit(':ask', FallbackDialogFactory.sayAddressStop(), FallbackDialogFactory.sayAddressStop());     
            // } else if (this.alexa.handler.state == 'EVENTS_EXIST') {
            //   this.alexa.emit(':ask', FallbackDialogFactory.sayEventsLocationExit(), FallbackDialogFactory.sayEventsLocationExit());
            // } else if (this.alexa.handler.state == 'EVENTS_NOT_EXIST') {
            //   this.alexa.emit(':ask', FallbackDialogFactory.sayLocationStop(), FallbackDialogFactory.sayLocationStop());
            // } else if (this.alexa.handler.state == 'EVENTS_MAIN_EXIST') {
            //   this.alexa.emit(':ask', FallbackDialogFactory.sayMoreNextDifferentStop(), FallbackDialogFactory.sayMoreNextDifferentStop());
            // } else if (this.alexa.handler.state == 'EVENTS_MAIN_ONE_EXIST') {
            //   this.alexa.emit(':ask', FallbackDialogFactory.sayMoreDifferentStop(), FallbackDialogFactory.sayMoreDifferentStop());      
            // } else if (this.alexa.handler.state == 'EVENTS_MAIN_NOT_EXIST') {
            //   this.alexa.emit(':ask', FallbackDialogFactory.sayDifferentStop(), FallbackDialogFactory.sayDifferentStop());
            // }
            data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
        });
    }
}
exports.default = FallbackIntentHandler;
//# sourceMappingURL=FallbackIntentHandler.js.map