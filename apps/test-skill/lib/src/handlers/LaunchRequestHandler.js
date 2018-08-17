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
const AgentIntroFactory_1 = require("../shared/dialog/AgentIntroFactory");
class LaunchRequestHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        return __awaiter(this, void 0, void 0, function* () {
            const alexaConvo = new AlexaConvoImpl_1.default(this.alexa);
            const data = new DynamoDBUtil_1.default(this.alexa);
            const found = yield data.find(this.event.context.System.user.userId);
            if (found) {
                const attr = yield data.findAttributes(this.alexaUserId);
                this.alexa.attributes = JSON.parse(attr);
                alexaConvo.alexa.attributes = this.alexa.attributes;
                alexaConvo.preDelete();
            }
            alexaConvo.ask(AgentIntroFactory_1.default.getIntro(alexaConvo, found));
        });
    }
}
exports.default = LaunchRequestHandler;
//# sourceMappingURL=LaunchRequestHandler.js.map