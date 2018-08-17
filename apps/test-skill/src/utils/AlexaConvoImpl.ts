import ConvoInterface from '../../../shared/agent/ConvoInterface';
import Alexa = require('alexa-sdk');
import ConfigConstants from '../../../shared/ConfigConstants';
import AgentConstants from '../../../shared/AgentConstants';
import AgentHelpFactory from '../../../shared/dialog/AgentHelpFactory';
import Analytics from '../../../shared/analytics/Analytics';

export default class AlexaConvoImpl implements ConvoInterface {

    public alexa: Alexa.AlexaObject<any>;
    public userId: string;
    public event: any;

    constructor(alexa: Alexa.AlexaObject<any>, userId: string, event: any) {
        this.alexa = alexa;
        this.userId = userId;
        this.event = event;
    }

    async onStart() {
        // users dont have to launch default welcome intent to launch the app the first time
        // they could say 'talk to macys and find nearby events'
        if (this.alexa.event.request.type === AgentConstants.INTENT_LAUNCH_ALEXA) {
            console.log("ANALYTICS LAUNCH")
           if (this.getStorageOrDefault(AgentConstants.STORAGE_APP_VISITS, 0) === 0) {
               console.log("ANALYTICS FIRST TIME")
               Analytics.firstTimeVisitTag(this);
           }
           Analytics.welcomeIntentTag(this);
        } else if (this.alexa.event.request.type === AgentConstants.INTENT_REQUEST_ALEXA) {
           console.log("ANALYTICS: " + JSON.stringify(this.alexa.event.request))
           if (this.alexa.event.request.intent.name === AgentConstants.INTENT_REPEAT) {
               console.log("ANALYTICS REPEAT")
              Analytics.repeatIntentTag(this);
           } else {
               console.log("ANALYTICS INTENT")
              Analytics.defaultIntentTag(this);         
           }
        } else {
            console.log("ANALYTICS DEFAULT INTENT")
            Analytics.defaultIntentTag(this);
        }
    }

    async onStop() {
        await Analytics.sendTags();
    }

    saveToStorage(key: string, val: any) {
        this.alexa.attributes[key] = val;
    }

    getStorage(key: string): any {
        if (this.alexa.attributes.hasOwnProperty(key)) {
          return this.alexa.attributes[key];
        } else {
          return false;
        }
    }

    hasStorage(key: string): boolean {
        return !!this.getStorage(key);
    }

    ask(str) {
        this.saveToStorage(AgentConstants.STORAGE_REPEAT_KEY, str);
        return this.alexa.emit(':ask', str, AgentHelpFactory.getReprompt());
    }

    close(str) {
        return this.alexa.emit(':tell', str);
    }

    getEntity(key: string): any {
        // Since ENTITY_ADDRESS_KEY is not an actual entity in Alexa, faking as an entity when actually getting from storage
        if (key === AgentConstants.ENTITY_ADDRESS_KEY) {
            return this.alexa.attributes.address;
        }
        if (key === AgentConstants.ENTITY_ZIPCODE_KEY) {
            return this.alexa.attributes.zipcode;
        }

        if (key === AgentConstants.ENTITY_SAVED_STORE) {
            return this.alexa.attributes.entity_saved;
        }
        // Checks if slot exists before trying to access it
        if ((this.alexa.event.request.intent.slots).hasOwnProperty(key)) {
          return this.alexa.event.request.intent.slots[key].value;
        } else {
          return false;
        }
    }

    getZipEntity(key: string): any {
        // Checks if slot exists before trying to access it
        if ((this.alexa.event.request.intent.slots).hasOwnProperty(key)) {
          return this.alexa.event.request.intent.slots[key].value;
        } else {
          return false;
        }
    }

    hasPermission(): boolean {
        return this.alexa.emit(':tellWithPermissionCard', ConfigConstants.PERM, ['read::alexa:device:all:address']);
    }

    setContextForStores() {
        // TODO
    }

    isNearbyRequest(): boolean {
        return this.hasStorage(AgentConstants.STORAGE_NEAR_STORE_INTENT);
    }

    getUserId(): string {
        return this.userId;
    }

    // TOOO - jong this will never be right?
    getInitialUtterance(): string {
        return '';
    }

    getIntentName(): string {
        if (this.alexa.event.request.type === AgentConstants.INTENT_LAUNCH_ALEXA) {
            return AgentConstants.INTENT_LAUNCH_ALEXA;
        } else {
            return this.alexa.event.request.intent.name;
        }
    }

    getStorageOrDefault<T>(key: string, value: T): T {
        if (this.hasStorage(key)) {
            return this.getStorage(key);
        } else {
            return value;
        }
    }

    getDeviceType(): string {
        const hasDisplay = this.event.context && 
                           this.event.context.System &&
                           this.event.context.System.device &&
                           this.event.context.System.device.supportedInterfaces &&
                           this.event.context.System.device.supportedInterfaces.Display;

        if (hasDisplay) {
            return 'noScreen'
        } else {
            return 'hasScreen'
        }
    }

    setContextForEvents(eventsLeft: number) {
      if (this.getStorage('nearStoreIntent')) {
        if (eventsLeft >= 1) {
            console.log('NEARSTOREINTENT EVENTS EXIST 111')
          this.saveToStorage('context', 'EVENTS_EXIST');
        }
        if (eventsLeft < 1) {
            console.log('NEARSTOREINTENT EVENTS NOT EXIST 222')
          this.saveToStorage('context', 'EVENTS_NOT_EXIST');
        }
      } else if (this.getStorage('storeIntent')) {
        if (eventsLeft >= 1) {
            console.log('STOREINTENT EVENTS EXIST 111')
          this.saveToStorage('context', 'EVENTS_EXIST');
        }
        if (eventsLeft < 1) {
            console.log('STOREINTENT EVENTS NOT EXIST 222')
          this.saveToStorage('context', 'EVENTS_NOT_EXIST');
        }
      } else if (this.getStorage('eventsIntent')) {
        if (eventsLeft > 1) {
            console.log('EVENTSINTENT EVENTS MAIN EXIST 333')
          this.saveToStorage('context', 'EVENTS_MAIN_EXIST');
          //this.saveToStorage('eventsIntent', false);
        }
        if (eventsLeft == 1) {
            console.log('EVENTSINTENT EVENTS MAIN ONE EXIST 444')
          this.saveToStorage('context', 'EVENTS_MAIN_ONE_EXIST');
          //this.saveToStorage('eventsIntent', false);
        }
        if (eventsLeft < 1) {
            console.log('EVENTSINTENT EVENTS MAIN NOT EXIST 555')
          this.saveToStorage('context', 'EVENTS_MAIN_NOT_EXIST');
          //this.saveToStorage('eventsIntent', false);
        }
      } else {
         console.log("NO CONTEXT")
      }
    }

    getType(): string {
        return 'skill';
    }

    hasEntity(key: string): boolean {
        return !!this.getEntity(key);
    }

    removeFromStorage(key: string) {
        if (this.alexa.attributes.hasOwnProperty(key)) {
          delete this.alexa.attributes[key];
        } 
    }

    preDelete() {
        if (this.alexa.attributes.hasOwnProperty('address')) {
          delete this.alexa.attributes.address;
        }
        if (this.alexa.attributes.hasOwnProperty('most_recent_store')) {
          delete this.alexa.attributes.most_recent_store;
        }
        if (this.alexa.attributes.hasOwnProperty('nearStoreIntent')) {
          delete this.alexa.attributes.nearStoreIntent;
        }
        if (this.alexa.attributes.hasOwnProperty('storeIntent')) {
          delete this.alexa.attributes.storeIntent;
        }
        if (this.alexa.attributes.hasOwnProperty('eventsIntent')) {
          delete this.alexa.attributes.eventsIntent;
        }
        if (this.alexa.attributes.hasOwnProperty('find_location_event')) {
          delete this.alexa.attributes.find_location_event;
        }
        if (this.alexa.attributes.hasOwnProperty('subIntent')) {
          delete this.alexa.attributes.subIntent;
        }
        if (this.alexa.attributes.hasOwnProperty('fallbackCount')) {
          delete this.alexa.attributes.fallbackCount;
        }
        if (this.alexa.attributes.hasOwnProperty(AgentConstants.STORAGE_REPEAT_KEY)) {
          delete this.alexa.attributes.repeat;
        }        
    }
}
