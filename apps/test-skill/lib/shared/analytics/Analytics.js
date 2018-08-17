"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsBuilder_1 = require("./AnalyticsBuilder");
const AgentConstants_1 = require("../AgentConstants");
const node_fetch_1 = require("node-fetch");
class Analytics {
    static firstTimeVisitTag(conv) {
        this.urlBuffer.push(AnalyticsBuilder_1.default
            .Builder()
            .userId(conv.getUserId())
            .firstTime()
            .device(conv.getDeviceType())
            .pageName(this.INSTALL_TAG)
            .buildUrl());
    }
    static welcomeIntentTag(conv) {
        this.urlBuffer.push(AnalyticsBuilder_1.default
            .Builder()
            .userId(conv.getUserId())
            .launchEvent()
            .intentName(conv.getIntentName())
            .pageName(conv.getIntentName())
            .device(conv.getDeviceType())
            .initialUtterance(conv.getInitialUtterance())
            .visitNumber(conv.getStorageOrDefault(AgentConstants_1.default.STORAGE_APP_VISITS, 1))
            .buildUrl());
    }
    static repeatIntentTag(conv) {
        this.urlBuffer.push(AnalyticsBuilder_1.default
            .Builder()
            .userId(conv.getUserId())
            .intentName(conv.getIntentName())
            .pageName(conv.getIntentName())
            .device(conv.getDeviceType())
            .repeatUtterance(conv.getStorageOrDefault(AgentConstants_1.default.STORAGE_REPEAT_KEY, ''))
            .buildUrl());
    }
    static defaultIntentTag(conv) {
        this.urlBuffer.push(AnalyticsBuilder_1.default
            .Builder()
            .userId(conv.getUserId())
            .launchEvent()
            .intentName(conv.getIntentName())
            .pageName(conv.getIntentName())
            .device(conv.getDeviceType())
            .initialUtterance(conv.getInitialUtterance())
            .buildUrl());
    }
    static sendTags() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("TEMP URL: " + JSON.stringify(yield node_fetch_1.default('http://macys.sc.omtrdc.net/b/ss/macysmcomvoiceappdev/0?vid=111111111111111111&c.a.AppID=Macys&c.a.LaunchEvent=1&c.Intent=Store_Location_Intent&pageName=Store_Location_Intent&c.Device=alexa&c.InitialUtterance=hi')));
            this.urlBuffer.forEach((value) => __awaiter(this, void 0, void 0, function* () {
                //console.log("SEND TAGS")
                console.log(yield node_fetch_1.default(value));
            }));
        });
    }
}
Analytics.INSTALL_TAG = 'install';
// url buffer only lives the length of the google cloud functions
// so this data will reset across each back&forth conversation
Analytics.urlBuffer = [];
exports.default = Analytics;
//# sourceMappingURL=Analytics.js.map