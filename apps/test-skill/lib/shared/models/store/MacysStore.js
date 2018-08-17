"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MacysStore {
    constructor(id, name, locationNumber, storeNumber, schedule, phoneNumber, geoLocation, address) {
        this.id = id;
        this.name = name;
        this.locationNumber = locationNumber;
        this.storeNumber = storeNumber;
        this.schedule = schedule;
        this.phoneNumber = phoneNumber;
        this.geoLocation = geoLocation;
        this.address = address;
    }
    addr() {
        return ' ';
    }
}
exports.default = MacysStore;
//# sourceMappingURL=MacysStore.js.map