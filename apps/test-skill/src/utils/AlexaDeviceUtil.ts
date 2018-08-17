import { Observable } from 'rxjs/Observable';
import ConfigConstants from '../../../shared/ConfigConstants';
import AlexaDeviceFetchObservable from './AlexaDeviceFetchObservable';
import GoogleAPIObservable from '../../../shared/utils/GoogleAPIObservable';
import Coordinate from '../../../shared/models/Coordinate';
import AgentConstants from '../../../shared/AgentConstants';

export default class AlexaDeviceUtil {
    deviceId: string;
    consentToken: string;
    endpoint: string;

    constructor(event) {
        this.deviceId = event.context.System.device.deviceId;
        this.consentToken = event.context.System.apiAccessToken;
        this.endpoint = event.context.System.apiEndpoint.replace(/^https?:\/\//i, '');
    }

    checkAddressPermission(): Promise<any> {
      const observable = this.getAddress()
      .map(res => (res.hasOwnProperty('type') && res.type === 'FORBIDDEN') ? false : true);
      return observable.toPromise();
    }

    getAddress(): Observable<any> {
      const url = ConfigConstants.ALEXA_BASE_URL + `/v1/devices/${this.deviceId}/settings/address`;

      return AlexaDeviceFetchObservable
      .fetch<any>(url, this.getOptions())
      .map(res => res);
    }

    getCountryAndPostalCode(): Observable<any> {
      const url = ConfigConstants.ALEXA_BASE_URL + `/v1/devices/${this.deviceId}/settings/address/countryAndPostalCode`;
      return AlexaDeviceFetchObservable
      .fetch<any>(url, this.getOptions())
      .map(res => res);
    }

    getCoordinates(address: string): Observable<any> {
      const url = ConfigConstants.GOOGLE_PLACES_URL + `${address}&key=` + ConfigConstants.GOOGLE_PLACES_KEY;
      return GoogleAPIObservable
      .fetch<any>(url)
      .map(res => res.results[0].geometry.location);
    }

    getDateSlotValue(alexa: any) {
      if ((alexa.event.request.intent.slots).hasOwnProperty('date')) {
        return alexa.event.request.intent.slots.date.value;
      }
    }

    getOptions(){
      return {
        headers: {
          'Authorization': 'Bearer ' + this.consentToken
        }
      }
    }

    getLatLng(conv: any): Promise<any>{
      const observable =
      this.getAddress()
      .switchMap(res => {
        if (res) {
          if (res.addressLine1 != null && res.city != null) {
            conv.saveToStorage('user_address', res.addressLine1 + ' ' + res.city + ' ' + res.postalCode);
          } else {
            conv.saveToStorage('user_address', res.postalCode);  
          }
          return this.getCoordinates(conv.getStorage('user_address')); 
        } else {
          return Observable.empty();     
        }
      })
      .switchMap(res => {
        if (res) {
          conv.saveToStorage(AgentConstants.STORAGE_USER_COORDINATES, new Coordinate(res.lat, res.lng));
          console.log("USER COORD SAVED: " + JSON.stringify(conv.getStorage(AgentConstants.STORAGE_USER_COORDINATES)))
          return Observable.of(conv);
        } else {
          return Observable.empty();
        }
      })
      return observable.toPromise();
    }

    checkSlotValue(alexa, alexaConvo){
      if (typeof(this.getDateSlotValue(alexa)) != 'undefined') {
        if (this.getDateSlotValue(alexa) == '2018-W29-WE') {
          alexaConvo.saveToStorage('weekend', this.getDateSlotValue(alexa));
        } else {
          alexaConvo.saveToStorage('date', this.getDateSlotValue(alexa));
        }
      }
      return alexaConvo;
    }
}
