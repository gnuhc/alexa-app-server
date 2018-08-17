// import constants from '../ConfigConstants';
//
// const client = require('twilio')(constants.TWILIO_SID, constants.TWILIO_TOKEN);
//
// export default class ApiUtil {
//
//     static clientCall(number: string){
//       client.calls.create({
//                      record: true,
//                      url: constants.TWILIO_URL,
//                      to: constants.TWILIO_OUTBOUND,
//                      from: constants.TWILIO_INBOUND,
//                    }, function(err, call) {
//                         if (err) { console.error('There was a problem starting the call: ', err); }
//                         console.log(`Call with sid: ${call.sid} was started`);
//                    })
//                   .then(call => console.log(call.sid))
//                   .done();
//     }
// }
//# sourceMappingURL=ApiUtil.js.map