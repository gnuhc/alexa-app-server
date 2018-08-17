"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const LogBuilder_1 = require("./LogBuilder");
const resources_1 = require("./src/etc/resources");
const log = new LogBuilder_1.default();
const va = require("virtual-alexa");
const Excel = require('exceljs');
const responses = resources_1.default.en.translation;
const stubs = [];
const alexa = va.VirtualAlexa.Builder()
    .handler('./lib/m-alexa/src/alexa.handler')
    .applicationID('amzn1.ask.skill.3e22140a-67e4-49b5-b798-d6db7d20740c')
    .interactionModelFile('./src/interaction-model.json')
    //.skillURL("arn:aws:lambda:us-east-1:029587735831:function:m-alexa-local-alexa")
    .create();
class TestBuilder {
    static Builder() {
        return new TestBuilder();
    }
    it(itStr) {
        this.itStr = itStr;
        return this;
    }
    describeFor(describeStr) {
        this.describeStr = describeStr;
        return this;
    }
    response(responseStr) {
        this.responseStr = responseStr;
        return this;
    }
    utter(utterance) {
        this.utterance = utterance;
        return this;
    }
    filename(filenameStr) {
        this.filenameStr = filenameStr;
        return this;
    }
    ExcelReader(isExcelReader) {
        this.isExcelReader = true;
        return this;
    }
    sheetname(sheetnameStr) {
        this.sheetnameStr = sheetnameStr;
        return this;
    }
    intend(intentName, entities) {
        this.intentialIntent = intentName;
        this.intentialEntities = entities;
        return this;
    }
    intentExpected(intent) {
        this.intent = intent;
        return this;
    }
    entititesExpected(entities) {
        this.entities = entities;
        return this;
    }
    textToSpeechExpected(speech) {
        this.speech = speech;
        return this;
    }
    bypassPermission() {
        alexa.filter((request) => {
            // Do something with the request
            request.queryResult.parameters.automation = true; // Arbitrary example of changing the request payload
        });
        return this;
    }
    test() {
        if (this.isExcelReader) {
            //   let  a = (async () => {
            console.log('its not IT');
            TestBuilder.SendRequest(this.utterance, this.intentialIntent, this.intentialEntities, this.itStr, this.describeStr, this.responseStr, this.isExcelReader);
            // });
            //a();
            expect(true);
            return true;
        }
        it(this.utterance, () => __awaiter(this, void 0, void 0, function* () {
            yield TestBuilder.SendRequest(this.utterance, this.intentialIntent, this.intentialEntities, this.itStr, this.describeStr, this.responseStr, this.isExcelReader);
        }));
        expect(true);
        return true;
    }
    static SendRequest(utter, intentialIntent, intentialEntities, itstr, desc, globalRes, isExcel) {
        return __awaiter(this, void 0, void 0, function* () {
            let res2;
            if (!utter && !intentialIntent) {
                console.log('make sure to use either utter or intend');
                assert(false);
            }
            if (utter) {
                console.log('utter1: ' + JSON.stringify(utter));
                res2 = yield alexa.utter(utter);
            }
            else {
                console.log('huh' + intentialIntent + ' ' + intentialEntities);
                res2 = yield alexa.intend(intentialIntent, intentialEntities);
                console.log(JSON.stringify(intentialEntities));
            }
            if (isExcel) {
                log.logdata('****** ' + utter + ' *****');
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
        });
    }
    static verifyUserResponse(utter, responseSuccess, responseData, itStr, response) {
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
                }
                else {
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
exports.default = TestBuilder;
//# sourceMappingURL=TestBuilder.js.map