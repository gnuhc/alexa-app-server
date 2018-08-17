"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MacysFetchObservable_1 = require("./MacysFetchObservable");
class POIUtil {
    static pointOfInterestForStore(storeNumber) {
        const url = `https://api.pointinside.com/feeds/maps/v1.5/venues/${storeNumber}/places/`;
        return MacysFetchObservable_1.default.fetch(url + this.queryParams);
    }
    static pointOfInterestWithZoneId(storeNumber, zoneId) {
        const url = `https://api.pointinside.com/feeds/maps/v1.5/venues/${storeNumber}/zones/${zoneId}/`;
        return MacysFetchObservable_1.default.fetch(url + this.queryParams);
    }
    // Starbucks
    static pointOfInterestWithEntity(storeNumber, entity) {
        this.pointOfInterestForStore(storeNumber)
            .flatMap(it => it.data)
            .filter(it => it.pogName === entity) // compare against pog name and requested entity
            .map(it => it.zoneId) // get zone id
            .reduce((acc, val) => val) // return just one
            .flatMap(zoneId => this.pointOfInterestWithZoneId(storeNumber, zoneId))
            .map(it => it.data)
            .map(it => it[0])
            .subscribe(it => {
            console.log(it.name);
        });
    }
}
POIUtil.queryParams = '?apiKey=bf54900fbe31e1c79941aeaec1e8d3fe&devId=4ae2b9a077793269bde55b0addb40a83';
POIUtil.POG_NAME_AT_YOUR_SERVICE = 'At Your Service';
POIUtil.POG_NAME_PASSENGER_ELEVATOR = 'Elevator';
POIUtil.POG_NAME_MY_STYLIST = 'My Stylist';
POIUtil.POG_NAME_RESTROOM = 'Restroom';
POIUtil.POG_NAME_STARBUCKS = 'Starbucks';
POIUtil.POG_NAME_STORE_PICKUP = 'Buy Online Pickup In-Store';
POIUtil.POG_NAME_WEDDING_GIFT_REGISTRY = 'Wedding Gift Registry';
POIUtil.POG_NAME_RESTAURANT_PREFIX = 'Restaurant - ';
POIUtil.POG_NAME_LIST = [POIUtil.POG_NAME_AT_YOUR_SERVICE, POIUtil.POG_NAME_PASSENGER_ELEVATOR,
    POIUtil.POG_NAME_MY_STYLIST, POIUtil.POG_NAME_RESTROOM, POIUtil.POG_NAME_STARBUCKS,
    POIUtil.POG_NAME_STORE_PICKUP, POIUtil.POG_NAME_WEDDING_GIFT_REGISTRY, POIUtil.POG_NAME_RESTAURANT_PREFIX];
exports.default = POIUtil;
POIUtil.pointOfInterestWithEntity(5032, POIUtil.POG_NAME_STARBUCKS);
//# sourceMappingURL=POIUtil.js.map