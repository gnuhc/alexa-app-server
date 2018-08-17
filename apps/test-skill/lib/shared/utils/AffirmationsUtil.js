"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AffirmationsList_1 = require("./AffirmationsList");
class AffirmationsUtil {
    static getIntro() {
        return (this.shuffle(AffirmationsList_1.PreList))[0];
    }
    static getOutro() {
        return (this.shuffle(AffirmationsList_1.PostList))[0];
    }
    static getAffirmation() {
        return (this.shuffle(AffirmationsList_1.AffirmationsList))[0];
    }
    static shuffle(array) {
        let currentIndex = array.length, tempValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            tempValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = tempValue;
        }
        return array;
    }
}
exports.default = AffirmationsUtil;
//# sourceMappingURL=AffirmationsUtil.js.map