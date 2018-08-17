import fetch from 'node-fetch';
import { Observable } from 'rxjs/Rx';

export default class AlexaDeviceFetchObservable {
    static fetch<T>(url : string, options: any) : Observable<T> {
        return Observable.create(observer => {
                 fetch(url, options)
                   .then(response => response.json())
				   .then(data => {
				     observer.next(data);
				     observer.complete();
				   })
			       .catch(err => observer.error(err));
                 })
    }
}
