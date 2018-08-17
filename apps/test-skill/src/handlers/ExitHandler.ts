import ExitYesHandler from './ExitYesHandler';
import ExitNoHandler from './ExitNoHandler';
import AgentHelpFactory from '../../../shared/dialog/AgentHelpFactory';
import FallbackIntentHandler from './FallbackIntentHandler';

export default class ExitHandler {

    public static handler() {
        return {
          RepeatingIntent() {
            if (this.attributes.repeat || this.attributes.repeat != '') {
              this.emit(':ask', this.attributes.repeat);
            } else {
              this.emit(':ask', AgentHelpFactory.getNoRepeat(), AgentHelpFactory.getNoRepeat());
            }
          },
          'AMAZON.NoIntent': function () { // eslint-disable-line func-names
            const exitNoHandler = new ExitNoHandler(this);
            exitNoHandler.respond();
          },
          'AMAZON.YesIntent': function () { // eslint-disable-line func-names
            const exitYesHandler = new ExitYesHandler(this);
            exitYesHandler.respond();
          },
          'AMAZON.CancelIntent': function () { // eslint-disable-line func-names
            console.log("EXIT CANCEL")
            this.emit(':tell', AgentHelpFactory.getBye());
          },
          'AMAZON.StopIntent': function () { // eslint-disable-line func-names
            console.log("EXIT STOP")
            this.emit(':tell', AgentHelpFactory.getBye());
          },
          'AMAZON.FallbackIntent': function () { // eslint-disable-line func-names
            console.log("EXIT FALLBACK")
            const fallbackIntentHandler = new FallbackIntentHandler(this);
            fallbackIntentHandler.respond();
          },
          'Unhandled': function() {
            this.emit(':ask', AgentHelpFactory.getSorry(), AgentHelpFactory.getSorry());
          },
          SessionEndedRequest() {
            console.log("SESSION ENDED")
            this.emit(':tell', AgentHelpFactory.getBye());
          },
        }
    }
}
