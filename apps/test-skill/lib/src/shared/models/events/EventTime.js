"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class EventTime {
    constructor(obj) {
        this.event_date = obj.event_date;
        this.event_time = obj.event_time;
        this.event_time_end = obj.event_time_end;
    }
    isToday() {
        return moment(this.event_date, 'MM/DD/YYYY').format('MMM Do YY') === moment().format('MMM Do YY');
    }
}
exports.default = EventTime;
//# sourceMappingURL=EventTime.js.map