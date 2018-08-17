import HandlerBase from './HandlerBase';
import AlexaDeviceUtil from '../utils/AlexaDeviceUtil';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import { AlexaObject } from 'alexa-sdk';
import StoreUtil from '../../../shared/utils/StoreUtil';
import AgentConstants from '../../../shared/AgentConstants';
import ConvoResponse from '../../../shared/agent/ConvoResponse';

export default class FindEventsNextHandler extends HandlerBase {

  constructor(alexa: AlexaObject<any>) {
    super(alexa);
  }

  async respond() {
    const alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
    const data = new DynamoDBUtil(this.alexa);
    const deviceUtil = new AlexaDeviceUtil(this.event);
    let convoResponse = new ConvoResponse('', true, true);

    this.user = await data.findOrInitiate(this.alexaUserId);

    let attr = await data.findAttributes(this.alexaUserId);
    this.user.attr = JSON.parse(attr);
    this.alexa.attributes = JSON.parse(attr);
    alexaConvo.alexa.attributes = this.alexa.attributes;

    alexaConvo.saveToStorage('eventsIntent', true);
    alexaConvo.saveToStorage('fallbackCount', 0);
    
    convoResponse = await StoreUtil.launchNextEventConvo(alexaConvo, (finalResponse) => {
      this.alexa.handler.state = 'EVENTS_MAIN_ONE_EXIST';
      alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
      data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
    });
    this.alexa.handler.state = alexaConvo.getStorage('context');
    this.alexa.attributes = alexaConvo.alexa.attributes;
    
    if (convoResponse.isAsk) {
        alexaConvo.ask(convoResponse.finalString);
    } else {
        alexaConvo.close(convoResponse.finalString);
    }
    // send out analytics or any destroy configs
    await alexaConvo.onStop();
  }
}
