"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnalyticsPathBuilder {
    constructor() {
        this.url = '';
        this.userID = '';
        this.appID = '';
        this.mainString = '';
        //http://macys.sc.omtrdc.net/b/ss/macysmcomvoiceappdev/0?vid=[User id]&c.a.AppID=Macys&c.a.LaunchEvent=1&c.Intent=Store_Hours_Intent&pageName=Store_Hours_Intent&c.Device=[google home, google assistant, alexa]&c.InitialUtterance=[initial utterance]
        /*
            HandlerBuilder
                .setupDefaults()
                .launchRequest()
                .findHoursIntent()
                .findStoreIntent()
                .build() return an obj
         */
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
        this.userID = `vid=` + id;
        this.mainString += this.userID;
        return this;
    }
    putAppID(id) {
        this.appID = `&c.a.AppID=Macys` + id;
        this.mainString += this.appID;
        return this;
    }
    build() {
        return this.mainString;
    }
}
exports.default = AnalyticsPathBuilder;
//# sourceMappingURL=AnalyticsPathBuilder.js.map