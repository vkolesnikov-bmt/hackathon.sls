import { DynamodbService } from '@services/dynamodb.service';
import { HumanRequest } from '../interface/interfaces';

export class AdminApiService {
  async updateUserStatus(id: string, status: string, dynamoDb: DynamodbService): Promise<void> {
    const key = { id };
    const options = {
      ExpressionAttributeNames: {
        '#stat': 'status',
      },
      ExpressionAttributeValues: {
        ':stat': {
          S: status,
        },
      },
      UpdateExpression: 'SET #stat = :stat',
    };
    return await dynamoDb.updateItem(key, options);
  }

  async getTypedAnswers(tag: string, dynamo: DynamodbService): Promise<string[]> {
    const options = {
      ExpressionAttributeNames: {
        '#tag': 'tag',
      },
      ExpressionAttributeValues: {
        ':tag': { S: tag },
      },
      KeyConditionExpression: '#tag = :tag',
    };
    const answers = await dynamo.query(options);
    return answers!.map((answer: any) => answer.text as string);
  }

  async getUserReviewsByOrganizationId(organizationId: string, dynamo: DynamodbService): Promise<HumanRequest[]> {
    const options = {
      ExpressionAttributeNames: {
        '#organizationId': 'organizationId',
      },
      ExpressionAttributeValues: {
        ':organizationId': { S: organizationId },
      },
      KeyConditionExpression: '#organizationId = :organizationId',
    };
    return dynamo.query<HumanRequest[]>(options);
  }
}
