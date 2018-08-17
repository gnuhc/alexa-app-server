"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
class ConfigConstants {
}
// This is used for non-environment specific constants
// Environment specific constants should go in env.yaml
ConfigConstants.ALEXA_BASE_URL = 'https://api.amazonalexa.com';
ConfigConstants.GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
ConfigConstants.GOOGLE_PLACES_KEY = 'AIzaSyCe0FiParApHSuo50eM6aa3kvjWHsKoLqE';
ConfigConstants.PERM = 'You have refused access to your' +
    'address information. We need address information to give you more information.' +
    'To permit access to address information, ' +
    'consent to provide address information in the home screen of Alexa app.';
ConfigConstants.MACYS_BASE_URL = 'https://api.macys.com/';
ConfigConstants.MACYS_STORES_ENDPOINT = ConfigConstants.MACYS_BASE_URL + 'store/v2/stores?';
ConfigConstants.MACYS_ORDER_HISTORY_ENDPOINT = ConfigConstants.MACYS_BASE_URL + 'protected/order/v2/orders?';
ConfigConstants.MACYS_EVENTS_ENDPOINT = ConfigConstants.MACYS_BASE_URL + 'store/v1/events?';
ConfigConstants.MACYS_EVENTS_ENDPOINT_TEMP = 'https://ec2-52-26-230-13.us-west-2.compute.amazonaws.com/events?storeNumber=';
ConfigConstants.MACYS_HEADERS = {
    headers: {
        'Accept': 'application/json',
        'X-Macys-Webservice-Client-Id': 'nftrmmzqraeak48x3usc6jgd',
    },
    agent: new https.Agent({
        rejectUnauthorized: false
    })
};
exports.default = ConfigConstants;
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
//# sourceMappingURL=ConfigConstants.js.map