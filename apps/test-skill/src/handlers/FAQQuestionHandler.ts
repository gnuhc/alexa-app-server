import NoIntentHandler from './NoIntentHandler';
import YesIntentHandler from './YesIntentHandler';
import RepeatHandler from './RepeatHandler';
import FindStoreHandler from './FindStoreHandler';
import FindHoursHandler from './FindHoursHandler';
import FindEventsHandler from './FindEventsHandler';
import AffirmationsHandler from './AffirmationsHandler';
import FindFAQHandler from './FindFAQHandler';
import ForgetHandler from './ForgetHandler';
import AgentHelpFactory from '../../../shared/dialog/AgentHelpFactory';
import ExitQuestionHandler from './ExitQuestionHandler';
import HelpHandler from './HelpHandler';
import FallbackIntentHandler from './FallbackIntentHandler';

export default class FAQQuestionHandler {

    public static handler() {
        return {
          RepeatingIntent() {
            const repeatHandler = new RepeatHandler(this);
            repeatHandler.respond();
          },
          ForgetIntent() {
            const forgetHandler = new ForgetHandler(this);
            forgetHandler.respond();
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
          ExitQuestionIntent() {
            const exitQuestionHandler = new ExitQuestionHandler(this);
            exitQuestionHandler.respond();
            this.handler.state = 'EXIT';
          },  
          'AMAZON.NoIntent': function () { // eslint-disable-line func-names
            const noIntentHandler = new NoIntentHandler(this);
            noIntentHandler.respond();
            this.handler.state = '';
          },
          'AMAZON.YesIntent': function () { // eslint-disable-line func-names
            const yesIntentHandler = new YesIntentHandler(this);
            yesIntentHandler.respond();
            this.handler.state = '';
          },
          'AMAZON.HelpIntent': function () { // eslint-disable-line func-names
            const helpHandler = new HelpHandler(this);
            helpHandler.respond();
          },
          'AMAZON.CancelIntent': function () { // eslint-disable-line func-names
            this.emit(':tell', AgentHelpFactory.getBye());
          },
          'AMAZON.StopIntent': function () { // eslint-disable-line func-names
            const exitQuestionHandler = new ExitQuestionHandler(this);
            exitQuestionHandler.respond();
            this.handler.state = 'EXIT';
          },
          'AMAZON.FallbackIntent': function () { // eslint-disable-line func-names
            const fallbackIntentHandler = new FallbackIntentHandler(this);
            fallbackIntentHandler.respond();
          },
          'Unhandled': function() {
            this.emit(':ask', AgentHelpFactory.getSorry(), AgentHelpFactory.getSorry());
          },
          SessionEndedRequest() {
            this.emit(':tell', AgentHelpFactory.getBye());
          },
        }
    }
}
