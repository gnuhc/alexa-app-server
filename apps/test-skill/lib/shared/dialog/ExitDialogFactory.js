"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExitDialogFactory {
    static askExit() {
        return `Before you go, should I remember this store for next time?`;
    }
    static sayGoodByeSaved() {
        return `Great! Happy shopping!`;
    }
    static sayGoodByeNotSaved() {
        return `Okay, talk to you soon!`;
    }
    static getExitQuestion() {
        return `Before you go, should I remember this store for next time?`;
    }
    static sayGoodByeSavedBefore() {
        return `OK, see you again soon.`;
    }
}
exports.default = ExitDialogFactory;
//# sourceMappingURL=ExitDialogFactory.js.map