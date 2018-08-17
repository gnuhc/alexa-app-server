
import AWS = require('aws-sdk');
import User from '../models/User';
import _ = require('lodash');

export default class DynamoDBUtil{

  creds: any;
  dynamodb: any;
  docClient: any;

  constructor(alexa: any) {
  	this.creds = new AWS.Credentials({
      accessKeyId: process.env.aws_access_key,
      secretAccessKey: process.env.aws_secret_key,
    });

    AWS.config.credentials = this.creds;
    AWS.config.update({ region: 'us-east-1' });
    this.dynamodb = new AWS.DynamoDB();
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  async find(_alexaUserId) {
    const response = await this.getUser(_alexaUserId);
    const attrs = _.get(response, 'Items[0]');
    if (typeof(attrs) == 'undefined' || !attrs) {
      return false;
    } else {
      return true;
    }
  }

  async findOrInitiate(_alexaUserId) {
    const response = await this.getUser(_alexaUserId);
    const attrs = _.get(response, 'Items[0]');
    if (!attrs) {
    	return new User(_alexaUserId, false);
    }
    return new User(_alexaUserId, true);
  }

  async findAttributes(_alexaUserId){
    const response = await this.getUser(_alexaUserId);
    const attrs = _.get(response, 'Items[0]');
    if(!!attrs) {
      return attrs.attributes;
    }
    return undefined;
  }

  updateUser(_alexaUserId, attributes, user) {

  	const attrToString = JSON.stringify(attributes);
  	let params = {
  	  TableName: process.env.user_table_name,
  	  Item: {
  	    alexaUserId: { S: _alexaUserId },
  	    attributes: { S: attrToString },
  	  },
  	};

  	this.dynamodb.putItem(params, (err) => {
  	  if (err) {
  	    console.log(err);
  	  }
  	});
  }

  getUser(alexaUserId) {
  	const params = {
	  TableName: process.env.user_table_name,
	  KeyConditionExpression: '#alexaUserId = :alexaUserId',
	  ExpressionAttributeNames: {
	    '#alexaUserId': 'alexaUserId',
	  },
	  ExpressionAttributeValues: {
	    ':alexaUserId': alexaUserId,
	  },
	};

	return this.docClient.query(params).promise();
  }
}
