import {Responsevalues} from "../../../test/global";
import TestBuilder from "../../TestBuilder";
import { Row } from 'exceljs';
import LogBuilder from "../../LogBuilder";
import resources from '../etc/resources';
import va = require('virtual-alexa');
import { SkillResponse } from 'virtual-alexa';
//const log = new LogBuilder();

const Excel = require('exceljs');
const responses = resources.en.translation;
const stubs = [];

const alexa = va.VirtualAlexa.Builder()
    .handler('./lib/m-alexa/src/alexa.handler')
    .applicationID('amzn1.ask.skill.3e22140a-67e4-49b5-b798-d6db7d20740c')
    .interactionModelFile('./interaction-model.json')
    //.skillURL("arn:aws:lambda:us-east-1:029587735831:function:m-alexa-local-alexa")
    .create();
/*const fs = require('fs');
fs.unlink('/Users/yh05824/MyVoiceGit/master/functions/logs/debug.log', function(err) {
    if(err && err.code == 'ENOENT') {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
    } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
    } else {
        console.info(`removed`);
    }
});*/
const log = new LogBuilder();

const forEachRow = (row: Row, rowNumber: number) => {

    jest.setTimeout(10000);


        if (rowNumber > 1) {

            if (!row.values[2]) {
                TestBuilder.Builder()
                    .it('it should return utter')
                    .utter(row.values[1])//Todo: Ask Macys
                    .ExcelReader(true)
                    .bypassPermission()
                    .response(Responsevalues.WELCOME_PROMPT_TODAY)
                    .test();
            }
            else {
                const jsonObj = {};
                jsonObj[row.values[2]] = row.values[3];

                TestBuilder.Builder()
                    .it('it should return intend')
                    .intend(row.values[1], jsonObj)
                    .ExcelReader(true)
                    .bypassPermission()
                    .response(Responsevalues.WELCOME_PROMPT_TODAY)
                    .test();
            }
        }

};

describe('loop', async function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('where is macys')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

        it('Looping',async () => {
            const workbook = new Excel.Workbook();
            const file = await workbook.xlsx.readFile('/Users/m059831/FAQ_Utterances.xlsx');
            const worksheet = file.getWorksheet('Location');
            log.LogInfo("***********************************************************************");
            log.LogInfo('Data Driven for Location Intent');
            log.LogInfo("***********************************************************************");
            //await ga.utter('Talk to macys dev');
            worksheet.eachRow(forEachRow);
       });
});


/*describe('TC_Location_001 - First Time User - Verify whether Google Home/Alexa respond for the welcome intent.', async function () {

        jest.setTimeout(10000);
        TestBuilder.Builder()
            .it('it should return the returning user welcome intent')
            .utter('Talk to macys dev')//Todo: Ask Macys
            .response(Responsevalues.WELCOME_PROMPT_TODAY)
            .test();
});

//@Test- TC_Location_030 - Verify whether Google Home/Alexa not asking for location preference, when user come out without entering Location intent.
describe('TC_Location_030 - Verify whether Google not asking for location preference, when user come out without entering Location intent', async function () {

jest.setTimeout(10000);
    TestBuilder.Builder()
            .it('it should return welcome intent')
            .utter('Talk to macys dev')//Todo: Ask Macys
            .response(Responsevalues.WELCOME_PROMPT_TODAY)
            .test();


    TestBuilder.Builder()
            .it('it should return Ok Good Bye')
            .utter('seeya')
            .response(Responsevalues.EXIT_WITHOUT_INTENT)
            .test();

});


//@Test- TC_Location_005 - Verify whether Google Home respond for the Store event when triggered through Location Dialog and when more events available.
describe('TC_Location_005 - Verify whether Google Home respond for the Store event when triggered through Location Dialog and when more events available.', async function () {

jest.setTimeout(10000);
    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the nearest location intent')
        .utter('nearest store')
        .bypassPermission()
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return the store events intent')
        .utter('store events')
        .bypassPermission()
        .response(Responsevalues.EVENTS_RESPONSE_UNIONSQUARE_STORE)
        .test();

});

//@Test- TC_Location_006 - Verify whether Google Home respond for the Store event when triggered through Location Dialog and when no events available.
describe('TC_Location_006 - Verify whether Google Home respond for the Store event when triggered through Location Dialog and when no events available.', async function () {
//Pre-requiste : Set the events API to return 0 events

jest.setTimeout(10000);
  TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .bypassPermission()
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('different location')
        .bypassPermission()
        .response(Responsevalues.ASK_FOR_DIFF_LOCATION_EVENTS)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Fremont CA')
        .response(Responsevalues.LOCATION_RESPONSE_FREMONT_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return the store events for sunnyvale location')
        .utter('store events')
        .response(Responsevalues.EVENTS_RESPONSE_SUNNYVALE_STORE)
        .bypassPermission()
        .test();

});


//@Test- TC_Location_007a - Verify whether Google Home responds with the proper location details, when user ask to find another location triggered through Location Intent..
describe('TC_Location_007a - Verify whether Google Home responds with the proper location details, when user ask to find another location triggered through Location Intent.', async function () {

jest.setTimeout(10000);
    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the question intent for zipcode or location')
        .utter('find another location')
        .response(Responsevalues.ASK_FOR_DIFF_LOCATION_EVENTS)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Fremont California')
        .response(Responsevalues.LOCATION_RESPONSE_FREMONT_STORE_OPEN)
        .test();

});


//@Test- TC_Location_007b - Verify whether Google Home responds with the proper location details, when user ask to find another location triggered through Location Intent..
describe('TC_Location_007b - Verify whether Google Home responds with the proper location details, when user ask to find another location triggered through Location Intent.', async function () {

jest.setTimeout(10000);
    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the question intent for zipcode or location')
        .utter('find another location')
        .response(Responsevalues.ASK_FOR_DIFF_LOCATION_EVENTS)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Fremont CA') //Todo Need to give zipcode
        .response(Responsevalues.LOCATION_RESPONSE_FREMONT_STORE_OPEN)
        .test();

});

//@Test- TC_Location_009b - Scenario#5 Verify whether Google Home responds properly to save the location preference for the first time user.
describe('TC_Location_009b - Scenario#5 Verify whether Google Home responds properly to save the location preference for the first time user.', async function () {

jest.setTimeout(10000);
    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Fremont CA')
        .response(Responsevalues.LOCATION_RESPONSE_FREMONT_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return the no intent#8')
        .utter('seeya')
        .response(Responsevalues.EXIT_DIALOG)
        .test();

});


//@Test- TC_Location_009b - Scenario#4 Verify whether Google Home responds properly to save the location preference for the first time user.
describe('TC_Location_009b - Scenario#4 Verify whether Google Home responds properly to save the location preference for the first time user.', function () {

   jest.setTimeout(10000);
       TestBuilder.Builder()
           .it('it should return the returning user welcome intent')
           .utter('Talk to Macys dev')//Todo: Ask Macys
           .response(Responsevalues.WELCOME_PROMPT_TODAY)
           .test();

       TestBuilder.Builder()
           .it('it should return the location intent')
           .utter('nearest store')
           .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
           .bypassPermission()
           .test();

       TestBuilder.Builder()
           .it('it should return the location intent')
           .utter('Fremont CA' ) // Todo to change to zipcode
           .response(Responsevalues.LOCATION_RESPONSE_SUNNYVALE_STORE_OPEN)
           .test();

       TestBuilder.Builder()
           .it('it should return the no intent#8')
           .utter('no')
           .response(Responsevalues.EXIT_DIALOG)
           .test();

});

//@Test- TC_Location_009b - Scenario#3: Verify whether Google Home responds properly to save the location preference for the first time user.
describe('TC_Location_009b - Scenario#3: Verify whether Google Home responds properly to save the location preference for the first time user.', function () {

   jest.setTimeout(10000);

       TestBuilder.Builder()
           .it('it should return the returning user welcome intent')
           .utter('Talk to Macys dev')//Todo: Ask Macys
           .response(Responsevalues.WELCOME_PROMPT_TODAY)
           .test();

       TestBuilder.Builder()
           .it('it should return the location intent')
           .utter('nearest store')
           .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
           .bypassPermission()
           .test();

       TestBuilder.Builder()
           .it('it should return the question intent for zipcode or location')
           .utter('another location')
           .response(Responsevalues.ASK_FOR_DIFF_LOCATION_EVENTS)
           .test();

       TestBuilder.Builder()
           .it('it should return the location intent')
           .utter('Fremont California')
           .response(Responsevalues.LOCATION_RESPONSE_SUNNYVALE_STORE_OPEN)
           .test();

       TestBuilder.Builder()
           .it('it should return the no intent#8')
           .utter('no')
           .response(Responsevalues.EXIT_DIALOG)
           .test();

});


//@Test- TC_Location_009a - Scenario#2 Verify whether Google Home responds properly to save the location preference for the first time user.
describe('TC_Location_009a - Scenario#2 Verify whether Google Home responds properly to save the location preference for the first time user.', function () {

   jest.setTimeout(10000);

   TestBuilder.Builder()
       .it('it should return the returning user welcome intent')
       //.utter('Open Macys')
       .utter('Talk to Macys dev')//Todo: Ask Macys
       .response(Responsevalues.WELCOME_PROMPT_TODAY)
       .test();

   TestBuilder.Builder()
       .it('it should return the location intent')
       .utter('nearest store')
       .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
       .bypassPermission()
       .test();

   TestBuilder.Builder()
       .it('it should return the question intent for zipcode or location')
       .utter('find another location')
       .response(Responsevalues.ASK_FOR_DIFF_LOCATION_EVENTS)
       .test();

   TestBuilder.Builder()
       .it('it should return the no intent#8')
       .utter('no')
       .response(Responsevalues.EXIT_DIALOG)
       .test();

});

//@Test- TC_Location_009a - Scenario#1: Verify whether Google Home responds properly to save the location preference for the first time user Scenario#1.
describe('TC_Location_009a Scenario#1 - Verify whether Google Home responds properly to save the location preference for the first time user.', function () {

   jest.setTimeout(10000);

   TestBuilder.Builder()
       .it('it should return the returning user welcome intent')
       //.utter('Open Macys')
       .utter('Talk to Macys dev')//Todo: Ask Macys
       .response(Responsevalues.WELCOME_PROMPT_TODAY)
       .test();

   TestBuilder.Builder()
       .it('it should return the location intent')
       .utter('nearest store')
       .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
       .bypassPermission()
       .test();

   TestBuilder.Builder()
       .it('it should return the no intent#8')
       .utter('no')
       .response(Responsevalues.EXIT_DIALOG)
       .test();

});


//@Test- TC_Location_010 - Verify whether Google Home respond properly when the same user using the skill again without saving location preference in the first time.
describe('TC_Location_010 - Verify whether Google Home respond properly when the same user using the skill again without saving location preference in the first time.', function () {

   jest.setTimeout(10000);


   TestBuilder.Builder()
       .it('it should return the returning user welcome intent')
       //.utter('Open Macys')
       .utter('Talk to Macys dev')//Todo: Ask Macys
       .response(Responsevalues.WELCOME_PROMPT_TODAY)
       .test();

   TestBuilder.Builder()
       .it('it should return the location intent')
       .utter('nearest store')
       .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
       .bypassPermission()
       .test();

   TestBuilder.Builder()
       .it('it should return the exit intent and ask user to save location prefernce')
       .utter('stop')
       .response(Responsevalues.EXIT_DIALOG)
       .test();

   TestBuilder.Builder()
       .it('it should return the no intent')
       .utter('no')
       .response(Responsevalues.EXIT_DIALOG_NO)
       .test();

   TestBuilder.Builder()
       .it('it should return the returning user welcome intent')
       .utter('Talk to Macys dev')//Todo: Ask Macys
       .response(Responsevalues.WELCOME_PROMPT_TODAY)
       .test();

   TestBuilder.Builder()
       .it('it should return the location intent')
       .utter('find me a macys')
       .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
       .bypassPermission()
       .test();

   TestBuilder.Builder()
       .it('it should return the exit intent and ask user to save location prefernce')
       .utter('stop')
       .response(Responsevalues.EXIT_DIALOG)
       .test();

});

//@Test- TC_Location_010 - Verify whether Google Home respond properly when the same user using the skill again without saving location preference in the first time.
describe('TC_Location_010 - Verify whether Google Home respond properly when the same user using the skill again without saving location preference in the first time.', function () {

    jest.setTimeout(10000);


    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        //.utter('Open Macys')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the exit intent and ask user to save location prefernce')
        .utter('stop')
        .response(Responsevalues.EXIT_DIALOG)
        .test();

    TestBuilder.Builder()
        .it('it should return the no intent')
        .utter('no')
        .response(Responsevalues.EXIT_DIALOG_NO)
        .test();

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('find me a macys')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the exit intent and ask user to save location prefernce')
        .utter('stop')
        .response(Responsevalues.EXIT_DIALOG)
        .test();

});


//@Test- TC_Location_012 - Prerequiste: Second Time User and saved the location preference before.
//Verify whether Google Home/Alexa responds properly to the second time user for the already saved location preference (saved location is Sunnyvale and G/A should talk about Sunnyvale details).
describe('TC_Location_012 - Verify whether Google Home responds properly to the second time user for the already saved location preference (saved location is Sunnyvale and G/A should talk about Sunnyvale details).', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the exit intent and ask user to save location prefernce')
        .utter('stop')
        .response(Responsevalues.EXIT_DIALOG)
        .test();

    TestBuilder.Builder()
        .it('it should return the yes intent and save the location preference')
        .utter('yes')
        .response(Responsevalues.EXIT_DIALOG_YES)
        .test();

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_RETURN_USER)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('find me a macys')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the exit intent and should not ask user to save location prefernce')
        .utter('stop')
        .response(Responsevalues.EXIT_DIALOG_NO)
        .test();
});


//@Test- TC_Location_013 - Verify whether Google Home responds for Help Command inside Macys Dialog(Intent).
describe('TC_Location_013 - Verify whether Google Home responds for Help Command inside Macys Dialog(Intent)', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Help')
        .response(Responsevalues.HELP_PROMPT)
        .test();

});

//@Test- TC_Location_014 - Verify whether Google Home responds for Help Command invoked directly.
describe('TC_Location_014 - Verify whether Google Home responds for Help Command invoked directly', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Talk about Macys Help')
        .response(Responsevalues.HELP_PROMPT)
        .test();
});

//@Test- TC_Location_015 - Fallback Event: -Fallback Event: User not responding or going idle for sometime.
describe('TC_Location_015 - Fallback Event: User not responding or going idle for sometime.', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        //.utter('Open Macys')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .bypassPermission()
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();


});


//@Test- TC_Location_016-Fallback Event:Verify whether Google Home/Alexa responds for the correct fallback event when asked about other skills(BestBuy) when we are in middle of Macys Skills..
describe('TC_Location_016-Fallback Event: Verify whether Google Home/Alexa responds for the correct fallback event when asked about other skills(BestBuy) when we are in middle of Macys Skills.', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        //.utter('Open Macys')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return fallback event.')
        .utter('Find nearby BestBuy')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();
});


//@Test- TC_Location_016a : Google home asks for out of options within the Macy's intents(Dialog).
describe('TC_Location_016a : Google home asks for out of options within the Macys intents(Dialog).', function () {
    jest.setTimeout(10000);


    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        //.utter('Open Macys')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .bypassPermission()
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return location event.')
        .utter('Find nearby Macys')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

});


//@Test- TC_Location_016b :  Alexa/google home asks for out of options within the Macys intents(Dialog).
describe('TC_Location_016b :  Alexa/google home asks for out of options within the Macys intents(Dialog).', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        //.utter('Open Macys')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return hours event.')
        .utter('Is Macys Open now?')
        .response(Responsevalues.HOURS_RESPONSE_SUNNYVALE_STORE_OPEN)
        .test();
});

//@Test- TC_Location_016c - Scenario#1 :  Alexa/google home asks for out of options within the Macys intents(Dialog).
describe('TC_Location_016c :  Alexa/google home asks for out of options within the Macys intents(Dialog).', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        //.utter('Open Macys')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .bypassPermission()
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return hours event.')
        .utter('What is Macys help')
        .response(Responsevalues.HELP_PROMPT)
        .test();
});

//@Test- TC_Location_016c - Scenario#2 :  Alexa/google home asks for out of options within the Macys intents(Dialog).
describe('TC_Location_016c :  Alexa/google home asks for out of options within the Macys intents(Dialog).', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        //.utter('Open Macys')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .bypassPermission()
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return return policy event.')
        .utter('Star rewards')
        .response(Responsevalues.STAR_REWARDS)
        .test();

});

//@Test- TC_Location_016c - Scenario#3 :  Alexa/google home asks for out of options within the Macys intents(Dialog).
describe('TC_Location_016c :  Alexa/google home asks for out of options within the Macys intents(Dialog).', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .bypassPermission()
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return return policy event.')
        .utter('return policy')
        .response(Responsevalues.RETURN_POLICY)
        .test();
});

//@Test- TC_Location_017 - Fallback Event: Making irrelevant conversation with Macys.
describe('TC_Location_017 - Fallback Event: Making irrelevant conversation with Macys', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the fallback intent')
        .utter('Ask Macys for Pizza')
        .response(Responsevalues.ERROR_DIDNT_UNDERSTAND)
        .test();

});


//@Test- TC_Location_017a - Fallback Event: Making irrelevant conversation with Macys Inside Location Intent.
describe('TC_Location_017a - Fallback Event: Making irrelevant conversation with Macys inside location intent', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return location event.')
        .utter('Where is my pizza shop')
        .response(Responsevalues.ERROR_DIDNT_UNDERSTAND)
        .test();

    TestBuilder.Builder()
        .it('it should return location event.')
        .utter('Find me a pizza shop')
        .response(Responsevalues.ERROR_DIDNT_UNDERSTAND)
        .test();
});


//@Test- TC_Location_018a - scenario#1 Fallback Event: Verify whether Google Home/Alexa respond for the repeat commands .
describe('TC_Location_018a - scenario#1 Verify whether Google Home/Alexa respond for the repeat commands.', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();

    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .bypassPermission()
        .test();

    TestBuilder.Builder()
        .it('it should return the repeat intent')
        .utter('can you please repeat it')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

    TestBuilder.Builder()
        .it('it should return the returnPolicy intent')
        .utter('Ask Macys for help')
        .response(Responsevalues.HELP_PROMPT)
        .test();


    TestBuilder.Builder()
        .it('it should return the repeat intent')
        .utter('can you please repeat it')
        .response(Responsevalues.HELP_PROMPT)
        .test();
});


//@Test- TC_Location_018b - scenario#2 Fallback Event: Verify whether Google Home/Alexa respond for the repeat commands .
describe('TC_Location_018b - scenario#2 Verify whether Google Home/Alexa respond for the repeat commands ', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();


    TestBuilder.Builder()
        .it('it should return the repeat intent')
        .utter('can you please repeat it')
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();


    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Ask Macys for nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();


    TestBuilder.Builder()
        .it('it should return the repeat intent')
        .utter('can you please repeat it')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

});


//@Test- TC_Location_018c - scenario#3 Fallback : Event: Verify whether Google Home/Alexa respond for the repeat commands  .
describe('TC_Location_018c - scenario#3 : Verify whether Google Home/Alexa respond for the repeat commands.', function () {

    jest.setTimeout(10000);

    TestBuilder.Builder()
        .it('it should return the returning user welcome intent')
        .utter('Talk to Macys dev')//Todo: Ask Macys
        .response(Responsevalues.WELCOME_PROMPT_TODAY)
        .test();


    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Ask Macys for nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();


    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('repeat')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();


    TestBuilder.Builder()
        .it('it should return the location intent')
        .utter('Ask Macys for nearest store')
        .response(Responsevalues.LOCATION_RESPONSE_UNIONSQUARE_STORE_OPEN)
        .test();

}); */



async function flushPromises() {
return new Promise(resolve =>

setImmediate(resolve));

}