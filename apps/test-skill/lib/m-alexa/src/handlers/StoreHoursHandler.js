"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HandlerBase_1 = require("./HandlerBase");
const AlexaDeviceUtil_1 = require("../utils/AlexaDeviceUtil");
class StoreHoursHandler extends HandlerBase_1.default {
    constructor(alexa) {
        super(alexa);
    }
    respond() {
        const deviceUtil = new AlexaDeviceUtil_1.default(this.event);
        // deviceUtil.checkAddressPermission()
        // .subscribe(res => {
        //   console.log("HOURS HAS LOCATION?: " + this.alexa.attributes.hasLocation);
        //   if(!res){
        //     this.alexa.emit(':tellWithPermissionCard', AppConstants.PERM, 
        //                     ["read::alexa:device:all:address"]);
        //   }else{
        //     if(!this.alexa.attributes.hasLocation){
        //       MiscUtil.getStore(deviceUtil, this.alexa)
        //       .subscribe(res => {
        //         const mom = moment(new Date())//.tz(AppConstants.PST);
        //         const slotVal = this.event.request.intent.slots.date.value;
        //         console.log("DATE VALUE: " + JSON.stringify(slotVal));
        //         if(typeof(slotVal) == 'undefined' || slotVal == mom.format("YYYY-MM-DD")){
        //           //console.log("EMIT: " + JSON.stringify(res.schedule.workingHours[0]));
        //           //console.log("MOMENT: " + moment(res.schedule.workingHours[0].closeTime, 'HH:mm').tz(PST).format('hh:mm a'));
        //           this.alexa.emit(':ask', 'Store hours today for ' + res.name + ' are from ' + 
        //                           moment(res.schedule.workingHours[0].openTime, 'HH:mm').format('hh:mm a') +
        //                           ' until ' + moment(res.schedule.workingHours[0].closeTime, 'HH:mm').format('hh:mm a'));
        //         }else if(slotVal == mom.add(1, 'd').format("YYYY-MM-DD")){
        //           this.alexa.emit(':ask', 'Store hours tomorrow for ' + res.name + ' are from ' + 
        //                           moment(res.schedule.workingHours[1].openTime, 'HH:mm').format('hh:mm a') +
        //                           ' until ' + moment(res.schedule.workingHours[1].closeTime, 'HH:mm').format('hh:mm a'));              
        //         }
        //       })
        //     }else{
        //       this.alexa.emit(':ask', "ALREADY Your nearest Macy's store is in: " + this.alexa.attributes.location);
        //     }
        //   }
        // });
    }
}
exports.default = StoreHoursHandler;
//# sourceMappingURL=StoreHoursHandler.js.map