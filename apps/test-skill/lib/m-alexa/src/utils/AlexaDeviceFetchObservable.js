"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const Rx_1 = require("rxjs/Rx");
class AlexaDeviceFetchObservable {
    static fetch(url, options) {
        return Rx_1.Observable.create(observer => {
            node_fetch_1.default(url, options)
                .then(response => response.json())
                .then(data => {
                observer.next(data);
                observer.complete();
            })
                .catch(err => observer.error(err));
        });
    }
}
exports.default = AlexaDeviceFetchObservable;
//# sourceMappingURL=AlexaDeviceFetchObservable.js.map