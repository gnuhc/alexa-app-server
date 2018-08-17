"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AgentConstants_1 = require("../AgentConstants");
const MainStoreResponseBuilder_1 = require("./MainStoreResponseBuilder");
class StoreDialogFactory {
    // the creation of our responses
    static getMainStoreResponse(conv, macysStore) {
        let builder = new MainStoreResponseBuilder_1.default(conv, macysStore);
        builder = builder.introResponse().storeName();
        if (conv.hasEntity(AgentConstants_1.default.ENTITY_ADDRESS_KEY) || conv.hasStorage('nearStoreIntent')) {
            console.log("HAS ADDRESS");
            return builder.addressLine().geoResponse().timeDialogResponse().build();
        }
        if (conv.hasEntity(AgentConstants_1.default.ENTITY_SAVED_STORE)) {
            return new MainStoreResponseBuilder_1.default(conv, macysStore).rememberedStore().timeDialogResponse().build();
        }
        else if (conv.hasStorage('hoursIntent')) {
            console.log("MOST RECENT STORAGE: " + JSON.stringify(conv.getStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY)));
            console.log("HAS HOURS");
            return new MainStoreResponseBuilder_1.default(conv, conv.getStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY)).storeName().cityAndState().timeDialogResponse().build();
        }
        else if (conv.getStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY)) {
            console.log("HAS RECENT");
            return builder.addressLine().geoResponse().timeDialogResponse().build();
        }
        else if (conv.hasStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY)) {
            console.log("HAS SAVED");
            return new MainStoreResponseBuilder_1.default(conv, macysStore).rememberedStore().geoResponse().timeDialogResponse().build();
        }
        else {
            console.log("HAS NONE");
            return builder.addressLine().geoResponse().timeDialogResponse().build();
        }
    }
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
        return str;
    }
    static locationBasedIntroResponse(conv) {
        if (conv.getStorage('hoursIntent')) {
            return `Okay, I recommend `;
        }
        else if (conv.getEntity(AgentConstants_1.default.ENTITY_ADDRESS_KEY)) {
            return ``;
        }
        else if (conv.getStorage('nearStoreIntent')) {
            return `Based on your location settings, your nearest store is`;
        }
        else {
            return `Okay, I recommend `;
        }
    }
    static locationBasedGeoResponse(conv, macysStore) {
        if (conv.isNearbyRequest()) {
            return `, only ${macysStore.geoLocation.distance} ${macysStore.geoLocation.unitDistance} away.`;
        }
        else {
            return '';
        }
    }
    static getRememberedStoreIfAny(conv) {
        const savedStore = conv.getStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY);
        let remembered = '';
        if (savedStore) {
            remembered = `I remember that your store is ${savedStore.name}
                     at ${savedStore.address.line1}.`;
        }
        return remembered;
    }
    static storeAskEvents() {
        return 'You can ask me to find another location, or ask to hear about this store’s special events.';
    }
    static storeAskLocation() {
        return 'Would you like to find another location?';
    }
    // each method that gets built in here should call save for repeat
    // will do a builder when needed
    static askLocationQuestion() {
        return 'Would you like to find another location? ';
    }
}
exports.default = StoreDialogFactory;
//# sourceMappingURL=StoreDialogFactory.js.map