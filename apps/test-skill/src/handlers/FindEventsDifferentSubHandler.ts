import HandlerBase from './HandlerBase';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';

export default class FindEventsDifferentSubHandler extends HandlerBase {

  constructor(alexa: any) {
    super(alexa);
  }

  async respond() {
    const alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
  	const data = new DynamoDBUtil(this.alexa);

  	let attr = await data.findAttributes(this.alexaUserId);
    this.alexa.attributes = JSON.parse(attr);
    alexaConvo.alexa.attributes = this.alexa.attributes;

    alexaConvo.alexa.attributes.find_location_event = true;
    alexaConvo.saveToStorage('find_location_event', true);
    alexaConvo.saveToStorage('subIntent', true);
    alexaConvo.saveToStorage('fallbackCount', 0);

  	data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);

    this.alexa.emit(':ask', 'What location are you interested in? Tell me a City and State or a zip code.',
                            'What location are you interested in? Tell me a City and State or a zip code.');  
  }
}
