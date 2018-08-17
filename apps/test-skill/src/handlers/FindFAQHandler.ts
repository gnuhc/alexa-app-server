import HandlerBase from './HandlerBase';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import FaqDialogFactory from '../../../shared/dialog/FaqDialogFactory';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AgentConstants from '../../../shared/AgentConstants';
import Analytics from '../../../shared/analytics/Analytics';

export default class FindFAQHandler extends HandlerBase {

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
    
  	let entity = '';
    let response = '';

    if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
      alexaConvo.preDelete();
    }

    alexaConvo.saveToStorage('fallbackCount', 0);
    
  	if (!(this.alexa.event.request.intent.slots.faqslot).hasOwnProperty('resolutions')) {
      return alexaConvo.ask(FaqDialogFactory.globalHelpResponse());
  	}

    entity = this.alexa.event.request.intent.slots.faqslot.resolutions.resolutionsPerAuthority[0].values[0].value.name;

    if (entity) {
        if (entity === 'rewards') {
            response = FaqDialogFactory.starRewardsResponseSSML();
        } else if (entity === 'returns') {
            response = FaqDialogFactory.returnPolicy();
        } else {
            response = FaqDialogFactory.globalHelpResponse();
        }
    } else {
        response = FaqDialogFactory.globalHelpResponse();
    }
    this.alexa.handler.state = 'FAQ';
    alexaConvo.saveToStorage('faqIntent', true);
    response += ' Can I help you with anything else today?';
    alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, response);
    data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
    return alexaConvo.ask(response);
  }
}
