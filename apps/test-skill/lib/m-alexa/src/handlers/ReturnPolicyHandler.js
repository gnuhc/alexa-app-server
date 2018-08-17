"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HandlerBase_1 = require("./HandlerBase");
const FaqDialogFactory_1 = require("../../../shared/dialog/FaqDialogFactory");
const AlexaConvoImpl_1 = require("../utils/AlexaConvoImpl");
class ReturnPolicyHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        var alexaConvo = new AlexaConvoImpl_1.default(this.alexa);
        alexaConvo.ask(FaqDialogFactory_1.default.returnPolicySSML());
    }
}
exports.default = ReturnPolicyHandler;
//# sourceMappingURL=ReturnPolicyHandler.js.map