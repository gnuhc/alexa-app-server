import FindLocationDialogHandler from './FindLocationDialogHandler';
import FindLocationSubHandler from './FindLocationSubHandler';
import FindStoreHandler from './FindStoreHandler';
import FindHoursHandler from './FindHoursHandler';
import FindEventsHandler from './FindEventsHandler';
import AffirmationsHandler from './AffirmationsHandler';
import FindFAQHandler from './FindFAQHandler';
import ExitQuestionHandler from './ExitQuestionHandler';
import RepeatHandler from './RepeatHandler';
import SessionEndedHandler from './SessionEndedHandler';
import UnhandledIntentHandler from './UnhandledIntentHandler';
import FallbackIntentHandler from './FallbackIntentHandler';
import ForgetHandler from './ForgetHandler';
import HelpHandler from './HelpHandler';
import AgentHelpFactory from '../../../shared/dialog/AgentHelpFactory';

export default class EventsExistHandler {

    public static handler() {
        return {
          FindLocationIntent() {
            console.log("SUBHAN")
            const findLocationSubHandler = new FindLocationSubHandler(this);
            findLocationSubHandler.respond();
          },
          FindLocationDialogIntent() {
            const findLocationDialogHandler = new FindLocationDialogHandler(this);
            findLocationDialogHandler.respond();
          },
          FindEventsIntent() {
            const findEventsHandler = new FindEventsHandler(this);
            findEventsHandler.respond();
            this.handler.state = 'EVENTS_MAIN_EXIST';
          },
          FindHoursIntent() {
            const findHoursHandler = new FindHoursHandler(this);
            findHoursHandler.respond();
          },
          FindStoreIntent() {
            const findStoreHandler = new FindStoreHandler(this);
            findStoreHandler.respond();
          },
          FindFAQIntent() {
            const findFAQHandler = new FindFAQHandler(this);
            findFAQHandler.respond();
          },
          AffirmationsIntent() {
            const affirmationsHandler = new AffirmationsHandler(this);
            affirmationsHandler.respond();
          },
          ExitQuestionIntent() {
            const exitQuestionHandler = new ExitQuestionHandler(this);
            exitQuestionHandler.respond();
            this.handler.state = 'EXIT';
          },
          RepeatingIntent() {
            const repeatHandler = new RepeatHandler(this);
            repeatHandler.respond();
          },
          ForgetIntent() {
            const forgetHandler = new ForgetHandler(this);
            forgetHandler.respond();
          },
          SessionEndedRequest() {
            const sessionEndedHandler = new SessionEndedHandler(this);
            sessionEndedHandler.respond();
          },
          'AMAZON.NoIntent': function () { // eslint-disable-line func-names
            this.emitWithState('ExitQuestionIntent');
          },
          'AMAZON.YesIntent': function () { // eslint-disable-line func-names
            this.emit(':ask', 'You can say store events to hear about events or ask for another location or say stop to exit', AgentHelpFactory.getReprompt());
          },
          'AMAZON.CancelIntent': function () { // eslint-disable-line func-names
            this.emitWithState('ExitQuestionIntent');
            this.handler.state = 'EXIT';
          },
          'AMAZON.HelpIntent': function () { // eslint-disable-line func-names
            const helpHandler = new HelpHandler(this);
            helpHandler.respond();
          },
          'AMAZON.StopIntent': function () { // eslint-disable-line func-names
            this.emitWithState('ExitQuestionIntent');
            this.handler.state = 'EXIT';
          },
          'AMAZON.FallbackIntent': function () { // eslint-disable-line func-names
            console.log("FALLBACKEXIST")
            const fallbackIntentHandler = new FallbackIntentHandler(this);
            fallbackIntentHandler.respond();
          },
          'Unhandled': function() {
            const unhandledIntentHandler = new UnhandledIntentHandler(this);
            unhandledIntentHandler.respond();
          },
        }
    }
}
