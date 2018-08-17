import HandlerBase from './HandlerBase';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import ForgetDialogFactory from '../../../shared/dialog/ForgetDialogFactory';
import AgentConstants from '../../../shared/AgentConstants';

export default class ForgetHandler extends HandlerBase {

  constructor(alexa: any) {
    super(alexa);
  }

  async respond() {
    let alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
    const data = new DynamoDBUtil(this.alexa);

    this.user = await data.findOrInitiate(this.alexaUserId);

    if (this.user.saved) {
        const attr = await data.findAttributes(this.alexaUserId);
        this.user.attr = JSON.parse(attr);
        this.alexa.attributes = JSON.parse(attr);
        alexaConvo.alexa.attributes = this.alexa.attributes;
    }

    alexaConvo.saveToStorage('fallbackCount', 0);
    if (alexaConvo.getStorage('saved_store')) {
      this.alexa.handler.state = 'EVENTS_EXIST';
      alexaConvo.removeFromStorage(AgentConstants.STORAGE_SAVED_STORE_KEY);
      data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
      this.alexa.emit(':ask', ForgetDialogFactory.askForget(), ForgetDialogFactory.askForget());
    } else {
      this.alexa.handler.state = 'EVENTS_EXIST';
      data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
      this.alexa.emit(':ask', ForgetDialogFactory.askNotForget(), ForgetDialogFactory.askNotForget());
    }
  }
}
