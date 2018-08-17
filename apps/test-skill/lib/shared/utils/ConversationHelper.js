"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppConstants_1 = require("../AppConstants");
class ConversationHelper {
    static haveLocationPermission(conv) {
        return conv.user.storage.location !== null;
    }
    static askForPermission(alexa) {
        return alexa.emit(':tellWithPermissionCard', AppConstants_1.default.PERM, ['read::alexa:device:all:address']);
    }
}
exports.default = ConversationHelper;
//# sourceMappingURL=ConversationHelper.js.map