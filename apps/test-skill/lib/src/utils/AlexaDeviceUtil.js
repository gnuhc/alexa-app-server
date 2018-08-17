"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
const ConfigConstants_1 = require("../shared/ConfigConstants");
const AlexaDeviceFetchObservable_1 = require("./AlexaDeviceFetchObservable");
const GoogleAPIObservable_1 = require("../shared/utils/GoogleAPIObservable");
const Coordinate_1 = require("../shared/models/Coordinate");
const AgentConstants_1 = require("../shared/AgentConstants");
class AlexaDeviceUtil {
    constructor(event) {
        this.deviceId = event.context.System.device.deviceId;
        this.consentToken = event.context.System.apiAccessToken;
        this.endpoint = event.context.System.apiEndpoint.replace(/^https?:\/\//i, '');
    }
    checkAddressPermission() {
        return this.getAddress()
            .map(res => (res.hasOwnProperty('type') && res.type === 'FORBIDDEN') ? false : true);
    }
    getAddress() {
        const url = ConfigConstants_1.default.ALEXA_BASE_URL + `/v1/devices/${this.deviceId}/settings/address`;
        return AlexaDeviceFetchObservable_1.default
            .fetch(url, this.getOptions())
            .map(res => res);
    }
    getCountryAndPostalCode() {
        const url = ConfigConstants_1.default.ALEXA_BASE_URL + `/v1/devices/${this.deviceId}/settings/address/countryAndPostalCode`;
        return AlexaDeviceFetchObservable_1.default
            .fetch(url, this.getOptions())
            .map(res => res);
    }
    getCoordinates(address) {
        const url = ConfigConstants_1.default.GOOGLE_PLACES_URL + `${address}&key=` + ConfigConstants_1.default.GOOGLE_PLACES_KEY;
        return GoogleAPIObservable_1.default
            .fetch(url)
            .map(res => res.results[0].geometry.location);
    }
    getDateSlotValue(alexa) {
        if ((alexa.event.request.intent.slots).hasOwnProperty('date')) {
            return alexa.event.request.intent.slots.date.value;
        }
    }
    getOptions() {
        return {
            headers: {
                'Authorization': 'Bearer ' + this.consentToken
            }
        };
    }
    getLatLng(conv) {
        const observable = this.getAddress()
            .switchMap(res => {
            if (res) {
                if (res.addressLine1 != null && res.city != null) {
                    conv.saveToStorage('user_address', res.addressLine1 + ' ' + res.city + ' ' + res.postalCode);
                }
                else {
                    conv.saveToStorage('user_address', res.postalCode);
                }
                return this.getCoordinates(conv.getStorage('user_address'));
            }
            else {
                return Observable_1.Observable.empty();
            }
        })
            .switchMap(res => {
            if (res) {
                conv.saveToStorage(AgentConstants_1.default.STORAGE_USER_COORDINATES, new Coordinate_1.default(res.lat, res.lng));
                return Observable_1.Observable.of(conv);
            }
            else {
                return Observable_1.Observable.empty();
            }
        });
        return observable;
    }
    checkSlotValue(alexa, alexaConvo) {
        if (typeof (this.getDateSlotValue(alexa)) != 'undefined') {
            if (this.getDateSlotValue(alexa) == '2018-W29-WE') {
                alexaConvo.saveToStorage('weekend', this.getDateSlotValue(alexa));
            }
            else {
                alexaConvo.saveToStorage('date', this.getDateSlotValue(alexa));
            }
        }
        return alexaConvo;
    }
}
exports.default = AlexaDeviceUtil;
//# sourceMappingURL=AlexaDeviceUtil.js.map