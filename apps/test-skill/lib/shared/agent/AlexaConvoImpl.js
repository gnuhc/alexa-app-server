"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlexaConvoImpl {
    constructor(alexa) {
        this.alexa = alexa;
        this.parameters = alexa.attributes;
    }
    saveToStorage(key, val) {
        this.alexa.attributes[key] = val;
        this.parameters[key] = val;
    }
    getStorage(key) {
        return this.alexa.attributes[key];
    }
    // TODO jong - implement delegation to asking here
    ask(str) {
        return this.alexa.emit(':ask', str);
    }
}
exports.default = AlexaConvoImpl;
//# sourceMappingURL=AlexaConvoImpl.js.map