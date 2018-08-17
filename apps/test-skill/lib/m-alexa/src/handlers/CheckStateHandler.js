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
const AlexaConvoImpl_1 = require("../utils/AlexaConvoImpl");
const DynamoDBUtil_1 = require("../utils/DynamoDBUtil");
class CheckStateHandler extends HandlerBase_1.default {
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
            if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
                alexaConvo.preDelete();
            }
            console.log("STATE OUTSIDE CHECKSTATE: " + JSON.stringify(alexaConvo.getStorage('state')));
            if (alexaConvo.getStorage('state') == 'EVENTS_MAIN_NOT_EXIST') {
                console.log("STATE IN CHECKSTATE: " + JSON.stringify(alexaConvo.getStorage('state')));
                this.alexa.handler.state = 'EVENTS_MAIN_NOT_EXIST';
                return this.alexa.handler.state;
            }
        });
    }
}
exports.default = CheckStateHandler;
//# sourceMappingURL=CheckStateHandler.js.map