import { DynamodbService } from '@services/dynamodb.service';
import { HumanRequest } from '../interface/interfaces';

export class AdminApiService {
  async getUserReviewsByOrganizationId(dynamo: DynamodbService): Promise<HumanRequest[]> {
    return dynamo.scan<HumanRequest[]>();
  }
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
}
