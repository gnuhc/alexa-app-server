"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AgentConstants_1 = require("../AgentConstants");
const moment = require("moment-timezone");
const tzlookup = require("tz-lookup");
class StoreTimeUtil {
    static getTimeDialogMode(conv, macysStore) {
        if (conv.getEntity('weekend')) {
            console.log("GOT WEEKEND");
            return Mode.WEEKEND;
        }
        if (conv.getEntity('date')) {
            console.log("GOT SPECIFIC");
            return Mode.SPECIFIC_DAY;
        }
        const current = moment().tz(tzlookup(conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES).latitude, conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES).longitude));
        const timestamp = current.format('YYYY-MM-DD HH:mm');
        const timestampDateFormatted = current.format('YYYY-MM-DD');
        let eventTime = macysStore.schedule.workingHours[0];
        // this check is needed when macys api is not updated to reflect today's times as the first index of workingHours
        if (timestampDateFormatted !== macysStore.schedule.workingHours[0].operationDate) {
            console.log("IS NOT EQUAL");
            eventTime = macysStore.schedule.workingHours[1];
        }
        console.log("EVENT TIMES: " + JSON.stringify(macysStore.schedule));
        const open = moment(eventTime.operationDate + ' ' + eventTime.openTime, 'YYYY-MM-DD HH:mm');
        const openTimestamp = open.format('YYYY-MM-DD HH:mm');
        const close = moment(eventTime.operationDate + ' ' + eventTime.closeTime, 'YYYY-MM-DD HH:mm');
        const closeTimestamp = close.format('YYYY-MM-DD HH:mm');
        console.log("OPEN: " + JSON.stringify(open));
        console.log("CLOSE: " + JSON.stringify(close));
        console.log("OPENTIMESTAMP: " + JSON.stringify(openTimestamp));
        console.log("CLOSETIMESTAMP: " + JSON.stringify(closeTimestamp));
        console.log("TIMESTAMP: " + JSON.stringify(timestamp));
        if (!macysStore.schedule.workingHours[0].hasOwnProperty('closeTime') ||
            !macysStore.schedule.workingHours[1].hasOwnProperty('closeTime')) {
            return Mode.CLOSED_TWO_DAYS;
        }
        if (moment(openTimestamp).isBefore(timestamp) && moment(closeTimestamp).isAfter(timestamp)) {
            return Mode.OPEN_UNTIL;
        }
        if (moment(openTimestamp).isAfter(timestamp)) {
            console.log("IS ATER" + JSON.stringify(moment(timestamp).format('dddd')));
            console.log("IS ATER1" + JSON.stringify(moment(openTimestamp).format('dddd')));
            //if current day is same as opening day, dialog pertains to today
            if (moment(timestamp).format('dddd') === moment(openTimestamp).format('dddd')) {
                console.log("EQUAL");
                return Mode.OPEN_SOON;
                //if current day is day before opening day such as (11:45 PM), dialog pertains to tomorrow
            }
        }
        return Mode.CLOSED_TODAY;
    }
    // LT returns date format to 1:56 PM
    static getTimeDialogResponse(conv, macysStore) {
        if (!macysStore.schedule) {
            return '';
        }
        const currentTime = moment().tz(tzlookup(conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES).latitude, conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES).longitude));
        const timestampDateFormatted = currentTime.format('YYYY-MM-DD');
        let todayClose = this.toMoment(macysStore.schedule.workingHours[0].closeTime);
        let todayOpen = this.toMoment(macysStore.schedule.workingHours[0].openTime);
        let tomorrowOpen = this.toMoment(macysStore.schedule.workingHours[1].openTime);
        let tomorrowClose = this.toMoment(macysStore.schedule.workingHours[1].closeTime);
        // this check is needed when macys api is not updated to reflect today's times as the first index of workingHours
        if (timestampDateFormatted !== macysStore.schedule.workingHours[0].operationDate) {
            todayClose = this.toMoment(macysStore.schedule.workingHours[1].closeTime);
            todayOpen = this.toMoment(macysStore.schedule.workingHours[1].openTime);
            tomorrowOpen = this.toMoment(macysStore.schedule.workingHours[2].openTime);
            tomorrowClose = this.toMoment(macysStore.schedule.workingHours[2].closeTime);
        }
        switch (this.getTimeDialogMode(conv, macysStore)) {
            case Mode.OPEN_UNTIL:
                return `We're open today, until ${todayClose.format('LT')}. `;
            case Mode.CLOSED_TWO_DAYS:
                return `We are closed for today.`;
            case Mode.CLOSED_TODAY:
                return `We're open tomorrow from ${tomorrowOpen.format('LT')} to ${tomorrowClose.format('LT')}. `;
            case Mode.OPEN_SOON:
                return `We're open today from ${todayOpen.format('LT')} to ${todayClose.format('LT')}. `;
            case Mode.SPECIFIC_DAY:
                const current = moment().tz(tzlookup(conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES).latitude, conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES).longitude));
                const timestamp = current.format('YYYY-MM-DD HH:mm');
                const timestampDate = current.format('YYYY-MM-DD');
                console.log("TIMESTAMP: " + JSON.stringify(timestamp));
                console.log("TIMESTAMPDATE: " + JSON.stringify(timestampDate));
                const entityTime = moment(conv.getEntity('date'), 'YYYY-MM-DD').tz(tzlookup(conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES).latitude, conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES).longitude));
                //console.log("SPLIT: " + (JSON.stringify(entityTime).split('T')[0]))
                const entityTimestamp = (JSON.stringify(entityTime).split('T')[0]).split('"')[1];
                console.log("ENTITYTIME: " + JSON.stringify(entityTime));
                console.log("ENTITYTIMESTAMP: " + entityTimestamp);
                let userDate = '';
                /* This check is done because Amazon sometimes interprets a day from previous week. For example,
                   if user asks for this upcoming Wednesday, Amazon may interpret Wednesday as the previous Wednesday.
                   This check is also done because of UTC timezone for AWS deployment. For some reason, formatting
                   entityTime with 'MMM Do YY' or 'YYYY-MM-DD' sets date as one day before so I make sure not to add
                   a week when this occurs by splitting the entityTime value to extract the date value.
                */
                if (moment(entityTimestamp).isBefore(timestampDate)) {
                    console.log("ADD 7");
                    userDate = (moment(entityTimestamp).add(7, 'days')).format('MMM Do YY');
                }
                else {
                    console.log("DONT ADD 7" + JSON.stringify(moment(entityTimestamp)));
                    userDate = moment(entityTimestamp).format('MMM Do YY'); // July 5th 2018
                }
                console.log("USERDATE: " + JSON.stringify(userDate));
                let wh;
                for (const hour of macysStore.schedule.workingHours) {
                    console.log("HOURS: " + moment(hour.operationDate).format('MMM Do YY'));
                    if (moment(hour.operationDate).format('MMM Do YY') === userDate) {
                        wh = hour;
                        break;
                    }
                }
                console.log("WH" + JSON.stringify(wh));
                if (wh) {
                    const specificOpen = moment(wh.operationDate + ' ' + wh.openTime, 'YYYY-MM-DD HH:mm');
                    const specificClose = moment(wh.operationDate + ' ' + wh.closeTime, 'YYYY-MM-DD HH:mm');
                    const openTimestamp = specificOpen.format('YYYY-MM-DD HH:mm');
                    const closeTimestamp = specificClose.format('YYYY-MM-DD HH:mm');
                    console.log("OPEN: " + JSON.stringify(openTimestamp));
                    console.log("CLOSE: " + JSON.stringify(closeTimestamp));
                    console.log("SPEC OPEN: " + specificOpen);
                    console.log("SPEC CLOSE: " + specificClose);
                    // if opening time of entity value is 'today'
                    if (moment(openTimestamp).format('dddd') === moment(timestamp).format('dddd')) {
                        console.log("CURRENT DAY AND OPENTIME DAY EQUAL");
                        // if store is currently open today
                        if (moment(openTimestamp).isBefore(timestamp) && moment(closeTimestamp).isAfter(timestamp)) {
                            console.log("STORE OPEN RIGHT NOW");
                            return `We're open today, until ${this.toMoment(wh.closeTime).format('LT')}. `;
                        }
                        // if store is not yet open
                        if (moment(openTimestamp).isAfter(timestamp)) {
                            console.log("STORE NOT OPEN YET");
                            // if current time is between after today's closing time and before tomorrow
                            if (moment(openTimestamp).subtract(1, 'day').format('dddd') === moment(timestamp).format('dddd')) {
                                console.log("STORE NOT OPEN YET, ITS CURRENTLY DAY BEFORE AFTER 10pm");
                                return `This store is open tomorrow 
                                    from ${this.toMoment(wh.openTime).format('LT')} to ${this.toMoment(wh.closeTime).format('LT')}. `;
                            }
                            console.log("STORE NOT OPEN YET, ITS CURRENTLY SAME DAY IN EARLY MORNING");
                            // if current time is before today's opening time
                            return `We're open today from ${this.toMoment(wh.openTime).format('LT')} to ${this.toMoment(wh.closeTime).format('LT')}. `;
                        }
                        // if current time is after today's closing time
                        if (moment(timestamp).isAfter(closeTimestamp)) {
                            console.log("STORE ALREADY CLOSED FOR TODAY");
                            return `We're closed today. We're open tomorrow from ${tomorrowOpen.format('LT')} to ${tomorrowClose.format('LT')}. `;
                        }
                    }
                    // if entity value is not 'today'
                    console.log("CURRENT TIME AND OPENTIME NOT EQUAL");
                    return `This store is open ${moment(wh.operationDate).format('dddd')} 
                                from ${this.toMoment(wh.openTime).format('LT')} to ${this.toMoment(wh.closeTime).format('LT')}. `;
                }
                return ''; // TODO: too far in advanced or in the past
            case Mode.WEEKEND:
                const dayMap = { saturday: 0, sunday: 1 };
                let workingHours = macysStore.schedule.workingHours;
                let num = 0;
                // changed for loop so that I can access sundays time values as well as saturdays in one iteration. 
                // Previously, since only looping by hour, cannot access any other day's times
                for (let num = 0; num < workingHours.length; num++) {
                    const dayFormat = moment(workingHours[num].operationDate).format('dddd').toLowerCase();
                    switch (dayMap[dayFormat]) {
                        case 0:
                            const satOpen = this.toMoment(workingHours[num].openTime).format('LT');
                            const satClose = this.toMoment(workingHours[num].closeTime).format('LT');
                            console.log("WORKINGHOURS: " + JSON.stringify(workingHours));
                            console.log("WORKINGHOURS NUM: " + num + ' ' + JSON.stringify(workingHours[num]));
                            console.log("WORKINGHOURS NUM+1: " + num + 1 + ' ' + JSON.stringify(workingHours[num + 1]));
                            let sunOpen = this.toMoment(workingHours[num + 1].openTime).format('LT');
                            let sunClose = this.toMoment(workingHours[num + 1].closeTime).format('LT');
                            return `This weekend, we’re open on Saturday from ${satOpen} to ${satClose}, and on Sunday from ${sunOpen} to ${sunClose}. `;
                        case 1:
                            let sundOpen = this.toMoment(workingHours[num].openTime).format('LT');
                            let sundClose = this.toMoment(workingHours[num].closeTime).format('LT');
                            return `This Sunday, we're open from ${sundOpen} to ${sundClose}. `;
                        default:
                    }
                }
                //                 for (const hour of macysStore.schedule.workingHours) {
                //                     const dayFormat = moment(hour.operationDate).format('dddd').toLowerCase();
                //                     switch (dayMap[dayFormat]) {
                //                         // if it is monday-saturday, and user asks for weekend, we know we will hit saturday first
                //                         case 0:
                //                             const satOpen = this.toMoment(hour.openTime).format('LT');
                //                             const satClose = this.toMoment(hour.closeTime).format('LT');
                //                             let sunOpen = this.toMoment(macysStore.schedule.workingHours[count + 1].openTime).format('LT');
                //                             let sunClose = this.toMoment(macysStore.schedule.workingHours[count + 1].closeTime).format('LT');
                //                             return `This weekend, we’re open on Saturday from ${satOpen} to ${satClose}, and on Sunday from` //${sunOpen} to ${sunClose}. `;
                //                         // if it is sunday and user asks for weekend, just givem sunday times
                //                         // case 1:
                //                         //     sunOpen = this.toMoment(hour.openTime).format('LT');
                //                         //     sunClose = this.toMoment(hour.closeTime).format('LT');
                //                         //     return `This Sunday, we're open from ${sunOpen} to ${sunClose}. `;
                //                         default:
                //                     }
                //                     count++;
                //                 }
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