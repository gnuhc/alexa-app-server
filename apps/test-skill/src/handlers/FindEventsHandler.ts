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

export default class FindEventsHandler extends HandlerBase {

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

        delete alexaConvo.alexa.attributes.address;

        if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
            alexaConvo.preDelete();
        }

        alexaConvo.saveToStorage('context', 'EVENTS_MAIN_EXIST');
        alexaConvo.saveToStorage('eventsIntent', true);
        alexaConvo.saveToStorage('hoursIntent', false);
        alexaConvo.saveToStorage('storeIntent', false);
        alexaConvo.saveToStorage('nearStoreIntent', false);
        alexaConvo.saveToStorage('find_location_event', false);
        alexaConvo.saveToStorage('subIntent', false);

        const permission = await deviceUtil.checkAddressPermission()
            if (!permission) {
                alexaConvo.hasPermission();
            } else {
                alexaConvo.saveToStorage(AgentConstants.ENTITY_ADDRESS_KEY, this.checkAddressSlots(alexaConvo));
                if (!alexaConvo.getStorage(AgentConstants.STORAGE_MOST_RECENT_STORE_KEY)) {
                  console.log("EVENT NO MOST RECENT")
                    await deviceUtil.getLatLng(alexaConvo)
                            convoResponse = await StoreUtil.launchEventConvo(alexaConvo, false, (finalResponse) => {
                                this.alexa.handler.state = alexaConvo.getStorage('context');
                                alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                                alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                                alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                                this.alexa.attributes = alexaConvo.alexa.attributes;
                            });
                } else {
                  console.log("EVENT MOST RECENT")
                    convoResponse = await StoreUtil.launchEventConvo(alexaConvo, false, (finalResponse) => {
                        this.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.alexa.handler.state = alexaConvo.getStorage('context');
                        alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                        alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                        data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                        this.alexa.attributes = alexaConvo.alexa.attributes;
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
      console.log("SLOTS " + JSON.stringify(this.alexa.event.request.intent))
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
        console.log("STRING: " + JSON.stringify(string))
        return string;
    }
}
