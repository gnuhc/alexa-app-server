"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const Rx_1 = require("rxjs/Rx");
class GoogleAPIObservable {
    static fetch(url) {
        return Rx_1.Observable
            .fromPromise(node_fetch_1.default(url))
            .flatMap(res => res.json());
    }
}
exports.default = GoogleAPIObservable;
//# sourceMappingURL=GoogleAPIObservable.js.map