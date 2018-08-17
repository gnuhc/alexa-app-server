import User from '../../../shared/models/User';

export default class Handler {

  alexa: any;
  event: any;
  alexaUserId: any;
  user: User;

  constructor(alexa: any) {
    this.alexa = alexa;
    this.event = alexa.event;
    this.alexaUserId = this.event.context.System.user.userId;
  }

}
