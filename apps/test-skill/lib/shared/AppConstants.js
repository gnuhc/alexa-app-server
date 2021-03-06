"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
class AppConstants {
}
// This is used for non-environment specific constants
// Environment specific constants should go in env.yaml
AppConstants.ALEXA_BASE_URL = 'https://api.amazonalexa.com';
AppConstants.GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
AppConstants.GOOGLE_PLACES_KEY = 'AIzaSyCe0FiParApHSuo50eM6aa3kvjWHsKoLqE';
AppConstants.GOOGLE_DISTANCE_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=';
AppConstants.GOOGLE_DISTANCE_KEY = 'AIzaSyA8mtkcHBAJvyxEArt3g6cgnd3-eYOWFX4';
AppConstants.PERM = 'You have refused access to your' +
    'address information. We need address information to give you more information.' +
    'To permit access to address information, ' +
    'consent to provide address information in the home screen of Alexa app.';
AppConstants.MACYS_BASE_URL = 'https://api.macys.com/';
AppConstants.MACYS_STORES_ENDPOINT = AppConstants.MACYS_BASE_URL + 'store/v2/stores?';
AppConstants.MACYS_ORDER_HISTORY_ENDPOINT = AppConstants.MACYS_BASE_URL + 'protected/order/v2/orders?';
AppConstants.MACYS_EVENTS_ENDPOINT = AppConstants.MACYS_BASE_URL + 'store/v1/events?';
AppConstants.MACYS_EVENTS_ENDPOINT_TEMP = 'https://ec2-52-26-230-13.us-west-2.compute.amazonaws.com/events?storeNumber=';
AppConstants.MACYS_HEADERS = {
    headers: {
        'Accept': 'application/json',
        'X-Macys-Webservice-Client-Id': 'nftrmmzqraeak48x3usc6jgd',
    },
    agent: new https.Agent({
        rejectUnauthorized: false
    })
};
AppConstants.TWILIO_SID = 'AC15414f62cc3df7f094fb85dd9ccae1e6';
AppConstants.TWILIO_TOKEN = 'fe7514b24263ba91c04aed7bd165aadd';
AppConstants.TWILIO_URL = 'https://m-twilio.herokuapp.com/connect';
AppConstants.TWILIO_INBOUND = '+14159803463';
AppConstants.TWILIO_OUTBOUND = '+17143370112';
AppConstants.PST = 'America/Los_Angeles';
exports.default = AppConstants;
/*

    TODO: remove agent - rejectUnauthorized when there is a supported events api
          - the api i created has a self signed cert. node-fetch checks to make sure
          the service it is talking to is valid, however since my service is a self
          signed cert it doesnt know whether to really trust is so then it throws an error.
          passing in agent rejectUnauthorized, says even if you dont have confidency to trust it
          just continue through.


    FetchError: request to https://ec2-52-26-230-13.us-west-2.compute.amazonaws.com/events?storeNumber=340 failed, reason: self signed certificate
    at ClientRequest.<anonymous> (/user_code/node_modules/node-fetch/lib/index.js:1393:11)
    at emitOne (events.js:96:13)
    at ClientRequest.emit (events.js:188:7)
    at TLSSocket.socketErrorListener (_http_client.js:310:9)
    at emitOne (events.js:96:13)
    at TLSSocket.emit (events.js:188:7)
    at emitErrorNT (net.js:1296:8)
    at _combinedTickCallback (internal/process/next_tick.js:80:11)
    at process._tickDomainCallback (internal/process/next_tick.js:128:9)
      message: 'request to https://ec2-52-26-230-13.us-west-2.compute.amazonaws.com/events?storeNumber=340 failed, reason: self signed certificate',
      type: 'system',
      errno: 'DEPTH_ZERO_SELF_SIGNED_CERT',
      code: 'DEPTH_ZERO_SELF_SIGNED_CERT' }

 */ 
//# sourceMappingURL=AppConstants.js.map