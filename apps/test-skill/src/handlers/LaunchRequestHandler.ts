import HandlerBase from './HandlerBase';
import DynamoDBUtil from '../utils/DynamoDBUtil';
import AlexaConvoImpl from '../utils/AlexaConvoImpl';
import AgentIntroFactory from '../../../shared/dialog/AgentIntroFactory';

export default class LaunchRequestHandler extends HandlerBase {

    constructor(alexa: any) {
        super(alexa);
    }

    async respond() {
        const alexaConvo = new AlexaConvoImpl(this.alexa, this.alexaUserId, this.event);
        const data = new DynamoDBUtil(this.alexa);
        const found = await data.find(this.event.context.System.user.userId);

        if (found) {
            const attr = await data.findAttributes(this.alexaUserId);
            this.alexa.attributes = JSON.parse(attr);
            alexaConvo.alexa.attributes = this.alexa.attributes;
            alexaConvo.preDelete();
            data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);
        }

        await alexaConvo.onStart();
        
        alexaConvo.ask(AgentIntroFactory.getIntro(alexaConvo, found));
        data.updateUser(this.alexaUserId, alexaConvo.alexa.attributes, this.user);

        await alexaConvo.onStop();
    }
}
