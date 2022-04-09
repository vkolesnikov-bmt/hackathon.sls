import { HttpError } from '@floteam/errors/http/http-error';
import { DynamodbService } from '@services/dynamodb.service';
import { EmailService } from '@services/email.service';
import { ClientApiService } from './client-api.service';
import { CitiesGetResponse } from './handler';

export class ClientApiManager {
  private readonly service: ClientApiService;
  constructor() {
    this.service = new ClientApiService();
  }

  async getCities(dynamoDB: DynamodbService): Promise<CitiesGetResponse> {
    const cities = await dynamoDB.scan();
    return cities.map((city) => ({
      city: city.city,
      organizations: JSON.parse(city.organizations),
    }));
  }

  async getOrganizations(cityId: string): Promise<any> {}

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
}
