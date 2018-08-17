import { AlexaObject } from 'alexa-sdk';
import LaunchRequestHandler from './LaunchRequestHandler';
import FindHoursHandler from './FindHoursHandler';

export default class HandlerBuilder {

    alexa: AlexaObject<any>;

    mainObj: object;

    constructor(alexa: AlexaObject<any>) {
        this.alexa = alexa;
    }

    launchRequest(): HandlerBuilder {
        this.mainObj['LaunchRequest'] = () => {
            const launchRequestHandler = new LaunchRequestHandler(this.alexa);
            launchRequestHandler.respond();
        };
        return this;
    }

    findHoursIntent(): HandlerBuilder {
        this.mainObj['FindHoursIntent'] = () => {
            const findHoursHandler = new FindHoursHandler(this.alexa);
            findHoursHandler.respond();
        };
        return this;
    }

    /*
        HandlerBuilder
            .setupDefaults()
            .launchRequest()
            .findHoursIntent()
            .findStoreIntent()
            .build() return an obj
     */
}
