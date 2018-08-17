import * as Alexa from 'alexa-sdk';
import resources from './etc/resources';
import LaunchHandler from './handlers/LaunchHandler';
import EventsExistHandler from './handlers/EventsExistHandler';
import EventsNotExistHandler from './handlers/EventsNotExistHandler';
import EventsMainExistHandler from './handlers/EventsMainExistHandler';
import EventsMainOneExistHandler from './handlers/EventsMainOneExistHandler';
import EventsMainNotExistHandler from './handlers/EventsMainNotExistHandler';
import FAQQuestionHandler from './handlers/FAQQuestionHandler';
import ExitHandler from './handlers/ExitHandler';

export const handler = ((event: any, context: any, callback: any) => {
  const alexa = Alexa.handler(event, context); // TODO: Handle exceptions.
  alexa.appId = process.env.alexa_app_id;
  alexa.resources = resources;
  alexa.registerHandlers(LaunchHandler.handler(),
    Alexa.CreateStateHandler('EVENTS_NOT_EXIST', (EventsNotExistHandler.handler())),
    Alexa.CreateStateHandler('EVENTS_EXIST', (EventsExistHandler.handler())),
    Alexa.CreateStateHandler('EVENTS_MAIN_EXIST', (EventsMainExistHandler.handler())),
    Alexa.CreateStateHandler('EVENTS_MAIN_ONE_EXIST', (EventsMainOneExistHandler.handler())),
    Alexa.CreateStateHandler('EVENTS_MAIN_NOT_EXIST', (EventsMainNotExistHandler.handler())),
    Alexa.CreateStateHandler('FAQ', (FAQQuestionHandler.handler())),
    Alexa.CreateStateHandler('EXIT', (ExitHandler.handler())),
  );
  alexa.execute();
});