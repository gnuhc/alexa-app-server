import HandlerBase from './HandlerBase';
import AlexaDeviceUtil from '../utils/AlexaDeviceUtil';
import StoreUtil from '../../../shared/utils/StoreUtil';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import EventsDialogFactory from '../../../shared/dialog/EventsDialogFactory';
import Coordinate from '../../../shared/models/Coordinate';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import ConfigConstants from '../../../shared/ConfigConstants';
import { Observable } from 'rxjs/Rx';
import moment = require('moment-timezone');
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import AgentConstants from '../../../shared/AgentConstants';
import ConvoResponse from '../../../shared/agent/ConvoResponse';

export default class FindLocationDialogHandler extends HandlerBase {

    constructor(alexa: any) {
        super(alexa);
    }

    async respond() {
        const alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
        const deviceUtil = new AlexaDeviceUtil(this.event);
        const data = new DynamoDBUtil(this.alexa);
        let convoResponse = new ConvoResponse('', true, true);

        this.user = await data.findOrInitiate(this.alexaUserId);

        if (this.user.saved) {
            const attr = await data.findAttributes(this.alexaUserId);
            this.user.attr = JSON.parse(attr);
            this.alexa.attributes = JSON.parse(attr);
            alexaConvo.alexa.attributes = this.alexa.attributes;
        }
        
        let str = this.checkAddressSlots(alexaConvo)
        if (str === 'fallback' || str === '') {
            this.alexa.emitWithState('AMAZON.FallbackIntent');
        } else {
            alexaConvo.saveToStorage(AgentConstants.ENTITY_ADDRESS_KEY, str);
 
        alexaConvo.saveToStorage('nearStoreIntent', false);
        alexaConvo.saveToStorage('subIntent', false);
        alexaConvo.saveToStorage('hoursIntent', false);
        alexaConvo.saveToStorage('fallbackCount', 0);

        if (alexaConvo.getStorage('find_location_event') || 
            this.alexa.handler.state === 'EVENTS_MAIN_ONE_EXIST' || 
            this.alexa.handler.state === 'EVENTS_MAIN_NOT_EXIST' ||
            this.alexa.handler.state === 'EVENTS_MAIN_EXIST') {
            alexaConvo.saveToStorage('eventsIntent', true);
            convoResponse = await StoreUtil.launchEventConvo(alexaConvo, false, (finalResponse) => {
                this.alexa.handler.state = alexaConvo.getStorage('context');
                alexaConvo.saveToStorage('find_location_event', false);
                alexaConvo.alexa.attributes.state = alexaConvo.getStorage('context');
                alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
            });
        } else {
            convoResponse = await StoreUtil.launchStoreConvo(alexaConvo, (finalResponse) => {
                this.alexa.handler.state = alexaConvo.getStorage('context');
                alexaConvo.alexa.attributes.state = alexaConvo.getStorage('context');
                alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
            });
        }
        
        if (convoResponse.isAsk) {
            alexaConvo.ask(convoResponse.finalString);
        } else {
            alexaConvo.close(convoResponse.finalString);
        }
        // send out analytics or any destroy configs
        await alexaConvo.onStop();
        }
    }

    checkAddressSlots(conv) {
        let string = '';
        let count = 0;
        let zip = 0;
        if (conv.getEntity('city')) {
            string += conv.getEntity('city');
            count++;
        }
        if (conv.getEntity('state')) {
            string += conv.getEntity('state');
            count++;
        }
        if (conv.getZipEntity('zipcode')) {
            if (conv.getZipEntity('zipcode').length < 5 ||
                conv.getZipEntity('zipcode').length > 5) {
                return 'fallback';
            }
            string += conv.getZipEntity('zipcode');
            zip = 1;
        }
        if (count < 2 && zip === 0) {
            return 'fallback';
        }
        return string;
    }
}
