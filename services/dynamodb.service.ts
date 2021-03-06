import { HttpNotFoundError } from '@floteam/errors';
import { getEnv } from '@helper/environment';
import { ObjectType } from '@interfaces/api-gateway-lambda.interface';
import { config, DynamoDB } from 'aws-sdk';
import {
  AttributeMap,
  GetItemInput,
  PutItemInput,
  PutItemOutput,
  QueryInput,
  ScanInput,
  UpdateItemInput,
} from 'aws-sdk/clients/dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { accessKeyId, secretAccessKey } from '../credentials';

export class DynamodbService {
  private readonly dynamoClient;

  constructor(private tableName: string) {
    config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: getEnv('REGION'),
    });
    this.dynamoClient = new DynamoDB();
  }

  async getItem(keys: ObjectType, options: Partial<GetItemInput> = {}): Promise<any | undefined> {
    const params: GetItemInput = {
      TableName: this.tableName,
      Key: this.getKeys(keys),
      ...options,
    };
    const item = await this.dynamoClient.getItem(params).promise();
    if (item.Item) {
      return unmarshall(item.Item);
    }
  }

  async createItem(item: any, options: Partial<PutItemInput> = {}): Promise<PutItemOutput> {
    const params: PutItemInput = {
      TableName: this.tableName,
      Item: marshall(item),
      ...options,
    };
    return this.dynamoClient.putItem(params).promise();
  }

  async query<T = any>(options: Partial<QueryInput>): Promise<T> {
    const params: QueryInput = {
      TableName: this.tableName,
      ...options,
    };
    const { Items } = await this.dynamoClient.query(params).promise();
    return Items!.map((item) => unmarshall(item)) as T;
  }

  async scan<T>(options: Partial<ScanInput> = {}): Promise<T> {
    const params: ScanInput = {
      TableName: this.tableName,
      ...options,
    };
    const { Items } = await this.dynamoClient.scan(params).promise();
    if (!Items) {
      throw new HttpNotFoundError('Features not found');
    }

    return Items.map((item: any) => unmarshall(item));
  }

  async updateItem(keys: ObjectType, options: Partial<UpdateItemInput> = {}): Promise<void> {
    const params: UpdateItemInput = {
      TableName: this.tableName,
      Key: this.getKeys(keys),
      ...options,
    };
    await this.dynamoClient.updateItem(params).promise();
  }

  async deleteItem(keys: ObjectType, options: Partial<UpdateItemInput> = {}): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.getKeys(keys),
      ...options,
    };
    await this.dynamoClient.deleteItem(params).promise();
  }

  private getKeys(keys: ObjectType): { [key: string]: any } {
    const dynamodbKeys = {};

    for (const key in keys) {
      if (isFinite(Number(keys[key]))) {
        dynamodbKeys[key] = { N: keys[key] };
      } else {
        dynamodbKeys[key] = { S: keys[key] };
      }
    }
    return dynamodbKeys;
  }
}
