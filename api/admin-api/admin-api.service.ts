import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamodbService } from '@services/dynamodb.service';
import { RequestStatus } from '../client-api/client.interfaces';
import { HumanRequest } from '../interface/interfaces';

export class AdminApiService {
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

  async attachRequestToReview(
    reviewId: string,
    requestId: string,
    dynamo: DynamodbService,
    status: RequestStatus
  ): Promise<void> {
    const options = {
      ExpressionAttributeNames: {
        '#id': 'reviewId',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':id': {
          S: reviewId,
        },
        ':status': {
          S: status,
        },
      },
      UpdateExpression: 'SET #id = :id, #status = :status',
    };
    console.log(reviewId);
    console.log(requestId);
    console.log(status);
    await dynamo.updateItem({ requestId }, options);
  }
}
