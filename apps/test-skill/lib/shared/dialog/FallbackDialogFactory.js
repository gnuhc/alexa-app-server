"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FallbackDialogFactory {
    static sayAddressStop() {
        return `You can say a city and state, or zipcode, or say stop to exit`;
    }
    static sayEventsLocationExit() {
        return `You can say store events to hear about events, or ask for another location, or say stop to exit`;
    }
    static sayLocationStop() {
        return `You can ask for another location, or say stop to exit`;
    }
    static sayMoreNextDifferentStop() {
        return `You can say more to hear more about this event, or say next to hear about the next event, or ask for a different location or say stop to exit`;
    }
    static sayMoreDifferentStop() {
        return `You can say more to hear more about this event, or ask for a different location, or say stop to exit`;
    }
    static sayDifferentStop() {
        return `You can ask for different location, or say stop to exit`;
    }
}
exports.default = FallbackDialogFactory;
//# sourceMappingURL=FallbackDialogFactory.js.map