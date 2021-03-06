import FindLocationDialogHandler from './FindLocationDialogHandler';
import FindLocationSubHandler from './FindLocationSubHandler';
import LaunchHandler from './LaunchHandler';
import FindStoreHandler from './FindStoreHandler';
import FindHoursHandler from './FindHoursHandler';
import FindEventsHandler from './FindEventsHandler';
import AffirmationsHandler from './AffirmationsHandler';
import FindFAQHandler from './FindFAQHandler';
import ExitQuestionHandler from './ExitQuestionHandler';
import RepeatHandler from './RepeatHandler';
import SessionEndedHandler from './SessionEndedHandler';
import FallbackIntentHandler from './FallbackIntentHandler';
import UnhandledIntentHandler from './UnhandledIntentHandler';
import YesIntentHandler from './YesIntentHandler';
import ForgetHandler from './ForgetHandler';
import HelpHandler from './HelpHandler';

export default class EventsNotExistHandler {

    public static handler() {
        return {
          FindLocationIntent() {
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
            this.handler.state = 'EXIT';
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
            const yesIntentHandler = new YesIntentHandler(this);
            yesIntentHandler.respond();
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
