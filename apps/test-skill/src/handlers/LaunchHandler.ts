import FindStoreHandler from './FindStoreHandler';
import FindHoursHandler from './FindHoursHandler';
import FindEventsHandler from './FindEventsHandler';
import AffirmationsHandler from './AffirmationsHandler';
import FindFAQHandler from './FindFAQHandler';
import LaunchRequestHandler from './LaunchRequestHandler';
import ExitQuestionHandler from './ExitQuestionHandler';
import RepeatHandler from './RepeatHandler';
import SessionEndedHandler from './SessionEndedHandler';
import ForgetHandler from './ForgetHandler';
import HelpHandler from './HelpHandler';
import AgentHelpFactory from '../../../shared/dialog/AgentHelpFactory';
import FallbackIntentHandler from './FallbackIntentHandler';

export default class LaunchHandler {

    public static handler() {
        const amazonObj = LaunchHandler.getAmazonDefaultIntents();

        return {
          LaunchRequest() {
            const launchRequestHandler = new LaunchRequestHandler(this);
            launchRequestHandler.respond();
          },
          FindHoursIntent() {
            const findHoursHandler = new FindHoursHandler(this);
            findHoursHandler.respond();
          },
          FindStoreIntent() {
            const findStoreHandler = new FindStoreHandler(this);
            findStoreHandler.respond();
          },
          FindEventsIntent() {
            const findEventsHandler = new FindEventsHandler(this);
            findEventsHandler.respond();
            this.handler.state = 'EVENTS_MAIN_EXIST';
          },
          FindFAQIntent() {
            const findFAQHandler = new FindFAQHandler(this);
            findFAQHandler.respond();
          },
          AffirmationsIntent() {
            const affirmationsHandler = new AffirmationsHandler(this);
            affirmationsHandler.respond();
          },
          RepeatingIntent() {
            const repeatHandler = new RepeatHandler(this);
            repeatHandler.respond();
          },
          ForgetIntent() {
            const forgetHandler = new ForgetHandler(this);
            forgetHandler.respond();
          },
          ExitQuestionIntent() {
            console.log("EXITQUE")
            const exitQuestionHandler = new ExitQuestionHandler(this);
            exitQuestionHandler.respond();
            this.handler.state = 'EXIT';
          },
          'AMAZON.StopIntent': function () { // eslint-disable-line func-names
            console.log("STOP")
              const exitQuestionHandler = new ExitQuestionHandler(this);
              exitQuestionHandler.respond();
              this.handler.state = 'EXIT';
              //this.emit(':tell', AgentHelpFactory.getBye(), AgentHelpFactory.getBye());
          },
          'Unhandled': function () {
            console.log("launch Unhandled")
            this.emit(':ask', AgentHelpFactory.getFallback(), AgentHelpFactory.getFallback());
          },
          SessionEndedRequest() {
            const sessionEndedHandler = new SessionEndedHandler(this);
            sessionEndedHandler.respond();
          },  ... amazonObj
        };
    }

    public static getAmazonDefaultIntents(): object {
        return {
            'AMAZON.NoIntent': function () { // eslint-disable-line func-names
                this.emit(':ask', AgentHelpFactory.getFallback(), AgentHelpFactory.getFallback());
            },
            'AMAZON.YesIntent': function () { // eslint-disable-line func-names
                this.emit(':ask', AgentHelpFactory.getFallback(), AgentHelpFactory.getFallback());
            },
            'AMAZON.CancelIntent': function () { // eslint-disable-line func-names
                this.emit(':tell', AgentHelpFactory.getBye(), AgentHelpFactory.getBye());
            },
            'AMAZON.HelpIntent': function () { // eslint-disable-line func-names
                const helpHandler = new HelpHandler(this);
                helpHandler.respond();
            },
            'AMAZON.FallbackIntent': function () { // eslint-disable-line func-names
              console.log("launch fallback")
                const fallbackIntentHandler = new FallbackIntentHandler(this);
                fallbackIntentHandler.respond();
            }
        };
    }

}
