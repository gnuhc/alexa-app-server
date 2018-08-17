import HandlerBase from './HandlerBase';
import AlexaDeviceUtil from '../utils/AlexaDeviceUtil';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import { AlexaObject } from 'alexa-sdk';
import StoreUtil from '../../../shared/utils/StoreUtil';
import AgentConstants from '../../../shared/AgentConstants';

export default class NoIntentHandler extends HandlerBase {

  constructor(alexa: AlexaObject<any>) {
    super(alexa);
  }

  async respond() {
    const alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
    const data = new DynamoDBUtil(this.alexa);
    const deviceUtil = new AlexaDeviceUtil(this.event);

    this.user = await data.findOrInitiate(this.alexaUserId);

    if (this.user.saved) {
      let attr = await data.findAttributes(this.alexaUserId);
      this.user.attr = JSON.parse(attr);
      this.alexa.attributes = JSON.parse(attr);
      alexaConvo.alexa.attributes = this.alexa.attributes;
    }

    if (alexaConvo.alexa.attributes.faqIntent) {
      this.alexa.handler.state == '';
      alexaConvo.removeFromStorage('faqIntent');
      data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
      if (alexaConvo.hasStorage(AgentConstants.STORAGE_SAVED_STORE_KEY)) {
        this.alexa.emit(':tell', 'Okay, talk to you soon!');
      } else if (alexaConvo.hasStorage(AgentConstants.STORAGE_MOST_RECENT_STORE_KEY)) {
        this.alexa.handler.state == 'EXIT';
        this.alexa.emitWithState('ExitQuestionIntent');        
      } else {
        this.alexa.emit(':tell', 'Okay, bye!');
      }
    } else if (this.alexa.handler.state == 'EVENTS_MAIN_NOT_EXIST') {
      this.alexa.handler.state == 'EXIT';
      this.alexa.emitWithState('ExitQuestionIntent');
    } else if (this.alexa.handler.state == 'EVENTS_MAIN_ONE_EXIST') {
      this.alexa.handler.state == 'EXIT';
      this.alexa.emitWithState('ExitQuestionIntent');
    } else {
      this.alexa.emit(':ask', 'You can say more to hear more about this event or say next to hear about the next event or ask for a different location or say stop to exit',
                              'You can say more to hear more about this event or say next to hear about the next event or ask for a different location or say stop to exit');
    }
  }
}
