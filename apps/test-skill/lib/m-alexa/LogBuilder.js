"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require('log4js'); // include log4js
//configure('./filename');
const loggerinfo = log4js.getLogger('info'); // initialize the var to use.
const loggererror = log4js.getLogger('error'); // initialize the var to use.
const loggerdebug = log4js.getLogger('debug'); // initialize the var to use.
log4js.configure({
    appenders: { out: { type: 'file', filename: 'logs/info.log' } },
    categories: { default: { appenders: ['out'], level: 'info' } }
});
log4js.configure({
    appenders: { out: { type: 'file', filename: 'logs/error.log' } },
    categories: { default: { appenders: ['out'], level: 'error' } }
});
log4js.configure({
    appenders: { 'out': { type: 'file', filename: 'logs/debug.log', backups: 1 } },
    categories: { default: { appenders: ['out'], level: 'debug' } }
});
class LogBuilder {
    logdata(logdataStr) {
        this.logdataStr = logdataStr;
        return this;
    }
    LogInfo(logdataStr) {
        loggerinfo.info(logdataStr);
    }
    LogError(logdataStr) {
        loggererror.info(logdataStr);
    }
    LogDebug(logdataStr) {
        loggerdebug.info(logdataStr);
    }
}
exports.default = LogBuilder;
//# sourceMappingURL=LogBuilder.js.map