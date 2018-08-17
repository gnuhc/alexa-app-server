"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class AnalyticsBuilder {
    constructor() {
        this.url = `https://macys.sc.omtrdc.net/b/ss/macysmcomvoiceappdev/0?`;
        this.userID = '';
        this.appID = `c.a.AppID=Macys`;
        this.launch = undefined;
        this.intent = undefined;
        this.page = undefined;
        this.visits = undefined;
        this.deviceString = undefined;
        this.initialString = undefined;
        this.repeatString = undefined;
        this.errorString = undefined;
        this.firstTimeVisit = undefined;
    }
    static Builder() {
        return new AnalyticsBuilder();
    }
    userId(userId) {
        this.userID = `vid=${userId}`;
        return this;
    }
    launchEvent() {
        this.launch = 'c.a.LaunchEvent=1';
        return this;
    }
    intentName(intent) {
        this.intent = `c.Intent=${intent}`;
        return this;
    }
    pageName(page) {
        this.page = `pageName=${page}`;
        return this;
    }
    device(deviceString) {
        this.deviceString = `c.Device=${deviceString}`;
        return this;
    }
    initialUtterance(initialString) {
        this.initialString = `c.InitialUtterance=${initialString}`;
        return this;
    }
    repeatUtterance(repeatString) {
        this.repeatString = `c.RepeatUtterance=${repeatString}`;
        return this;
    }
    error(intentName) {
        this.errorString = `c.Error=1&c.ErrorName=${intentName}`;
        return this;
    }
    visitNumber(visits) {
        this.visits = '' + visits;
        return this;
    }
    firstTime() {
        this.firstTimeVisit = `c.a.InstallEvent=1&c.a.InstallDate=${moment().format('YYYY-MM-DD')}`;
        return this;
    }
    buildUrl() {
        // these are mandatory for everything
        this.url += this.userID + '&';
        this.url += this.appID + '&';
        if (!!this.firstTimeVisit)
            this.url += this.firstTimeVisit + '&';
        if (!!this.launch)
            this.url += this.launch + '&';
        if (!!this.intent)
            this.url += this.intent + '&';
        if (!!this.page)
            this.url += this.page + '&';
        if (!!this.deviceString)
            this.url += this.deviceString + '&';
        if (!!this.initialString)
            this.url += this.initialString + '&';
        if (!!this.repeatString)
            this.url += this.repeatString + '&';
        if (!!this.visits)
            this.url += this.visits + '&';
        // will remove last & at the end
        this.url = this.url.substring(0, this.url.length - 1);
        console.log(` analytics url: ${this.url}`);
        return this.url;
    }
}
exports.default = AnalyticsBuilder;
//# sourceMappingURL=AnalyticsBuilder.js.map