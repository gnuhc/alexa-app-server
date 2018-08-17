import HandlerBase from './HandlerBase';
import AlexaDeviceUtil from '../utils/AlexaDeviceUtil';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import { AlexaObject } from 'alexa-sdk';
import StoreUtil from '../../../shared/utils/StoreUtil';
import AgentConstants from '../../../shared/AgentConstants';
import Analytics from '../../../shared/analytics/Analytics';
import ConvoResponse from '../../../shared/agent/ConvoResponse';

export default class FindHoursHandler extends HandlerBase {

    constructor(alexa: AlexaObject<any>) {
        super(alexa);
    }

    async respond() {
        const alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
        const data = new DynamoDBUtil(this.alexa);
        const deviceUtil = new AlexaDeviceUtil(this.event);
        let convoResponse = new ConvoResponse('', true, true);

        this.user = await data.findOrInitiate(this.alexaUserId);

        if (this.user.saved) {
            const attr = await data.findAttributes(this.alexaUserId);
            this.user.attr = JSON.parse(attr);
            this.alexa.attributes = JSON.parse(attr);
            alexaConvo.alexa.attributes = this.alexa.attributes;
        }

        if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
            alexaConvo.preDelete();
        }

        alexaConvo.saveToStorage('eventsIntent', false);
        alexaConvo.saveToStorage('nearStoreIntent', false);
        alexaConvo.saveToStorage('find_location_event', false);
        alexaConvo.saveToStorage('subIntent', false);
        alexaConvo.saveToStorage('hoursIntent', true);
        alexaConvo.saveToStorage('storeIntent', true);
        alexaConvo.saveToStorage('fallbackCount', 0);

        const permission = await deviceUtil.checkAddressPermission();
            if (!permission) {
                alexaConvo.hasPermission();
            } else {
                alexaConvo.saveToStorage(AgentConstants.ENTITY_ADDRESS_KEY, this.checkAddressSlots(alexaConvo));
                if (alexaConvo.getStorage(AgentConstants.STORAGE_MOST_RECENT_STORE_KEY)) {
                    await deviceUtil.getLatLng(alexaConvo);
                  console.log("IN MOST RECENT STORE")
                  console.log("USER COORD EXIST IN STORE IF1: " + JSON.stringify(alexaConvo.getStorage(AgentConstants.STORAGE_USER_COORDINATES)))
                    alexaConvo.saveToStorage('storeIntent', true);
                    alexaConvo.saveToStorage('hoursIntent', true);
                    convoResponse = await StoreUtil.launchStoreConvo(alexaConvo, (finalResponse) => {
                        alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                        this.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                        data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                    });
                } else if (alexaConvo.getStorage(AgentConstants.STORAGE_SAVED_STORE_KEY)) {
                  console.log("IN SAVED STORE")
                  console.log("USER COORD EXIST IN STORE IF2: " + JSON.stringify(alexaConvo.getStorage(AgentConstants.STORAGE_USER_COORDINATES)))
                    alexaConvo.saveToStorage('storeIntent', true);
                    alexaConvo.saveToStorage('hoursIntent', true);
                    convoResponse = await StoreUtil.launchStoreConvo(alexaConvo, (finalResponse) => {
                        alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                        this.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                        data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                    });
                } else {
                    await deviceUtil.getLatLng(alexaConvo);
                  console.log("USER COORD EXIST IN STORE IF3: " + JSON.stringify(alexaConvo.getStorage(AgentConstants.STORAGE_USER_COORDINATES)))
                    alexaConvo.saveToStorage('storeIntent', true);
                    alexaConvo.saveToStorage('hoursIntent', true);
                    convoResponse = await StoreUtil.launchStoreConvo(alexaConvo, (finalResponse) => {
                        alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                        this.alexa.handler.state = alexaConvo.getStorage('context');
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
        if (conv.getEntity('city')) {
            string += conv.getEntity('city');
        }
        if (conv.getEntity('state')) {
            string += conv.getEntity('state');
        }
        if (conv.getZipEntity('zipcode')) {
            string += conv.getZipEntity('zipcode');
        }
        return string;
    }
}
