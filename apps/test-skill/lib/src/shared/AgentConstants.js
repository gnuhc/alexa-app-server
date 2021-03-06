"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AgentConstants {
}
AgentConstants.ENTITY_ADDRESS_KEY = 'address';
AgentConstants.ENTITY_ZIPCODE_KEY = 'zipcode';
AgentConstants.STORAGE_MOST_RECENT_STORE_KEY = 'most_recent_store';
AgentConstants.STORAGE_SAVED_STORE_KEY = 'saved_store';
AgentConstants.STORAGE_REPEAT_KEY = 'repeat';
AgentConstants.STORAGE_USER_COORDINATES = 'user_coordinates';
AgentConstants.STORAGE_DISTANCE = 'distance';
AgentConstants.STORAGE_ADDRESS_COORDINATES = 'address_coordinates';
AgentConstants.STORAGE_NEAR_STORE_INTENT = 'nearStoreIntent';
AgentConstants.STORAGE_EVENT_INDEX_KEY = 'event_index';
AgentConstants.STORAGE_EVENTS_LEFT_KEY = 'events_left';
AgentConstants.INTENT_WELCOME = 'Default Welcome Intent';
AgentConstants.INTENT_REPEAT = 'output.repeat';
AgentConstants.INTENT_EVENTS = 'find_events';
AgentConstants.INTENT_NEXT_EVENT = 'find_events_next';
AgentConstants.INTENT_MORE_EVENT_INFO = 'find_events_more';
AgentConstants.INTENT_DIFFERENT_EVENT = 'find_events_different';
AgentConstants.INTENT_FAQ = 'find_faq';
AgentConstants.INTENT_HOURS = 'find_hours';
AgentConstants.INTENT_STORE = 'find_store';
AgentConstants.INTENT_AFFIRMATIONS = 'affirmations';
AgentConstants.INTENT_EXIT_ASK = 'exit_ask';
AgentConstants.INTENT_EXIT_YES = 'exit_yes';
AgentConstants.INTENT_EXIT_NO = 'exit_no';
AgentConstants.INTENT_PERMISSION = 'actions.intent.PERMISSION';
AgentConstants.INTENT_DELETE = 'delete';
// GOOGLE
AgentConstants.INTENT_FIND_STORE_YES = 'find_store_yes';
AgentConstants.CONTEXT_STORE_FIND_ANOTHER_LOCATION = AgentConstants.INTENT_FIND_STORE_YES;
AgentConstants.CONTEXT_EVENTS_DIFFERENT_LOCATION = 'find_locations_event';
exports.default = AgentConstants;
//# sourceMappingURL=AgentConstants.js.map