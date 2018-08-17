"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataStoreUtil {
}
exports.default = DataStoreUtil;
// import AWS = require('aws-sdk');
// import User from '../models/User';
// import _ = require('lodash');
//
// export default class DataStoreUtil{
//
//   creds: any;
//   dynamodb: any;
//   docClient: any;
//
//   constructor(alexa: any) {
//   	this.creds = new AWS.Credentials({
//       accessKeyId: process.env.aws_access_key,
//       secretAccessKey: process.env.aws_secret_key,
//     });
//
//     AWS.config.credentials = this.creds;
//     AWS.config.update({ region: 'us-east-1' });
//     this.dynamodb = new AWS.DynamoDB();
//     this.docClient = new AWS.DynamoDB.DocumentClient();
//   }
//
//   async find(_alexaUserId) {
//     const response = await this.getUser(_alexaUserId);
//     const attrs = _.get(response, 'Items[0]');
//         	console.log("GOT ATTRIBUTES FIND: " + JSON.stringify(attrs));
//     if (typeof(attrs) == 'undefined' || !attrs) {
//       return false;
//     }else{
//       return true;
//     }
//   }
//
//   async findOrInitiate(_alexaUserId) {
//     const response = await this.getUser(_alexaUserId);
//     const attrs = _.get(response, 'Items[0]');
//         	console.log("GOT ATTRIBUTES FIND: " + JSON.stringify(attrs));
//     if (!attrs) {
//     	console.log("ATTRIBUTES FIND: " + JSON.stringify(attrs));
//     	//this.updateUser(_alexaUserId, alexa);
//     	return new User(_alexaUserId, false);
//     }
//     return new User(_alexaUserId, true);
//   }
//
//   async findAttributes(_alexaUserId){
//     const response = await this.getUser(_alexaUserId);
//     const attrs = _.get(response, 'Items[0]');
//         	console.log("GOT ATTRIBUTES FIND1: " + JSON.stringify(attrs));
//     return attrs.attributes;
//   }
//
//   updateUser(_alexaUserId, attributes, user) {
//   	console.log("ALEXAIDDDD: " + JSON.stringify(_alexaUserId));
//   	const attrToString = JSON.stringify(attributes);
// 	let params = {
// 	  TableName: 'UserAttributes',
// 	  Item: {
// 	    alexaUserId: { S: _alexaUserId },
// 	    attributes: { S: attrToString },
// 	  },
// 	};
//     	console.log("UPDATE USER");
//
// 	this.dynamodb.putItem(params, (err) => {
// 	  if (err) {
// 	    console.log(err);
// 	  }
// 	});
//   }
//
//   getUser(alexaUserId) {
//   	const params = {
// 	  TableName: 'UserAttributes',
// 	  KeyConditionExpression: '#alexaUserId = :alexaUserId',
// 	  ExpressionAttributeNames: {
// 	    '#alexaUserId': 'alexaUserId',
// 	  },
// 	  ExpressionAttributeValues: {
// 	    ':alexaUserId': alexaUserId,
// 	  },
// 	};
//     	console.log("GET USER");
//
// 	return this.docClient.query(params).promise();
//   }
// }
//# sourceMappingURL=DataStoreUtil.js.map