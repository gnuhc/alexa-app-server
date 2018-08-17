"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment-timezone");
const tzlookup = require("tz-lookup");
class StoreTimeUtil {
    static getTimeDialogMode(conv, macysStore) {
        if (conv.getEntity('weekend')) {
            return Mode.WEEKEND;
        }
        if (conv.getEntity('date')) {
            return Mode.SPECIFIC_DAY;
        }
        const eventTime = macysStore.schedule.workingHours[0];
        const open = moment(eventTime.operationDate + ' ' + eventTime.openTime, 'YYYY-MM-DD HH:mm');
        const close = moment(eventTime.operationDate + ' ' + eventTime.closeTime, 'YYYY-MM-DD HH:mm');
        const current = moment().tz(tzlookup(macysStore.geoLocation.latitude, macysStore.geoLocation.longitude));
        console.log("CURRENT: " + JSON.stringify(current));
        console.log("CURRENT CALENDAR: " + current.calendar());
        if (!macysStore.schedule.workingHours[0].hasOwnProperty('closeTime')) {
            return Mode.CLOSED_TWO_DAYS;
        }
        if (current.isAfter(open) && current.isAfter(close)) {
            return Mode.CLOSED_TODAY;
        }
        if (current.isBefore(open)) {
            return Mode.OPEN_SOON;
        }
        return Mode.OPEN_UNTIL;
    }
    // LT returns date format to 1:56 PM
    static getTimeDialogResponse(conv, macysStore) {
        if (!macysStore.schedule) {
            return '';
        }
        const todayClose = this.toMoment(macysStore.schedule.workingHours[0].closeTime);
        const todayOpen = this.toMoment(macysStore.schedule.workingHours[0].openTime);
        const tomorrowClose = this.toMoment(macysStore.schedule.workingHours[1].openTime);
        const tomorrowOpen = this.toMoment(macysStore.schedule.workingHours[1].closeTime);
        switch (this.getTimeDialogMode(conv, macysStore)) {
            case Mode.OPEN_UNTIL:
                return `We're open today, until ${todayClose.format('LT')}. `;
            case Mode.CLOSED_TWO_DAYS:
                return `We are closed for today.`;
            case Mode.CLOSED_TODAY:
                return `We're open tomorrow from ${tomorrowClose.format('LT')} to ${tomorrowOpen.format('LT')}. `;
            case Mode.OPEN_SOON:
                return `We're open today from ${todayOpen.format('LT')} to ${todayClose.format('LT')}. `;
            case Mode.SPECIFIC_DAY:
                const userDate = moment(conv.getEntity('date')).format('MMM Do YY'); // July 5th 2018
                let wh;
                for (const hour of macysStore.schedule.workingHours) {
                    if (moment(hour.operationDate).format('MMM Do YY') === userDate) {
                        wh = hour;
                        break;
                    }
                }
                if (wh) {
                    const specificOpen = this.toMoment(wh.openTime);
                    const specificClose = this.toMoment(wh.closeTime);
                    return `This store is open on ${(moment(wh.operationDate).calendar().split(' at'))[0]} 
                                from ${specificOpen.format('LT')} to ${specificClose.format('LT')}. `;
                }
                return ''; // TODO: too far in advanced or in the past
            case Mode.WEEKEND:
                const dayMap = { saturday: 0, sunday: 1 };
                let count = 0;
                for (const hour of macysStore.schedule.workingHours) {
                    const dayFormat = moment(hour.operationDate).format('dddd').toLowerCase();
                    switch (dayMap[dayFormat]) {
                        // if it is monday-saturday, and user asks for weekend, we know we will hit saturday first
                        case 0:
                            const satOpen = this.toMoment(hour.openTime).format('LT');
                            const satClose = this.toMoment(hour.closeTime).format('LT');
                            let sunOpen = this.toMoment(macysStore.schedule.workingHours[count].openTime).format('LT');
                            let sunClose = this.toMoment(macysStore.schedule.workingHours[count].closeTime).format('LT');
                            return `This weekend, we’re open on Saturday from ${satOpen} to ${satClose}, and on Sunday from ${sunOpen} to ${sunClose}. `;
                        // if it is sunday and user asks for weekend, just givem sunday times
                        case 1:
                            sunOpen = this.toMoment(hour.openTime).format('LT');
                            sunClose = this.toMoment(hour.closeTime).format('LT');
                            return `This weekend, we're open from ${sunOpen} to ${sunClose}. `;
                        default:
                    }
                    count++;
                }
                return '';
        }
    }
    static toMoment(str) {
        return moment(str, 'HH:mm');
    }
}
exports.default = StoreTimeUtil;
var Mode;
(function (Mode) {
    Mode[Mode["OPEN_UNTIL"] = 0] = "OPEN_UNTIL";
    Mode[Mode["CLOSED_TWO_DAYS"] = 1] = "CLOSED_TWO_DAYS";
    Mode[Mode["CLOSED_TODAY"] = 2] = "CLOSED_TODAY";
    Mode[Mode["OPEN_SOON"] = 3] = "OPEN_SOON";
    Mode[Mode["SPECIFIC_DAY"] = 4] = "SPECIFIC_DAY";
    Mode[Mode["WEEKEND"] = 5] = "WEEKEND";
})(Mode = exports.Mode || (exports.Mode = {}));
//# sourceMappingURL=StoreTimeUtil.js.map