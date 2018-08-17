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
class FindEventsDifferentSubHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const alexaConvo = new AlexaConvoImpl_1.default(this.alexa);
            const data = new DynamoDBUtil_1.default(this.alexa);
            let attr = yield data.findAttributes(this.alexaUserId);
            this.alexa.attributes = JSON.parse(attr);
            alexaConvo.alexa.attributes = this.alexa.attributes;
            alexaConvo.alexa.attributes.find_location_event = true;
            alexaConvo.saveToStorage('find_location_event', true);
            alexaConvo.saveToStorage('subIntent', true);
            data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
            alexaConvo.ask('What location are you interested in? Tell me a City and State or a zip code.');
        });
    }
}
exports.default = FindEventsDifferentSubHandler;
//# sourceMappingURL=FindEventsDifferentSubHandler.js.map