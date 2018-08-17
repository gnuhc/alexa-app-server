import HandlerBase from './HandlerBase';
import AlexaDeviceUtil from '../utils/AlexaDeviceUtil';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import DialogFactory from '../../../shared/dialog/StoreDialogFactory';
import AgentConstants from '../../../shared/AgentConstants';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import { AlexaObject } from 'alexa-sdk';
import StoreUtil from '../../../shared/utils/StoreUtil';
import Analytics from '../../../shared/analytics/Analytics';
import ConvoResponse from '../../../shared/agent/ConvoResponse';

export default class FindStoreHandler extends HandlerBase {

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

        await alexaConvo.onStart();

        if (!this.alexa.handler.hasOwnProperty('state') || this.alexa.handler.state == '') {
            alexaConvo.preDelete();
        }

        alexaConvo.saveToStorage('eventsIntent', false);
        alexaConvo.saveToStorage('storeIntent', false);
        alexaConvo.saveToStorage('hoursIntent', false);
        alexaConvo.saveToStorage('nearStoreIntent', false);
        alexaConvo.saveToStorage('find_location_event', false);
        alexaConvo.saveToStorage('subIntent', false);
        alexaConvo.saveToStorage('fallbackCount', 0);
        
        delete this.alexa.attributes.address;

        const permission = await deviceUtil.checkAddressPermission()
                if (!permission) {
                    alexaConvo.hasPermission();
                } else {
                    alexaConvo.saveToStorage(AgentConstants.ENTITY_ADDRESS_KEY, this.checkAddressSlots(alexaConvo));
                    alexaConvo.saveToStorage('storeIntent', true);
                    if (this.checkNearSlot(alexaConvo)) {
                        await deviceUtil.getLatLng(alexaConvo)
                            alexaConvo.saveToStorage('nearStoreIntent', true);
                            convoResponse = await StoreUtil.launchStoreConvo(alexaConvo, (finalResponse, store) => {
                                this.alexa.handler.state = alexaConvo.getStorage('context');
                                alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                                alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                            });
                    } else if (this.checkSavedSlot(alexaConvo)) {
                        alexaConvo.saveToStorage(AgentConstants.ENTITY_SAVED_STORE, true);
                        if (!alexaConvo.getStorage(AgentConstants.STORAGE_SAVED_STORE_KEY)) {
                        convoResponse = new ConvoResponse('Currently, you do not have a saved location. Where would you like to shop?', true, false);
                        } else {
                            convoResponse = await StoreUtil.launchStoreConvo(alexaConvo, (finalResponse, store) => {
                                this.alexa.handler.state = alexaConvo.getStorage('context');
                                alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                                alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                                alexaConvo.saveToStorage(AgentConstants.STORAGE_MOST_RECENT_STORE_KEY, store);
                                data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                            });
                        }
                    } else if (alexaConvo.getStorage(AgentConstants.STORAGE_SAVED_STORE_KEY)) {
                        convoResponse = await StoreUtil.launchStoreConvo(alexaConvo, (finalResponse, store) => {
                            this.alexa.handler.state = alexaConvo.getStorage('context');
                            alexaConvo.removeFromStorage(AgentConstants.ENTITY_ADDRESS_KEY);
                            alexaConvo.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, finalResponse);
                            alexaConvo.saveToStorage(AgentConstants.STORAGE_MOST_RECENT_STORE_KEY, store);
                            data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
                        });
                    } else {
                        await deviceUtil.getLatLng(alexaConvo)
                            
                            convoResponse = await StoreUtil.launchStoreConvo(alexaConvo, (finalResponse, store) => {
                                this.alexa.handler.state = alexaConvo.getStorage('context');
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

    checkNearSlot(conv): boolean {
        const string = '';
        if (conv.getEntity('nearest')) {
            return true;
        }
        return false;
    }

    checkSavedSlot(conv): boolean {
        const string = '';
        if (conv.getEntity('saved')) {
            return true;
        }
        return false;
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
