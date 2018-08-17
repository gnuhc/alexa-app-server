import HandlerBase from './HandlerBase';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import AgentConstants from '../../../shared/AgentConstants';
import ForgetDialogFactory from '../../../shared/dialog/ForgetDialogFactory';
import ExitDialogFactory from '../../../shared/dialog/ExitDialogFactory';

export default class ExitNoHandler extends HandlerBase {

  constructor(alexa: any) {
    super(alexa);
  }

  async respond() {
    let alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
  	const data = new DynamoDBUtil(this.alexa);

  	let attr = await data.findAttributes(this.alexaUserId);
    this.alexa.attributes = JSON.parse(attr);

    alexaConvo.removeFromStorage(AgentConstants.STORAGE_MOST_RECENT_STORE_KEY);
    alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
    alexaConvo.removeFromStorage('nearStoreIntent');
    alexaConvo.removeFromStorage('storeIntent');
    alexaConvo.removeFromStorage('eventsIntent');
    alexaConvo.removeFromStorage('hoursIntent');
    alexaConvo.removeFromStorage(AgentConstants.STORAGE_EVENT_INDEX_KEY);
    alexaConvo.removeFromStorage(AgentConstants.STORAGE_EVENTS_LEFT_KEY);
    alexaConvo.removeFromStorage(AgentConstants.STORAGE_REPEAT_KEY);
            
  	data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);

    this.alexa.emit(':tell', ExitDialogFactory.sayGoodByeNotSaved());
  }
}
