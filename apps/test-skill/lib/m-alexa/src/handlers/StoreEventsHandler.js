"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaDeviceUtil_1 = require("../utils/AlexaDeviceUtil");
const AppConstants_1 = require("../../../shared/AppConstants");
class StoreEventsHandler {
    constructor(alexa) {
        this.alexa = alexa;
        this.event = alexa.event;
        this.alexaUserId = this.event.context.System.user.userId;
    }
    respond() {
        const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
        deviceUtil.checkAddressPermission()
            .subscribe(res => {
            console.log("HOURS HAS LOCATION?: " + this.alexa.attributes.hasLocation);
            if (!res) {
                this.alexa.emit(':tellWithPermissionCard', AppConstants_1.default.PERM, ["read::alexa:device:all:address"]);
            }
            else {
                //if(!this.alexa.attributes.hasLocation){
                // this.findStoreEvent(deviceUtil)
                // .subscribe(res => {
                //   console.log("RESPONSE1: " + JSON.stringify(res));
                //   this.alexa.emit(':ask', `There are ${res.length} events going on right now` + 
                //   	                    "Events near your store are: " + JSON.stringify(res.name) + 
                //   	                    `happening from ${res.startDate} and ending at ${res.finishDate}`);
                // })
                // }else{
                //   this.alexa.emit(':ask', "ALREADY Your nearest Macy's store is in: " + this.alexa.attributes.location);
                // }
            }
        });
    }
}
exports.default = StoreEventsHandler;
//# sourceMappingURL=StoreEventsHandler.js.map