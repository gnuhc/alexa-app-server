import HandlerBase from './HandlerBase';
import AlexaDeviceUtil from '../utils/AlexaDeviceUtil';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import { AlexaObject } from 'alexa-sdk';
import StoreUtil from '../../../shared/utils/StoreUtil';

export default class FindLocationSubHandler extends HandlerBase {

  constructor(alexa: AlexaObject<any>) {
    super(alexa);
  }

  async respond() {
    const alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
    const data = new DynamoDBUtil(this.alexa);

    this.user = await data.findOrInitiate(this.alexaUserId);

    if (this.user.saved) {
      let attr = await data.findAttributes(this.alexaUserId);
      this.user.attr = JSON.parse(attr);
      this.alexa.attributes = JSON.parse(attr);
      alexaConvo.alexa.attributes = this.alexa.attributes;
    }
    
    alexaConvo.saveToStorage('fallbackCount', 0);
    alexaConvo.saveToStorage('subIntent', true);
    data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);

    this.alexa.emit(':ask', 'Where would you like to shop? Give me a City and State or a zip code.',
    	                    'Where would you like to shop? Give me a City and State or a zip code.');
  }
}
