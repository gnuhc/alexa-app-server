
import * as assert from 'assert';
import LogBuilder from './LogBuilder';
import resources from './src/etc/resources';

const log = new LogBuilder();

import va = require('virtual-alexa');


const Excel = require('exceljs');
const responses = resources.en.translation;
const stubs = [];

const alexa = va.VirtualAlexa.Builder()
    .handler('./lib/m-alexa/src/alexa.handler')
    .applicationID('amzn1.ask.skill.3e22140a-67e4-49b5-b798-d6db7d20740c')
    .interactionModelFile('./src/interaction-model.json')
    //.skillURL("arn:aws:lambda:us-east-1:029587735831:function:m-alexa-local-alexa")
    .create();

export default class TestBuilder {

    static Builder(): TestBuilder {
        return new TestBuilder();
    }

    private utterance: string;
    private intent: string;
    private entities: string [];
    private speech: string;

    // properties for testing framework
    private itStr: string;
    private responseStr: string;
    private describeStr: string;
    private filenameStr: string;
    private sheetnameStr: string;
    private intentialIntent: string;
    private intentialEntities: object;
    private isExcelReader: boolean;

    it(itStr: string): TestBuilder {
        this.itStr = itStr;
        return this;
    }

    describeFor(describeStr: string): TestBuilder {
        this.describeStr = describeStr;
        return this;
    }

    response(responseStr: string): TestBuilder {
        this.responseStr = responseStr;
        return this;
    }

    utter(utterance: string): TestBuilder {
        this.utterance = utterance;
        return this;
    }

    filename(filenameStr: string): TestBuilder {
        this.filenameStr = filenameStr;
        return this;
    }

    ExcelReader(isExcelReader: boolean): TestBuilder {
        this.isExcelReader = true;
        return this;

    }

    sheetname(sheetnameStr: string): TestBuilder {
        this.sheetnameStr = sheetnameStr;
        return this;
    }

    intend(intentName: string, entities: object): TestBuilder {
        this.intentialIntent = intentName;
        this.intentialEntities = entities;
        return this;
    }

    intentExpected(intent: string): TestBuilder {
        this.intent = intent;
        return this;
    }

    entititesExpected(entities: string []): TestBuilder {
        this.entities = entities;
        return this;
    }

    textToSpeechExpected(speech: string): TestBuilder {
        this.speech = speech;
        return this;
    }

    bypassPermission(): TestBuilder {
        alexa.filter((request) => {
            // Do something with the request
            request.queryResult.parameters.automation = true; // Arbitrary example of changing the request payload
        });
        return this;
    }


    test() {
        if (this.isExcelReader)
        {
         //   let  a = (async () => {
                console.log('its not IT');
                TestBuilder.SendRequest(this.utterance, this.intentialIntent, this.intentialEntities, this.itStr, this.describeStr, this.responseStr, this.isExcelReader);
           // });
            //a();
            expect(true);
            return true;
        }
        it(this.utterance, async () => {

            await TestBuilder.SendRequest(this.utterance, this.intentialIntent, this.intentialEntities, this.itStr, this.describeStr, this.responseStr, this.isExcelReader);
        });

        expect(true);
        return true;
    }

    private static async SendRequest(utter, intentialIntent, intentialEntities, itstr, desc, globalRes, isExcel) {
        let res2;

        if (!utter && !intentialIntent) {
            console.log('make sure to use either utter or intend')
            assert(false);
        }
        if (utter) {
            console.log('utter1: ' + JSON.stringify(utter));
            res2 = await alexa.utter(utter);
        }
        else {
            console.log('huh' + intentialIntent + ' ' + intentialEntities);
            res2 = await alexa.intend(intentialIntent, intentialEntities);
            console.log(JSON.stringify(intentialEntities));
        }

        if (isExcel) {
            log.logdata('****** ' + utter + ' *****')
            log.LogInfo(res2.response.outputSpeech.ssml);
        }
        else {
            console.log('res2: ' + JSON.stringify(res2));
            if (desc) {
                log.LogInfo("***********************************************************************");
                log.LogInfo(desc);
            }
            if (itstr) {
                log.LogInfo("***********************************************************************");
                log.LogInfo(itstr);
            }
            TestBuilder.verifyUserResponse(utter, !(res2.response.shouldEndSession), res2.response.outputSpeech.ssml, itstr, globalRes);
        }
    }

    private static verifyUserResponse(utter, responseSuccess, responseData, itStr, response) {
        //log.LogInfo(itStr);
        if (responseSuccess === true) {
            console.log('Inside Success');
            //console.log(data);
            log.LogInfo("***********************************************************************");

            log.LogInfo('****   Utterances:  **** ' + utter);

            //var str = "Apples are round, and apples are juicy.";
            if (response) {
                console.log('Inside Response');

                if (responseData.replace(/\s+/g, ' ').trim() === response.replace(/\s+/g, ' ').trim()) {
                    log.LogInfo("**** Response  Matching  *** ");
                    log.LogInfo(responseData.replace(/\s+/g, ' ').trim());
                    log.LogInfo("****  Response from Global.ts ***");
                    log.LogInfo(response.replace(/\s+/g, ' ').trim());

                } else {
                    //log.LogInfo("*****************");
                    log.LogInfo("**** Response  Not Matching  *** ");
                    log.LogInfo(responseData.replace(/\s+/g, ' ').trim());
                    log.LogInfo("****  Response from Global.ts ***");
                    log.LogInfo(response.replace(/\s+/g, ' ').trim());
                }
            }
            log.LogInfo("***********************************************************************");
        }
        else {
            console.log('Inside Else');
            log.LogInfo('*****  Utterances: **** ' + utter);
            log.LogInfo("****  Error  ****" + "  " + responseData);
        }
    }


}