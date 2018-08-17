"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HandlerBase_1 = require("./HandlerBase");
const AlexaDeviceUtil_1 = require("../utils/AlexaDeviceUtil");
const MiscUtil_1 = require("../utils/MiscUtil");
const AppConstants_1 = require("../../../shared/AppConstants");
const moment = require("moment-timezone");
class StoreLocationHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
        deviceUtil.checkAddressPermission()
            .subscribe(res => {
            console.log("STORE LOCATION HAS: " + this.alexa.attributes.hasLocation);
            if (!res) {
                this.alexa.emit(':tellWithPermissionCard', AppConstants_1.default.PERM, ["read::alexa:device:all:address"]);
            }
            else {
                if (!this.alexa.attributes.hasLocation) {
                    MiscUtil_1.default.getStore(deviceUtil, this.alexa).map(res => {
                        console.log("RESSS: ");
                        this.alexa.attributes.store_name = res.name;
                        this.alexa.attributes.store_address = res.address.line1 + ', ' + res.address.city + ', ' +
                            res.address.state + ', ' + res.address.zipCode;
                        this.alexa.attributes.times = res.schedule.workingHours;
                    }).subscribe(res => {
                        console.log("RESSS1: ");
                        deviceUtil.getDistance(this.alexa.attributes.user_address, this.alexa.attributes.store_address)
                            .map(res => {
                            this.alexa.attributes.distance = res.rows[0].elements[0].distance.text;
                            console.log("COORD: ");
                            console.log("EVENTS: " + JSON.stringify(res));
                        })
                            .subscribe(res => {
                            const mom = moment();
                            let speech = '';
                            //console.log("EVENTS3: " + this.alexa.attributes.events)
                            this.alexa.handler.state = 'EVENTS_NOT_EXIST';
                            speech = 'Would you like to find another location?';
                            if (mom.isBetween(moment(JSON.stringify(this.alexa.attributes.times[0].openTime), 'hh:mm'), moment(JSON.stringify(this.alexa.attributes.times[0].closeTime), 'hh:mm'))) {
                                this.alexa.emit(':ask', 'Based on your location settings, your nearest store is ' +
                                    this.alexa.attributes.store_name + ' at ' + this.alexa.attributes.store_address + ', only '
                                    + this.alexa.attributes.distance + ' away. ' + 'We are open today until '
                                    + moment(JSON.stringify(this.alexa.attributes.times[0].closeTime), 'hh:mm a').format('hh:mm a') + '. '
                                    + speech);
                            }
                            if (mom.isBefore(moment(JSON.stringify(this.alexa.attributes.times[0].openTime), 'hh:mm'))) {
                                this.alexa.emit(':ask', 'Based on your location settings, your nearest store is ' +
                                    this.alexa.attributes.store_name + ' at ' + this.alexa.attributes.store_address + ', only '
                                    + this.alexa.attributes.distance + ' away. ' + 'We are open today '
                                    + moment(this.alexa.attributes.times[0].openTime, 'hh:mm a').format('hh:mm a') + ' to '
                                    + moment(this.alexa.attributes.times[0].closeTime, 'hh:mm a').format('hh:mm a') + '. '
                                    + speech);
                            }
                            if (mom.isAfter(moment(JSON.stringify(this.alexa.attributes.times[0].closeTime), 'hh:mm'))) {
                                console.log("AFTER");
                                this.alexa.emit(':ask', 'Based on your location settings, your nearest store is ' +
                                    this.alexa.attributes.store_name + ' at ' + this.alexa.attributes.store_address + ', only '
                                    + this.alexa.attributes.distance + ' away. ' + 'We are open tomorrow '
                                    + moment(this.alexa.attributes.times[1].openTime, 'hh:mm a').format('hh:mm a') + ' to '
                                    + moment(this.alexa.attributes.times[1].closeTime, 'hh:mm a').format('hh:mm a') + '. '
                                    + speech);
                            }
                        }, (error) => {
                        });
                    });
                }
                else {
                    this.alexa.emit(':ask', "ALREADY Your nearest Macy's store is in: " + this.alexa.attributes.location);
                }
            }
        });
    }
}
exports.default = StoreLocationHandler;
//# sourceMappingURL=StoreLocationHandler1.js.map