"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnalyticsPathBuilder {
    constructor() {
        this.url = '';
        this.userID = '';
        this.appID = '';
        this.intentString = '';
        this.deviceString = '';
        this.initialString = '';
        this.mainString = '';
    }
    static Builder() {
        return new AnalyticsPathBuilder();
    }
    default() {
        this.url = `http://macys.sc.omtrdc.net/b/ss/macysmcomvoiceappdev/0?`;
        this.mainString += this.url;
        return this;
    }
    putID(id) {
        this.userID = `vid=${id}`;
        this.mainString += this.userID;
        return this;
    }
    putAppID(id) {
        this.appID = `&c.a.AppID=Macys${id}`;
        this.mainString += this.appID;
        return this;
    }
    putIntent(intentString) {
        if (intentString === 'Store_Hours_Intent' ||
            intentString === 'Store_Location_Intent' ||
            intentString === 'Store_Events') {
            this.intentString += `&c.a.LaunchEvent=1&c.Intent=${intentString}`;
        }
        else if (intentString === 'Welcome_Intent' ||
            intentString === 'Fallback_Intent' ||
            intentString === 'Help_Intent' ||
            intentString === 'Stop_Intent') {
            this.intentString += `&c.LaunchEvent=1&c.Intent=${intentString}`;
        }
        else if (intentString === 'Save_For_Next_Time_Intent') {
            this.intentString += `&c.Intent=${intentString}`;
        }
        else if (intentString === 'Repeat_Intent') {
            this.intentString += `&c.Intent=${intentString}`;
        }
        else if (intentString === 'Invalid_Intent') {
            this.intentString += `&c.Error=1&c.ErrorName=${intentString}`;
        }
        this.intentString += `&pageName=${intentString}`;
        this.mainString = this.intentString;
        return this;
    }
    putDevice(deviceString) {
        this.deviceString = `&c.Device=${deviceString}`;
        this.mainString += this.deviceString;
        return this;
    }
    putInitialUtterance(initialString) {
        this.initialString = `&c.InitialUtterance=${initialString}`;
        this.mainString += this.initialString;
        return this;
    }
    build() {
        return this.mainString;
    }
}
exports.default = AnalyticsPathBuilder;
//# sourceMappingURL=AnalyticsPathBuilder.js.map