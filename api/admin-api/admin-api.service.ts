import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamodbService } from '@services/dynamodb.service';
import { HumanRequest } from '../interface/interfaces';

export class AdminApiService {
  async getUserReviews(dynamo: DynamodbService): Promise<HumanRequest[]> {
    return dynamo.scan<HumanRequest[]>();
  }

  async updateHumanReport(requestId: string, body: Partial<HumanRequest>, dynamoDb: DynamodbService): Promise<void> {
    const key = { requestId };
    const itemKeys = Object.keys(body);
    const options = {
      ExpressionAttributeNames: itemKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`#field${index}`]: k,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        itemKeys.reduce((accumulator, key, index) => ({ ...accumulator, [`:value${index}`]: body[key] }), {})
      ),
      UpdateExpression: `SET ${itemKeys.map((k, index) => `#field${index} = :value${index}`).join(', ')}`,
    };
    console.log({ options });
    return await dynamoDb.updateItem(key, options);
  }

  async getTypedAnswers(tag: string, dynamo: DynamodbService): Promise<string[]> {
    const keys = { tag };
    const answers = await dynamo.getItem(keys);
    if (!answers) {
      return [];
    }
    return JSON.parse(answers.answers);
  }

  async attachRequestToReview(reviewId: string, requestId: string, dynamo: DynamodbService): Promise<void> {
    const options = {
      ExpressionAttributeNames: {
        '#id': 'reviewId',
      },
      ExpressionAttributeValues: {
        ':id': {
          S: reviewId,
        },
      },
      UpdateExpression: 'SET #id = :id',
    };
    console.log(reviewId);
    console.log(requestId);
    await dynamo.updateItem({ requestId }, options);
  }
}
