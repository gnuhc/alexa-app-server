"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AgentHelpFactory {
    static getHelp(conv) {
        return `This is the Macy’s skill, here to help you with information about our store locations, 
                hours, special events, returns and Star Rewards benefits.
 
                Here’s how to start. Ask, “Where’s my nearest Macy’s”.
                You can also, “Ask Macy’s for store hours”. 
                Or: “Ask what’s happening at Macy’s”.
                To hear about our policies, ask, “What’s your return policy”. Or ask, “What is Star Rewards.”.
                For fun, “ask Macy’s to say good morning.”
                 
                If you ever need to hear something again, just say, “repeat”.
                 
                Okay, go ahead, and ask!`;
    }
    static getFallback() {
        return `Sorry, I didn’t get that. I can repeat what we were just chatting about, 
                or give you our help menu. Say “repeat”, or “help”.`;
    }
    static getBye() {
        return `Ok, goodbye.`;
    }
    static getReprompt() {
        return `Hope you’re still there. I can repeat what we were just chatting about, 
                or give you our help menu. Say “repeat”, or “help”.`;
    }
    static getSorry() {
        return `Sorry I didn't get that`;
    }
    static getNoRepeat() {
        return `Sorry, there is nothing to repeat.`;
    }
}
exports.default = AgentHelpFactory;
//# sourceMappingURL=AgentHelpFactory.js.map