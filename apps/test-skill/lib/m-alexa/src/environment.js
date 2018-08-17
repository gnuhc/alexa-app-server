"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml"); // eslint-disable-line import/no-extraneous-dependencies
// Only loaded in local dev environment
// ENVs are loaded by serverless.yml in staging/production
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'local') {
    const envs = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../env.yaml')));
    Object.keys(envs.local).forEach((key) => {
        process.env[key] = envs.local[key];
    });
}
//# sourceMappingURL=environment.js.map