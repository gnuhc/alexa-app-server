"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoreTimeUtil_1 = require("./StoreTimeUtil");
class default_1 {
    static getIntro(conv, returning) {
        let str;
        if (returning) {
            str = `Welcome back to Macy’s. It’s great to chat with you again about finding Macy’s store locations, hours, and our special store events.
                    We’re adding more content to this skill, so be sure to check back in!`;
        }
        else {
            str = `Hello, and  welcome to Macy’s. Use this skill to find Macy’s store locations and hours, and to hear about our exciting in-store events.
                To get started, just “ask where’s my nearest Macy’s”, “ask Macy’s for store hours”, or “ask what’s happening at Macy’s”.
                 More ways to talk to Macy’s are coming soon. Check back in!`;
        }
        this.saveForRepeat(conv, str);
        return str;
    }
    static getMainStoreResponse(conv, macysStore, event) {
        let intro = `Based on your location settings, your nearest store is ${macysStore.name}
        at ${macysStore.address.line1 + ' ' +
            macysStore.address.city + ', ' +
            macysStore.address.state}, only ${macysStore.geoLocation.distance} ${macysStore.geoLocation.unitDistance} away.`;
        //console.log("EVENTTTT: " + JSON.stringify(this.event))
        intro += ' ' + StoreTimeUtil_1.default.getTimeDialogResponse(conv, macysStore, event);
        conv.attributes.distance = macysStore.geoLocation.distance;
        this.saveForRepeat(conv, intro);
        return intro;
    }
    static getMainStoreResponseNoHours(conv, macysStore, event) {
        let intro = `Based on your location settings, your nearest store is ${macysStore.name}
        at ${macysStore.address.line1 + ' ' +
            macysStore.address.city + ', ' +
            macysStore.address.state}, only ${macysStore.geoLocation.distance} ${macysStore.geoLocation.unitDistance} away.`;
        //console.log("EVENTTTT: " + JSON.stringify(this.event))
        //intro += ' ' + StoreTimeUtil.getTimeDialogResponse(conv, macysStore, event);
        conv.attributes.distance = macysStore.geoLocation.distance;
        this.saveForRepeat(conv, intro);
        return intro;
    }
    static getTimeDialogResponseOnly(conv, macysStore, event) {
        let intro = StoreTimeUtil_1.default.getTimeDialogResponse(conv, macysStore, event);
        conv.attributes.distance = macysStore.geoLocation.distance;
        this.saveForRepeat(conv, intro);
        return intro;
    }
    // each method that gets built in here should call save for repeat
    // will do a builder when needed
    // TODO: set past context as the next context when called for repeat
    static saveForRepeat(conv, str) {
        console.log("type: " + JSON.stringify(conv.attributes));
        if (typeof (conv.user) == 'undefined' && conv.attributes) {
            console.log("NULL");
            conv.attributes.repeat = str;
        }
        else {
            conv.user.storage.repeat = str;
        }
    }
    static getSavedInfoDialog(conv, attr) {
        console.log("GET SAVED ATTR: " + JSON.stringify(attr));
        let intro = ' I remember that your store is ' + attr.store_name +
            ' at ' + attr.store_address +
            ' , only ' + attr.distance + ' miles away. ';
        return intro;
    }
    static askLocationQuestion() {
        return 'Would you like to find another location? ';
    }
}
exports.default = default_1;
//# sourceMappingURL=DialogFactory.js.map