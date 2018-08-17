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
const virtual_google_assistant_1 = require("virtual-google-assistant");
const assert = require("assert");
const LogBuilder_1 = require("./LogBuilder");
const log = new LogBuilder_1.default();
const ga = virtual_google_assistant_1.VirtualGoogleAssistant.Builder()
    //.actionUrl('https://us-central1-ma-app-dacb4.cloudfunctions.net/mapp')
    .actionUrl('https://us-central1-mtech-ghome-dev.cloudfunctions.net/mapp')
    .directory('./ma-app')
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
        ga.addFilter((request) => {
            // Do something with the request
            request.queryResult.parameters.automation = true; // Arbitrary example of changing the request payload
        });
        return this;
    }
    test() {
        it(this.utterance, () => __awaiter(this, void 0, void 0, function* () {
            /* if (!this.utterance && !this.intentialIntent) {
                 console.log('make sure to use either utter or intend')
                 assert(false);
             }
             let res2;
             if (this.utterance) {
                 //console.log('utter');
                 res2 = await ga.utter(this.utterance);
             } else {
                 console.log('huh'+this.intentialIntent+ ' '+this.intentialEntities);
                 res2 = await ga.intend(this.intentialIntent, this.intentialEntities);
                 console.log(JSON.stringify(this.intentialEntities));
             }*/
            TestBuilder.SendRequest(this.utterance, this.intentialIntent, this.intentialEntities, this.itStr, this.describeStr, this.responseStr);
        }));
        //log.LogInfo("***********************************************************************");
        expect(true);
        return true;
    }
    static SendRequest(utter, intentialIntent, intentialEntities, itstr, desc, globalRes) {
        let res2;
        let a = (() => __awaiter(this, void 0, void 0, function* () {
            if (!utter && !intentialIntent) {
                console.log('make sure to use either utter or intend');
                assert(false);
            }
            if (utter) {
                //console.log('utter');
                res2 = yield ga.utter(utter);
            }
            else {
                console.log('huh' + intentialIntent + ' ' + intentialEntities);
                res2 = yield ga.intend(intentialIntent, intentialEntities);
                console.log(JSON.stringify(intentialEntities));
            }
            if (desc) {
                log.LogInfo("***********************************************************************");
                log.LogInfo(desc);
            }
            if (itstr) {
                log.LogInfo("***********************************************************************");
                log.LogInfo(itstr);
            }
            TestBuilder.verifyUserResponse(utter, res2.payload.google.expectUserResponse, res2.payload.google.richResponse.items[0].simpleResponse.textToSpeech, itstr, globalRes);
        }));
        a();
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
//# sourceMappingURL=TestBuilder copy.js.map