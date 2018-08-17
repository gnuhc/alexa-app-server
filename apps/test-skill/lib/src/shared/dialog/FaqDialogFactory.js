"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FaqDialogFactory {
    static returnPolicy() {
        return `We gladly accept most returns within 180 days of purchase. That means you can return almost 
                all clothing, shoes, handbags, beauty items, and more, within 180 days. An exception is Last Act 
                merchandise, which has a return window of 30 days. There also are special return policies for a 
                few other categories including dresses, furniture, mattresses and more. You’ll find full details 
                online at macys.com or on the Macy’s app. Thanks for asking.`;
    }
    static returnPolicySSML() {
        return `We gladly accept <emphasis level="moderate"> most </emphasis> general merchandise returns
                within <emphasis level="moderate">180 </emphasis> days of purchase. That means you can return 
                almost <emphasis level="moderate">all </emphasis> clothing, shoes, handbags, beauty and fragrance 
                items, and more, within 180 days. An exception <emphasis level="moderate">is </emphasis>Last Act, 
                which has a return window of <emphasis level="moderate">30 </emphasis>days. There are special 
                return policies for a few other categories including dresses, mattresses, and more. You can always 
                find full details online at macys.com or on the Macy’s app. Thanks for asking.`;
    }
    static starRewardsResponse() {
        return `Star Rewards is Macy’s exclusive program offering special perks, savings, surprises and more. 
                If you’re a Macy’s Credit Card holder, you’re automatically enrolled in the program,
                just shop with your Macy’s Card to enjoy the benefits. But—great news—if you don’t have a 
                Macy’s Card, you can also enroll in Star Rewards and have access to events like our exclusive 
                Star Money Days. You’ll find all the details and can sign up for free at macys.com.`;
    }
    static starRewardsResponseSSML() {
        return `Star Rewards is Macy’s <emphasis level="moderate"> exclusive </emphasis> program offering
                special perks, savings, surprises and more. If you’re a Macy’s Credit Card holder, you’re 
                automatically enrolled in the program, just shop with your Macy’s Card to enjoy the benefits. 
                But—great news—if you don’t have a Macy’s Card, you can also enroll in Star Rewards and have 
                access to events like our exclusive Star Money Days. You’ll find all the details and can sign up 
                for free at macys.com. I'm <emphasis level="moderate"> so </emphasis>glad you asked!`;
    }
    static globalHelpResponse() {
        return `This is the Macy’s skill, here to help you with information about our store locations, 
                hours, special events, returns and Star Rewards benefits.

                Here’s how to start: Ask, “where’s my nearest Macy’s?”.
                You can also: “Ask Macy’s for store hours”.  
                Or: Ask, “What’s happening at Macy’s?”.
                
                To hear about our policies, ask, “what’s your return policy”.
                Or ask, “what is Star Rewards”.
                
                If you ever want something repeated, say, “repeat”.
                
                Let’s start. How can I help you today?`;
    }
}
exports.default = FaqDialogFactory;
//# sourceMappingURL=FaqDialogFactory.js.map