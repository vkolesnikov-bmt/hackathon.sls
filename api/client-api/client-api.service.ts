import { HttpError } from '@floteam/errors/http/http-error';
import { DynamodbService } from '@services/dynamodb.service';

export class ClientApiService {
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async getVerificationCode(email: string, dynamoDB: DynamodbService) {
    const dynamoDBItem = await dynamoDB.getItem({ email });
    if (!dynamoDBItem?.verificationCode) {
      throw new HttpError(400, 'Email error', 'Email not found');
    }
    return dynamoDBItem.verificationCode;
  }
}
