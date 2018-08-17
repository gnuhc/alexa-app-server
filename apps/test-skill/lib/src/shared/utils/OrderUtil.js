"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MacysFetchObservable_1 = require("./MacysFetchObservable");
const ConfigConstants_1 = require("../ConfigConstants");
const moment = require("moment");
class OrderUtil {
    static getOrders(dateFrom, dateTo) {
        MacysFetchObservable_1.default
            .fetch(ConfigConstants_1.default.MACYS_ORDER_HISTORY_ENDPOINT
            + `customerId=${this.userId}&orderDateFrom=${dateFrom}&orderDateTo=${dateTo}`)
            .subscribe(next => {
            console.log(next.orders.firstName);
        });
    }
}
OrderUtil.userId = 12035538583;
exports.default = OrderUtil;
const formatDateStringForMacys = 'YYYY-MM-DD HH:mm:ss.SSS';
const to = new Date();
const from = new Date();
from.setMonth(to.getMonth() - 4);
OrderUtil.getOrders(moment(from).format(formatDateStringForMacys), moment(to).format(formatDateStringForMacys));
//# sourceMappingURL=OrderUtil.js.map