"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoreUtil_1 = require("../../../shared/utils/StoreUtil");
const Coordinate_1 = require("../../../shared/models/Coordinate");
const Observable_1 = require("rxjs/Observable");
class MiscUtils {
    static getStore(device, alexa) {
        const observable = device.getAddress()
            .switchMap(res => {
            if (res) {
                if (res.addressLine1 != null && res.city != null) {
                    alexa.attributes.user_address = res.addressLine1 + ' ' + res.city + ' ' + res.postalCode;
                }
                else {
                    alexa.attributes.user_address = res.postalCode;
                }
                return device.getCoordinates(alexa.attributes.user_address);
            }
            else {
                return Observable_1.Observable.empty();
            }
        })
            .switchMap(res => {
            if (res) {
                alexa.attributes.coordinates = new Coordinate_1.default(res.lat, res.lng);
                return StoreUtil_1.default.coordinateToSingleStore(alexa.attributes.coordinates);
            }
            else {
                return Observable_1.Observable.empty();
            }
        });
        return observable;
    }
    static getStoreNewLocation(device, alexa) {
        const observable = device.getCoordinates(alexa.attributes.address)
            .switchMap(res => {
            if (res) {
                alexa.attributes.coordinates = new Coordinate_1.default(res.lat, res.lng);
                return StoreUtil_1.default.coordinateToSingleStore(alexa.attributes.coordinates);
            }
            else {
                return Observable_1.Observable.empty();
            }
        });
        return observable;
    }
}
exports.default = MiscUtils;
//# sourceMappingURL=MiscUtil.js.map