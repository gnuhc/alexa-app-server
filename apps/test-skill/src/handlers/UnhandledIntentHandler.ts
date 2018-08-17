import HandlerBase from './HandlerBase';
import AlexaDeviceUtil from '../utils/AlexaDeviceUtil';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import { AlexaObject } from 'alexa-sdk';
import StoreUtil from '../../../shared/utils/StoreUtil';

export default class UnhandledIntentHandler extends HandlerBase {

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

    if (alexaConvo.getStorage('subIntent')) {
      alexaConvo.ask('You can say a city and state or zipcode or say stop to exit');     
    } else if (this.alexa.handler.state == 'EVENTS_EXIST') {
      alexaConvo.ask('You can say store events to hear about events or ask for another location or say stop to exit');
    } else if (this.alexa.handler.state == 'EVENTS_NOT_EXIST') {
      alexaConvo.ask('You can ask for another location or say stop to exit');
    } else if (this.alexa.handler.state == 'EVENTS_MAIN_EXIST') {
      alexaConvo.ask('You can say more to hear more about this event or say next to hear about the next event or ask for a different location or say stop to exit');
    } else if (this.alexa.handler.state == 'EVENTS_MAIN_ONE_EXIST') {
      alexaConvo.ask('You can say more to hear more about this event or ask for a different location or say stop to exit');      
    } else if (this.alexa.handler.state == 'EVENTS_MAIN_NOT_EXIST') {
      alexaConvo.ask('You can ask for different location or say stop to exit');
    }
  }
}
