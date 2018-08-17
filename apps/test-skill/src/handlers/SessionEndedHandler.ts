import HandlerBase from './HandlerBase';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import AgentConstants from '../../../shared/AgentConstants';

export default class SessionEndedHandler extends HandlerBase {

  constructor(alexa: any) {
    super(alexa);
  }

  async respond() {
  	const data = new DynamoDBUtil(this.alexa);

  	let attr = await data.findAttributes(this.alexaUserId);
    if (!!this.alexa.attributes) {
      this.alexa.attributes = JSON.parse(attr);

      if (this.alexa.attributes.hasOwnProperty(AgentConstants.ENTITY_ADDRESS_KEY)) {
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
      if (this.alexa.attributes.hasOwnProperty('hoursIntent')) {
        delete this.alexa.attributes.hoursIntent;
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
      if (this.alexa.attributes.hasOwnProperty(AgentConstants.STORAGE_REPEAT_KEY)) {
        delete this.alexa.attributes.repeat;
      }
      if (this.alexa.attributes.hasOwnProperty(AgentConstants.STORAGE_EVENT_INDEX_KEY)) {
        delete this.alexa.attributes.event_index;
      }
      if (this.alexa.attributes.hasOwnProperty(AgentConstants.STORAGE_EVENTS_LEFT_KEY)) {
        delete this.alexa.attributes.events_left;
      }     
    	data.updateUser(this.alexaUserId, this.alexa.attributes, this.user);
    }

    this.alexa.handler.state = '';
  }
}
