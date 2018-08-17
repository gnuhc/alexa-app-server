"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventTime_1 = require("../models/events/EventTime");
const AgentConstants_1 = require("../AgentConstants");
class EventsDialogFactory {
    // should make sure before calling these functions
    // that datetimes is not undefined, if it is, there arent any events
    static firstEvent(store, event) {
        const eventTitle = (event.title).replace(/(\&reg;|\&)/gm, '');
        return `${store.name} located at ${store.address.city}, ${store.address.state} has a special event scheduled 
                ${EventsDialogFactory.checkIfEventIsToday(event)} at ${event.datetimes[0].event_time}. 
                The name of the event is ${eventTitle}. `;
    }
    static firstEventWithNoAddressDialog(store, event) {
        const eventTitle = (event.title).replace(/(\&reg;|\&)/gm, '');
        return `${store.name} has a special event scheduled 
                ${EventsDialogFactory.checkIfEventIsToday(event)} at ${event.datetimes[0].event_time}. 
                The name of the event is ${eventTitle}. `;
    }
    static firstEvent_location(store, event) {
        const eventTitle = (event.title).replace(/(\&reg;|\&)/gm, '');
        return `Great. I recommend ${store.name} at ${store.address.city}, ${store.address.state}. There\'s an event scheduled on  
                ${EventsDialogFactory.checkIfEventIsToday(event)} at ${event.datetimes[0].event_time}. 
                The name of the event is ${eventTitle}. `;
    }
    static nextEvent(store, event) {
        const eventTitle = (event.title).replace(/(\&reg;|\&)/gm, '');
        return `The next special event at ${store.name} is scheduled 
                ${EventsDialogFactory.checkIfEventIsToday(event)} at ${event.datetimes[0].event_time}. 
                The name of the event is "${eventTitle}". `;
    }
    static noMoreEvents() {
        return 'You can ask to hear more about this event, or ask to find a different location.';
    }
    static noMoreEventsFromMore() {
        return `There are no other events currently scheduled at this store. 
                Would you like to check on events at a different location?`;
    }
    static multipleEventsAvailableAsk() {
        return 'You can ask to hear more about this event, ask to ' +
            'hear about the next scheduled event, or ask to find a different location.';
    }
    static multipleEventsAvailableAskFromMore() {
        return `Now you can ask to hear about the next event scheduled at this store, 
                or ask to find a different location.`;
    }
    /* these public statics below are mainly for the intro events intent */
    static noMoreAvailableEventsAsk() {
        return 'There are no other events currently scheduled at this store. ' +
            'You can ask to hear more about this event, or ask to find a different location.';
    }
    static noEventsAsk(conv, store) {
        let response = '';
        if (!!store) {
            response = `Currently, there are no special events scheduled at stores in ${store.name}. 
                        Would you like to check on events at a different location?`;
        }
        else if (conv.getStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY)) {
            response = `Currently, there are no special events scheduled at stores in ${store.name}. 
                        Would you like to check on events at a different location?`;
        }
        else {
            response = `Currently, there are no special events scheduled at stores in that area. 
                        Would you like to check on events at a different location?`;
        }
        return response;
    }
    /*  ---------------------------------------------------------------- */
    static checkIfEventIsToday(event) {
        // when grabbing from apis, we only get objects
        // to use funcitons on those objects, we actually need to create those class instances
        const time = new EventTime_1.default(event.datetimes[0]);
        if (time.isToday()) {
            return 'today';
        }
        return ` ${time.event_date}`;
    }
}
exports.default = EventsDialogFactory;
//# sourceMappingURL=EventsDialogFactory.js.map