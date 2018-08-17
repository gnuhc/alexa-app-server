import HandlerBase from './HandlerBase';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import AgentConstants from '../../../shared/AgentConstants';
import AgentHelpFactory from '../../../shared/dialog/AgentHelpFactory';

export default class RepeatHandler extends HandlerBase {

  constructor(alexa: any) {
    super(alexa);
  }

  async respond() {
    const alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
    const data = new DynamoDBUtil(this.alexa);

    this.user = await data.findOrInitiate(this.alexaUserId);

    if (this.user.saved) {
        const attr = await data.findAttributes(this.alexaUserId);
        this.user.attr = JSON.parse(attr);
        this.alexa.attributes = JSON.parse(attr);
        alexaConvo.alexa.attributes = this.alexa.attributes;
    }
    let response = '';
    alexaConvo.saveToStorage('fallbackCount', 0);
    
    if (alexaConvo.getStorage(AgentConstants.STORAGE_REPEAT_KEY) || alexaConvo.getStorage(AgentConstants.STORAGE_REPEAT_KEY) != '') {
      response = alexaConvo.getStorage(AgentConstants.STORAGE_REPEAT_KEY);
    } else {
      response = AgentHelpFactory.getNoRepeat();
    }
    this.alexa.emit(':ask', response, response);
  }
}
