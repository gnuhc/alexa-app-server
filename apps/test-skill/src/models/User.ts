
export default class User {

  alexaUserId: any;
  saved: boolean;
  attr: any;

  constructor(alexaUserId, saved) {
  	this.alexaUserId = alexaUserId;
  	this.saved = saved;
  }
}
