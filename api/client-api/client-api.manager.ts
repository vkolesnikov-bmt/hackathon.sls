import { DynamodbService } from '@services/dynamodb.service';
import { EmailService } from '@services/email.service';
import { ClientApiService } from './client-api.service';

export class ClientApiManager {
  private readonly service: ClientApiService;
  constructor() {
    this.service = new ClientApiService();
  }

  async getCities(): Promise<any> {}

  async getOrganizations(cityId: string): Promise<any> {}

  async initEmailVerification(email: string, dynamoDB: DynamodbService, emailService: EmailService): Promise<string> {
    const verificationCode: string = this.service.generateCode();
    await Promise.all([
      dynamoDB.createItem({ email, verificationCode }),
      emailService.sendEmail(email, verificationCode),
    ]);
    return 'Email send success';
  }

  async verifyEmailCode(code: number): Promise<void> {}
}
