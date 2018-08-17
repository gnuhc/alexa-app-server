import HandlerBase from './HandlerBase';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import ExitDialogFactory from '../../../shared/dialog/ExitDialogFactory';

export default class ExitQuestionHandler extends HandlerBase {

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

    if (alexaConvo.hasStorage('saved_store')) {
      this.alexa.emit(':tell', ExitDialogFactory.sayGoodByeSavedBefore());
    } else if (alexaConvo.hasStorage('most_recent_store')) {
      this.alexa.handler.state = 'EXIT';
      this.alexa.emit(':ask', ExitDialogFactory.getExitQuestion());
    } else {
      this.alexa.emit(':tell', 'Ok, Goodbye');
    }
  }
}
