"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoreDialogFactory_1 = require("./StoreDialogFactory");
const StoreTimeUtil_1 = require("./StoreTimeUtil");
class MainStoreResponseBuilder {
    constructor(conv, store) {
        this.response = '';
        this.conv = conv;
        this.store = store;
    }
    introResponse() {
        this.response += ` ${StoreDialogFactory_1.default.locationBasedIntroResponse(this.conv)} `;
        return this;
    }
    storeName() {
        this.response += ` ${this.store.name} `;
        return this;
    }
    addressLine() {
        this.response += ` at ${this.store.address.line1} `;
        return this;
    }
    cityAndState() {
        this.response += ` at ${this.store.address.city}, ${this.store.address.state}. `;
        return this;
    }
    rememberedStore() {
        this.response += ` ${StoreDialogFactory_1.default.getRememberedStoreIfAny(this.conv)} `;
        return this;
    }
    geoResponse() {
        this.response += ` ${StoreDialogFactory_1.default.locationBasedGeoResponse(this.conv, this.store)} `;
        return this;
    }
    timeDialogResponse() {
        console.log("BUILDER STORE: " + JSON.stringify(this.store));
        this.response += ` ${StoreTimeUtil_1.default.getTimeDialogResponse(this.conv, this.store)} `;
        return this;
    }
    build() {
        return this.response;
    }
}
exports.default = MainStoreResponseBuilder;
//# sourceMappingURL=MainStoreResponseBuilder.js.map