import { HttpError } from '@floteam/errors/http/http-error';
import { v4 as uuidv4 } from 'uuid';
import { DynamodbService } from '@services/dynamodb.service';
import { EmailService } from '@services/email.service';
import { ClientApiService } from './client-api.service';
import { HumanRequest } from './client.interfaces';

import { addHumanRequest, CitiesGetResponse } from './handler';

export class ClientApiManager {
  private readonly service: ClientApiService;

  constructor() {
    this.service = new ClientApiService();
  }

  async getCities(dynamoDB: DynamodbService): Promise<CitiesGetResponse> {
    const cities: any = await dynamoDB.scan();
    return cities.map((city) => ({
      city: city.city,
      organizations: JSON.parse(city.organizations),
    }));
  }

  async initEmailVerification(email: string, dynamoDB: DynamodbService, emailService: EmailService): Promise<string> {
    const verificationCode: string = this.service.generateCode();
    await Promise.all([
      dynamoDB.createItem({ email, verificationCode }),
      emailService.sendEmail(email, verificationCode),
    ]);
    return 'Email send success';
  }

  async verifyEmailCode(email: string, userCode: string, dynamoDB: DynamodbService): Promise<string> {
    const verificationCode = await this.service.getVerificationCode(email, dynamoDB);
    if (verificationCode === userCode) {
      await dynamoDB.deleteItem({ email });
      return 'Verification success';
    } else {
      throw new HttpError(404, 'Verification', 'Verification code error');
    }
  }

  async addHumanRequest(eventBody: HumanRequest, dynamoDB: DynamodbService) {
    const requestId = uuidv4();
    const newItem: HumanRequest = {
      ...eventBody,
      requestId,
      status: 'created',
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`,
    };
    await dynamoDB.createItem(newItem);
    return 'Human request is send';
  }
}
