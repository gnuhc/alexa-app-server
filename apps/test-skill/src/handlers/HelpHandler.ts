import HandlerBase from './HandlerBase';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import AgentHelpFactory from '../../../shared/dialog/AgentHelpFactory';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AgentConstants from '../../../shared/AgentConstants';
import Analytics from '../../../shared/analytics/Analytics';

export default class HelpHandler extends HandlerBase {

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

    if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
      alexaConvo.preDelete();
    }
    
    alexaConvo.saveToStorage('fallbackCount', 0);
    let response = AgentHelpFactory.getHelp(alexaConvo);
    alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, response);
    data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
    return alexaConvo.ask(response);
  }
}
