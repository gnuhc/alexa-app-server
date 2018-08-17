"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AffirmationsUtil_1 = require("../utils/AffirmationsUtil");
class AffirmationsDialogFactory {
    static getNextAffirmation(conv) {
        return AffirmationsUtil_1.default.getIntro() + ' ' + AffirmationsUtil_1.default.getAffirmation() + ' ' + AffirmationsUtil_1.default.getOutro();
    }
}
exports.default = AffirmationsDialogFactory;
//# sourceMappingURL=AffirmationsDialogFactory.js.map