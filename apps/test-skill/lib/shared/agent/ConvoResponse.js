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
class ConvoResponse {
    constructor(finalString, isAsk, needsPermission) {
        this.finalString = finalString;
        this.isAsk = isAsk;
        this.needsPermission = needsPermission;
    }
    // returns a convoResponse in a promise
    static createConvoPromiseResponse(finalString, isAsk = true, needsPermission = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ConvoResponse(finalString, isAsk, needsPermission);
        });
    }
}
exports.default = ConvoResponse;
//# sourceMappingURL=ConvoResponse.js.map