import 'mocha';
import { expect } from 'chai';
import resources from '../src/etc/resources';
import va = require('virtual-alexa');
import { SkillResponse } from 'virtual-alexa';

const responses = resources.en.translation;
const stubs = [];

const alexa = va.VirtualAlexa.Builder()
    .handler('./lib/m-alexa/src/alexa.handler')
    .applicationID('amzn1.ask.skill.3e22140a-67e4-49b5-b798-d6db7d20740c')
    .interactionModelFile('./interaction-model.json')
    //.skillURL("arn:aws:lambda:us-east-1:029587735831:function:m-alexa-local-alexa")
    .create();


// TODO: error TS2322: Type 'IResponse' is not assignable to type 'SkillResponse'.
//   Property 'response' is missing in type 'IResponse'.

describe('Amazon Standard Intents', () => {
  after(() => stubs.forEach(stub => stub.restore()));


  describe('Launch Intent', () => {
    it('Returns the correct prompt', async () => {
      const result = await alexa.launch();
      // console.log(result.response.outputSpeech.ssml);
      // expect(result.response.outputSpeech.ssml).to.include(responses.WELCOME_PROMPT);
    });
  });

  describe('Help Intent', () => {
    it('Returns the correct prompt', async () => {
      // const result: SkillResponse = await alexa.utter('help');
      // expect(result.response.outputSpeech.ssml).to.include(responses.HELP_PROMPT);
    });
  });

  describe('Cancel Intent', () => {
    it('Returns the correct prompt', async () => {
      // const result: SkillResponse = await alexa.utter('cancel');
      // expect(result.response.outputSpeech.ssml).to.include(responses.GOODBYE);
    });
  });

  describe('Stop Intent', () => {
    it('Returns the correct prompt', async () => {
      // const result: SkillResponse = await alexa.utter('stop');
      // expect(result.response.outputSpeech.ssml).to.include(responses.GOODBYE);
    });
  });
});