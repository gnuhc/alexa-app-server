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
const ConfigConstants_1 = require("../../../shared/ConfigConstants");
const AgentConstants_1 = require("../../../shared/AgentConstants");
const AgentHelpFactory_1 = require("../../../shared/dialog/AgentHelpFactory");
const Analytics_1 = require("../../../shared/analytics/Analytics");
class AlexaConvoImpl {
    constructor(alexa, userId, event) {
        this.alexa = alexa;
        this.userId = userId;
        this.event = event;
    }
    onStart() {
        return __awaiter(this, void 0, void 0, function* () {
            // users dont have to launch default welcome intent to launch the app the first time
            // they could say 'talk to macys and find nearby events'
            if (this.alexa.event.request.type === AgentConstants_1.default.INTENT_LAUNCH_ALEXA) {
                console.log("ANALYTICS LAUNCH");
                if (this.getStorageOrDefault(AgentConstants_1.default.STORAGE_APP_VISITS, 0) === 0) {
                    console.log("ANALYTICS FIRST TIME");
                    Analytics_1.default.firstTimeVisitTag(this);
                }
                Analytics_1.default.welcomeIntentTag(this);
            }
            else if (this.alexa.event.request.type === AgentConstants_1.default.INTENT_REQUEST_ALEXA) {
                console.log("ANALYTICS: " + JSON.stringify(this.alexa.event.request));
                if (this.alexa.event.request.intent.name === AgentConstants_1.default.INTENT_REPEAT) {
                    console.log("ANALYTICS REPEAT");
                    Analytics_1.default.repeatIntentTag(this);
                }
                else {
                    console.log("ANALYTICS INTENT");
                    Analytics_1.default.defaultIntentTag(this);
                }
            }
            else {
                console.log("ANALYTICS DEFAULT INTENT");
                Analytics_1.default.defaultIntentTag(this);
            }
        });
    }
    onStop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Analytics_1.default.sendTags();
        });
    }
    saveToStorage(key, val) {
        this.alexa.attributes[key] = val;
    }
    getStorage(key) {
        if (this.alexa.attributes.hasOwnProperty(key)) {
            return this.alexa.attributes[key];
        }
        else {
            return false;
        }
    }
    hasStorage(key) {
        return !!this.getStorage(key);
    }
    ask(str) {
        this.saveToStorage(AgentConstants_1.default.STORAGE_REPEAT_KEY, str);
        return this.alexa.emit(':ask', str, AgentHelpFactory_1.default.getReprompt());
    }
    close(str) {
        return this.alexa.emit(':tell', str);
    }
    getEntity(key) {
        // Since ENTITY_ADDRESS_KEY is not an actual entity in Alexa, faking as an entity when actually getting from storage
        if (key === AgentConstants_1.default.ENTITY_ADDRESS_KEY) {
            return this.alexa.attributes.address;
        }
        if (key === AgentConstants_1.default.ENTITY_ZIPCODE_KEY) {
            return this.alexa.attributes.zipcode;
        }
        if (key === AgentConstants_1.default.ENTITY_SAVED_STORE) {
            return this.alexa.attributes.entity_saved;
        }
        // Checks if slot exists before trying to access it
        if ((this.alexa.event.request.intent.slots).hasOwnProperty(key)) {
            return this.alexa.event.request.intent.slots[key].value;
        }
        else {
            return false;
        }
    }
    getZipEntity(key) {
        // Checks if slot exists before trying to access it
        if ((this.alexa.event.request.intent.slots).hasOwnProperty(key)) {
            return this.alexa.event.request.intent.slots[key].value;
        }
        else {
            return false;
        }
    }
    hasPermission() {
        return this.alexa.emit(':tellWithPermissionCard', ConfigConstants_1.default.PERM, ['read::alexa:device:all:address']);
    }
    setContextForStores() {
        // TODO
    }
    isNearbyRequest() {
        return this.hasStorage(AgentConstants_1.default.STORAGE_NEAR_STORE_INTENT);
    }
    getUserId() {
        return this.userId;
    }
    // TOOO - jong this will never be right?
    getInitialUtterance() {
        return '';
    }
    getIntentName() {
        if (this.alexa.event.request.type === AgentConstants_1.default.INTENT_LAUNCH_ALEXA) {
            return AgentConstants_1.default.INTENT_LAUNCH_ALEXA;
        }
        else {
            return this.alexa.event.request.intent.name;
        }
    }
    getStorageOrDefault(key, value) {
        if (this.hasStorage(key)) {
            return this.getStorage(key);
        }
        else {
            return value;
        }
    }
    getDeviceType() {
        const hasDisplay = this.event.context &&
            this.event.context.System &&
            this.event.context.System.device &&
            this.event.context.System.device.supportedInterfaces &&
            this.event.context.System.device.supportedInterfaces.Display;
        if (hasDisplay) {
            return 'noScreen';
        }
        else {
            return 'hasScreen';
        }
    }
    setContextForEvents(eventsLeft) {
        if (this.getStorage('nearStoreIntent')) {
            if (eventsLeft >= 1) {
                console.log('NEARSTOREINTENT EVENTS EXIST 111');
                this.saveToStorage('context', 'EVENTS_EXIST');
            }
            if (eventsLeft < 1) {
                console.log('NEARSTOREINTENT EVENTS NOT EXIST 222');
                this.saveToStorage('context', 'EVENTS_NOT_EXIST');
            }
        }
        else if (this.getStorage('storeIntent')) {
            if (eventsLeft >= 1) {
                console.log('STOREINTENT EVENTS EXIST 111');
                this.saveToStorage('context', 'EVENTS_EXIST');
            }
            if (eventsLeft < 1) {
                console.log('STOREINTENT EVENTS NOT EXIST 222');
                this.saveToStorage('context', 'EVENTS_NOT_EXIST');
            }
        }
        else if (this.getStorage('eventsIntent')) {
            if (eventsLeft > 1) {
                console.log('EVENTSINTENT EVENTS MAIN EXIST 333');
                this.saveToStorage('context', 'EVENTS_MAIN_EXIST');
                //this.saveToStorage('eventsIntent', false);
            }
            if (eventsLeft == 1) {
                console.log('EVENTSINTENT EVENTS MAIN ONE EXIST 444');
                this.saveToStorage('context', 'EVENTS_MAIN_ONE_EXIST');
                //this.saveToStorage('eventsIntent', false);
            }
            if (eventsLeft < 1) {
                console.log('EVENTSINTENT EVENTS MAIN NOT EXIST 555');
                this.saveToStorage('context', 'EVENTS_MAIN_NOT_EXIST');
                //this.saveToStorage('eventsIntent', false);
            }
        }
        else {
            console.log("NO CONTEXT");
        }
    }
    getType() {
        return 'skill';
    }
    hasEntity(key) {
        return !!this.getEntity(key);
    }
    removeFromStorage(key) {
        if (this.alexa.attributes.hasOwnProperty(key)) {
            delete this.alexa.attributes[key];
        }
    }
    preDelete() {
        if (this.alexa.attributes.hasOwnProperty('address')) {
            delete this.alexa.attributes.address;
        }
        if (this.alexa.attributes.hasOwnProperty('most_recent_store')) {
            delete this.alexa.attributes.most_recent_store;
        }
        if (this.alexa.attributes.hasOwnProperty('nearStoreIntent')) {
            delete this.alexa.attributes.nearStoreIntent;
        }
        if (this.alexa.attributes.hasOwnProperty('storeIntent')) {
            delete this.alexa.attributes.storeIntent;
        }
        if (this.alexa.attributes.hasOwnProperty('eventsIntent')) {
            delete this.alexa.attributes.eventsIntent;
        }
        if (this.alexa.attributes.hasOwnProperty('find_location_event')) {
            delete this.alexa.attributes.find_location_event;
        }
        if (this.alexa.attributes.hasOwnProperty('subIntent')) {
            delete this.alexa.attributes.subIntent;
        }
        if (this.alexa.attributes.hasOwnProperty('fallbackCount')) {
            delete this.alexa.attributes.fallbackCount;
        }
        if (this.alexa.attributes.hasOwnProperty(AgentConstants_1.default.STORAGE_REPEAT_KEY)) {
            delete this.alexa.attributes.repeat;
        }
    }
}
exports.default = AlexaConvoImpl;
//# sourceMappingURL=AlexaConvoImpl.js.map