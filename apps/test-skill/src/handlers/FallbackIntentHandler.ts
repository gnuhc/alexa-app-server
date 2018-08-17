import HandlerBase from './HandlerBase';
import AlexaDeviceUtil from '../utils/AlexaDeviceUtil';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import FallbackDialogFactory from '../../../shared/dialog/FallbackDialogFactory';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import { AlexaObject } from 'alexa-sdk';
import StoreUtil from '../../../shared/utils/StoreUtil';

export default class FallbackIntentHandler extends HandlerBase {

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

alexaConvo.saveToStorage('fallbackCount', alexaConvo.getStorage('fallbackCount') + 1);

if (alexaConvo.getStorage('fallbackCount') === 3) {
  //alexaConvo.saveToStorage('fallbackCount', alexaConvo.getStorage('fallbackCount') + 1);
  this.alexa.emit(':ask', 'I don’t understand your question, but I’d like to. How about trying the help menu? Just say, “help”. ');
} else if (alexaConvo.getStorage('fallbackCount') === 4) {
  alexaConvo.saveToStorage('fallbackCount', 0);
  this.alexa.emit(':tell', '');
} else {
  //alexaConvo.saveToStorage('fallbackCount', alexaConvo.getStorage('fallbackCount') + 1);
  if (alexaConvo.getStorage('subIntent')) {
    this.alexa.emit(':ask', 'Sorry, I didn’t catch that. To find a store, I need to hear both a city and a state, or a valid 5-digit zip code. ');
  } else {
    this.alexa.emit(':ask', 'Sorry, I didn’t get that. I can repeat what we were just chatting about, or give you our help menu. Say “repeat”, or “help”.');
  }
}

    // if (alexaConvo.getStorage('subIntent')) {
    //   this.alexa.emit(':ask', FallbackDialogFactory.sayAddressStop(), FallbackDialogFactory.sayAddressStop());     
    // } else if (this.alexa.handler.state == 'EVENTS_EXIST') {
    //   this.alexa.emit(':ask', FallbackDialogFactory.sayEventsLocationExit(), FallbackDialogFactory.sayEventsLocationExit());
    // } else if (this.alexa.handler.state == 'EVENTS_NOT_EXIST') {
    //   this.alexa.emit(':ask', FallbackDialogFactory.sayLocationStop(), FallbackDialogFactory.sayLocationStop());
    // } else if (this.alexa.handler.state == 'EVENTS_MAIN_EXIST') {
    //   this.alexa.emit(':ask', FallbackDialogFactory.sayMoreNextDifferentStop(), FallbackDialogFactory.sayMoreNextDifferentStop());
    // } else if (this.alexa.handler.state == 'EVENTS_MAIN_ONE_EXIST') {
    //   this.alexa.emit(':ask', FallbackDialogFactory.sayMoreDifferentStop(), FallbackDialogFactory.sayMoreDifferentStop());      
    // } else if (this.alexa.handler.state == 'EVENTS_MAIN_NOT_EXIST') {
    //   this.alexa.emit(':ask', FallbackDialogFactory.sayDifferentStop(), FallbackDialogFactory.sayDifferentStop());
    // }
    data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
  }
}
