import { configure, getLogger } from 'log4js';


const log4js = require('log4js'); // include log4js
//configure('./filename');


		const loggerinfo  = log4js.getLogger('info');      // initialize the var to use.
		const loggererror = log4js.getLogger('error');		// initialize the var to use.
		const loggerdebug = log4js.getLogger('debug');  	// initialize the var to use.

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


export default class LogBuilder {
	private logdataStr: string;

	logdata(logdataStr: string): LogBuilder {
        this.logdataStr = logdataStr;
        return this;
    }

    LogInfo(logdataStr : string) {

    	loggerinfo.info(logdataStr);          
	}

	LogError(logdataStr : string) {
    	loggererror.info(logdataStr);          
	}

	LogDebug(logdataStr : string) {
    	loggerdebug.info(logdataStr);          
	}
}
