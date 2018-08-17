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
const Coordinate_1 = require("../models/Coordinate");
const MacysFetchObservable_1 = require("./MacysFetchObservable");
const ConfigConstants_1 = require("../ConfigConstants");
const MacysEvent_1 = require("../models/events/MacysEvent");
const EventsDialogFactory_1 = require("../dialog/EventsDialogFactory");
const AgentConstants_1 = require("../AgentConstants");
const StoreDialogFactory_1 = require("../dialog/StoreDialogFactory");
const ConvoResponse_1 = require("../agent/ConvoResponse");
class StoreUtil {
    static nameToStore(name) {
        const url = ConfigConstants_1.default.MACYS_STORES_ENDPOINT + `searchAddress=${name}`;
        return MacysFetchObservable_1.default
            .fetch(url)
            .map(res => res.stores.store[0]);
    }
    static coordinateToStores(coordinate) {
        const url = ConfigConstants_1.default.MACYS_STORES_ENDPOINT + `latitude=${coordinate.latitude}&longitude=${coordinate.longitude}`;
        return MacysFetchObservable_1.default
            .fetch(url)
            .map(res => res.stores.store);
    }
    static coordinateToSingleStore(coordinate) {
        const url = ConfigConstants_1.default.MACYS_STORES_ENDPOINT + `latitude=${coordinate.latitude}&longitude=${coordinate.longitude}`;
        return MacysFetchObservable_1.default
            .fetch(url)
            .map(res => res.stores.store[0]);
    }
    static getStoreEvents(store) {
        return MacysFetchObservable_1.default.fetch(ConfigConstants_1.default.MACYS_EVENTS_ENDPOINT_TEMP + store.storeNumber)
            .flatMap(it => it) // arrays of obj, to stream of objs
            .map(it => new MacysEvent_1.default(it)) // do this so we store only what we pass to the constructor
            .toArray();
    }
    static storeToEvents(conv) {
        return this.createStoreObservableFromConvo(conv).flatMap(store => StoreUtil.getStoreEvents(store));
    }
    /*
        - first condition will always be true for alexa
        - google first condition will not be true if
            - user saved location is their default google location vs a 'random saved store'
    */
    static createStoreObservableFromConvo(conv) {
        // did the user give an address
        const isAddress = conv.getEntity(AgentConstants_1.default.ENTITY_ADDRESS_KEY);
        const isZipcode = conv.getEntity(AgentConstants_1.default.ENTITY_ZIPCODE_KEY);
        let store;
        console.log("ENTITY: " + JSON.stringify(isAddress));
        if (isAddress || isZipcode) {
            console.log("ADDRESS");
            // if address, return its entity, or else get zipcodes entity
            const entity = isAddress ? conv.getEntity(AgentConstants_1.default.ENTITY_ADDRESS_KEY)
                : conv.getEntity(AgentConstants_1.default.ENTITY_ZIPCODE_KEY);
            store = StoreUtil.nameToStore(entity);
        }
        // dont think google uses this?
        else if (conv.hasStorage(AgentConstants_1.default.STORAGE_NEAR_STORE_INTENT)) {
            console.log("NEAR");
            store = StoreUtil.coordinateToSingleStore(conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES));
        }
        // TODO// turn these into api calls since we need schedule of stores
        else if (conv.hasStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY)) {
            console.log("MRS HOURS");
            const st = conv.getStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY);
            store = StoreUtil.coordinateToSingleStore(new Coordinate_1.default(st.geoLocation.latitude, st.geoLocation.longitude));
        }
        else if (conv.hasStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY)) {
            console.log("SAVED");
            const st = conv.getStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY);
            store = StoreUtil.coordinateToSingleStore(new Coordinate_1.default(st.geoLocation.latitude, st.geoLocation.longitude));
        }
        // last case, if nothing matches, then we know the user has at least given us permission
        else {
            console.log("NOTHING");
            store = StoreUtil.coordinateToSingleStore(conv.getStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES));
        }
        return store.map(store => {
            conv.saveToStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY, store);
            return store;
        });
    }
    static launchStoreConvo(conv, ifMore) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield StoreUtil.createStoreObservableFromConvo(conv).toPromise();
            const events = yield StoreUtil.getStoreEvents(store).toPromise();
            conv.setContextForEvents(events.length);
            const storeResponseString = StoreDialogFactory_1.default.getMainStoreResponse(conv, store);
            let finalResponse = '';
            conv.setContextForStores();
            // just asked hours or location of store
            if (events.length >= 1) {
                // if there are two or more events, we can accept next answers
                finalResponse = storeResponseString + StoreDialogFactory_1.default.storeAskEvents();
            }
            else {
                finalResponse = storeResponseString + StoreDialogFactory_1.default.storeAskLocation();
            }
            if (!!ifMore)
                ifMore(finalResponse, store);
            return ConvoResponse_1.default.createConvoPromiseResponse(finalResponse);
        });
    }
    static launchEventConvo(conv, fromStoreIntent, ifMore) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield StoreUtil.createStoreObservableFromConvo(conv).toPromise();
            const events = yield StoreUtil.getStoreEvents(store).toPromise();
            conv.setContextForEvents(events.length);
            let finalResponse = '';
            if (fromStoreIntent) {
                finalResponse += StoreDialogFactory_1.default.getMainStoreResponse(conv, store);
            }
            if (events.length > 1) {
                conv.saveToStorage(AgentConstants_1.default.STORAGE_EVENT_INDEX_KEY, 0);
                conv.saveToStorage(AgentConstants_1.default.STORAGE_EVENTS_LEFT_KEY, events.length - 1);
                if (conv.getStorage('find_location_event')) {
                    finalResponse += EventsDialogFactory_1.default.firstEvent_location(store, events[0]);
                }
                else if (conv.getStorage('most_recent_store')) {
                    finalResponse += EventsDialogFactory_1.default.firstEventWithNoAddressDialog(store, events[0]);
                }
                else {
                    finalResponse += EventsDialogFactory_1.default.firstEvent(store, events[0]);
                }
                finalResponse += EventsDialogFactory_1.default.multipleEventsAvailableAsk();
            }
            else if (events.length === 1) {
                finalResponse += EventsDialogFactory_1.default.firstEvent(store, events[0]) + EventsDialogFactory_1.default.noMoreAvailableEventsAsk();
            }
            else {
                finalResponse += EventsDialogFactory_1.default.noEventsAsk(conv, store);
            }
            if (!!ifMore)
                ifMore(finalResponse);
            return ConvoResponse_1.default.createConvoPromiseResponse(finalResponse);
        });
    }
    static launchNextEventConvo(conv, ifMore) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextEventIndex = conv.getStorage(AgentConstants_1.default.STORAGE_EVENT_INDEX_KEY) + 1;
            const eventsLeft = conv.getStorage(AgentConstants_1.default.STORAGE_EVENTS_LEFT_KEY);
            const store = conv.getStorage(AgentConstants_1.default.STORAGE_MOST_RECENT_STORE_KEY);
            const events = yield StoreUtil.storeToEvents(conv).toPromise();
            let finalResponse = '';
            console.log("EVENTS LISTING: " + JSON.stringify(events));
            conv.saveToStorage(AgentConstants_1.default.STORAGE_EVENT_INDEX_KEY, nextEventIndex);
            conv.saveToStorage(AgentConstants_1.default.STORAGE_EVENTS_LEFT_KEY, eventsLeft - 1);
            conv.setContextForEvents(eventsLeft);
            // there will either be more events left
            // or one event left
            if (eventsLeft > 1) {
                finalResponse = EventsDialogFactory_1.default.nextEvent(store, events[nextEventIndex]) + EventsDialogFactory_1.default.multipleEventsAvailableAsk();
            }
            else {
                finalResponse = EventsDialogFactory_1.default.nextEvent(store, events[nextEventIndex]) + EventsDialogFactory_1.default.noMoreAvailableEventsAsk();
            }
            if (!!ifMore)
                ifMore(finalResponse);
            return ConvoResponse_1.default.createConvoPromiseResponse(finalResponse);
        });
    }
    static launchMoreAboutEventConvo(conv, ifMore) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = yield StoreUtil.storeToEvents(conv).toPromise();
            const currentIndex = +conv.getStorage(AgentConstants_1.default.STORAGE_EVENT_INDEX_KEY);
            const eventsLeft = events.length - 1 - currentIndex;
            console.log("EVENTS LENGTH: " + JSON.stringify(events.length));
            console.log("EVENTS LEFT: " + JSON.stringify(eventsLeft));
            console.log("EVENTS INDEX: " + JSON.stringify(currentIndex));
            const storeDesc = (events[currentIndex].description).replace(/(\&reg;|\&|\$)/gm, '');
            if (eventsLeft === 1) {
                conv.setContextForEvents(eventsLeft + 1);
            }
            else {
                conv.setContextForEvents(eventsLeft);
            }
            let finalResponse = '';
            if (eventsLeft >= 1) {
                finalResponse = storeDesc + ' ' + EventsDialogFactory_1.default.multipleEventsAvailableAskFromMore();
            }
            else {
                finalResponse = storeDesc + ' ' + EventsDialogFactory_1.default.noMoreEventsFromMore();
            }
            if (!!ifMore)
                ifMore(finalResponse);
            return ConvoResponse_1.default.createConvoPromiseResponse(finalResponse);
        });
    }
}
exports.default = StoreUtil;
//# sourceMappingURL=StoreUtil.js.map