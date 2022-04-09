import { HttpNotFoundError } from '@floteam/errors';
import { getEnv } from '@helper/environment';
import { ObjectType } from '@interfaces/api-gateway-lambda.interface';
import { DynamoDB } from 'aws-sdk';
import {
  AttributeMap,
  PutItemInput,
  PutItemOutput,
  QueryInput,
  ScanInput,
  UpdateItemInput,
} from 'aws-sdk/clients/dynamodb';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import GetItemInput = DocumentClient.GetItemInput;
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export class DynamodbService {
  private readonly dynamoClient = new DynamoDB({ region: getEnv('REGION') });

  constructor(private tableName: string) {}

  async getItem(keys: ObjectType, options: Partial<GetItemInput> = {}): Promise<AttributeMap | undefined> {
    const params: GetItemInput = {
      TableName: this.tableName,
      Key: this.getKeys(keys),
      ...options,
    };
    const { Item } = await this.dynamoClient.getItem(params).promise();
    return Item;
  }

  async createItem(item: any, options: Partial<PutItemInput> = {}): Promise<PutItemOutput> {
    const params: PutItemInput = {
      TableName: this.tableName,
      Item: marshall(item),
      ...options,
    };
    return this.dynamoClient.putItem(params).promise();
  }

  async query(options: Partial<QueryInput>): Promise<Array<any[]> | undefined> {
    const params: QueryInput = {
      TableName: this.tableName,
      ...options,
    };
    const { Items } = await this.dynamoClient.query(params).promise();
    return Items?.map((item) => unmarshall(item) as any);
  }

  async scan(options: Partial<ScanInput> = {}): Promise<any> {
    const params: ScanInput = {
      TableName: this.tableName,
      ...options,
    };
    const { Items } = await this.dynamoClient.scan(params).promise();
    if (!Items) {
      throw new HttpNotFoundError('Features not found');
    }

    return Items?.map((item: any) => unmarshall(item));
  }

  async updateItem(keys: ObjectType, options: Partial<UpdateItemInput> = {}): Promise<void> {
    const params: UpdateItemInput = {
      TableName: this.tableName,
      Key: this.getKeys(keys),
      ...options,
    };
    await this.dynamoClient.updateItem(params).promise();
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
