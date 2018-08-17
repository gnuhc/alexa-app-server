"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const User_1 = require("../models/User");
const _ = require("lodash");
class DataStoreUtil {
    constructor(alexa) {
        this.creds = new AWS.Credentials({
            accessKeyId: process.env.aws_access_key,
            secretAccessKey: process.env.aws_secret_key,
        });
        AWS.config.credentials = this.creds;
        AWS.config.update({ region: 'us-east-1' });
        this.dynamodb = new AWS.DynamoDB();
        this.docClient = new AWS.DynamoDB.DocumentClient();
    }
    find(_alexaUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getUser(_alexaUserId);
            const attrs = _.get(response, 'Items[0]');
            console.log("GOT ATTRIBUTES FIND: " + JSON.stringify(attrs));
            if (typeof (attrs) == 'undefined' || !attrs) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    findOrInitiate(_alexaUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getUser(_alexaUserId);
            const attrs = _.get(response, 'Items[0]');
            console.log("GOT ATTRIBUTES FIND: " + JSON.stringify(attrs));
            if (!attrs) {
                console.log("ATTRIBUTES FIND: " + JSON.stringify(attrs));
                //this.updateUser(_alexaUserId, alexa);
                return new User_1.default(_alexaUserId, false);
            }
            return new User_1.default(_alexaUserId, true);
        });
    }
    findAttributes(_alexaUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getUser(_alexaUserId);
            const attrs = _.get(response, 'Items[0]');
            console.log("GOT ATTRIBUTES FIND1: " + JSON.stringify(attrs));
            return attrs.attributes;
        });
    }
    updateUser(_alexaUserId, attributes, user) {
        console.log("ALEXAIDDDD: " + JSON.stringify(_alexaUserId));
        const attrToString = JSON.stringify(attributes);
        let params = {
            TableName: 'UserAttributes',
            Item: {
                alexaUserId: { S: _alexaUserId },
                attributes: { S: attrToString },
            },
        };
        console.log("UPDATE USER");
        this.dynamodb.putItem(params, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    getUser(alexaUserId) {
        const params = {
            TableName: 'UserAttributes',
            KeyConditionExpression: '#alexaUserId = :alexaUserId',
            ExpressionAttributeNames: {
                '#alexaUserId': 'alexaUserId',
            },
            ExpressionAttributeValues: {
                ':alexaUserId': alexaUserId,
            },
        };
        console.log("GET USER");
        return this.docClient.query(params).promise();
    }
}
exports.default = DataStoreUtil;
//# sourceMappingURL=DataStoreUtil.js.map