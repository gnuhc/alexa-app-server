"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const Rx_1 = require("rxjs/Rx");
const ConfigConstants_1 = require("../ConfigConstants");
class MacysFetchObservable {
    static fetch(url) {
        return Rx_1.Observable
            .fromPromise(node_fetch_1.default(url, ConfigConstants_1.default.MACYS_HEADERS))
            .flatMap(res => res.json());
    }
}
exports.default = MacysFetchObservable;
//# sourceMappingURL=MacysFetchObservable.js.map