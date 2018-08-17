"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigConstants_1 = require("../shared/ConfigConstants");
const AgentConstants_1 = require("../shared/AgentConstants");
class AlexaConvoImpl {
    constructor(alexa) {
        this.alexa = alexa;
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
        return this.alexa.emit(':ask', str);
    }
    getEntity(key) {
        // Since ENTITY_ADDRESS_KEY is not an actual entity in Alexa, faking as an entity when actually getting from storage
        if (key === AgentConstants_1.default.ENTITY_ADDRESS_KEY) {
            return this.alexa.attributes.address;
        }
        if (key === AgentConstants_1.default.ENTITY_ZIPCODE_KEY) {
            return this.alexa.attributes.zipcode;
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
    askForPermission() {
        return this.alexa.emit(':tellWithPermissionCard', ConfigConstants_1.default.PERM, ['read::alexa:device:all:address']);
    }
    setContextForStores() {
        // TODO
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
    deleteFromStorage(key) {
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
        if (this.alexa.attributes.hasOwnProperty(AgentConstants_1.default.STORAGE_REPEAT_KEY)) {
            delete this.alexa.attributes.repeat;
        }
    }
}
exports.default = AlexaConvoImpl;
//# sourceMappingURL=AlexaConvoImpl.js.map