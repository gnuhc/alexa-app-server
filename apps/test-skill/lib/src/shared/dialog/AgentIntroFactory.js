"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AgentConstants_1 = require("../AgentConstants");
class AgentIntroFactory {
    static getIntro(conv, returning) {
        if (returning) {
            if (conv.getStorage(AgentConstants_1.default.STORAGE_SAVED_STORE_KEY)) {
                return `Welcome back to Macy’s. It’s great to chat again about finding Macy’s stores, hours, events, 
                      and about our return policy and Star Rewards program. For a little fun, try a morning affirmation.
                      To get started, just ask, “Where’s my nearest Macy’s”. Or, “ask Macy’s for store hours”, or 
                      “ask what’s happening at Macy’s”. You can also ask, “What’s your return policy”. And ask, 
                      “what is Star Rewards”. Or “ask Macy’s to say good morning.” We’re adding more content to 
                      this ${conv.getType()}, so check back again!`;
            }
            else {
                return `Hello, and welcome to Macy’s. Use this ${conv.getType()} to find Macy’s store locations, hours, and in-store events, 
                        and get information on our return policy and Star Rewards program. Just for fun, we’ve added Macy’s 
                        morning affirmations. Get started by asking, “where’s my nearest Macy’s”, “ask Macy’s for store hours”, 
                        or “ask what’s happening at Macy’s”. You can also ask, “What’s your return policy” and ask, 
                        “what is Star Rewards.” Or “ask Macy’s to say good morning.” More ways to talk to Macy’s are coming 
                        soon, so check back in!`;
            }
        }
        else {
            return `Hello, and welcome to Macy’s. Use this ${conv.getType()} to find Macy’s store locations, hours, and in-store events, 
                        and get information on our return policy and Star Rewards program. Just for fun, we’ve added Macy’s 
                        morning affirmations. Get started by asking, “where’s my nearest Macy’s”, “ask Macy’s for store hours”, 
                        or “ask what’s happening at Macy’s”. You can also ask, “What’s your return policy” and ask, 
                        “what is Star Rewards.” Or “ask Macy’s to say good morning.” More ways to talk to Macy’s are coming 
                        soon, so check back in!`;
        }
    }
}
exports.default = AgentIntroFactory;
//# sourceMappingURL=AgentIntroFactory.js.map