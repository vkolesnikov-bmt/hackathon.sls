import { ClientApiService } from './client-api.service';

export class ClientApiManager {
  private readonly service: ClientApiService;
  constructor() {
    this.service = new ClientApiService();
  }

  async getCities(): Promise<any> {}

  async getOrganizations(cityId: string): Promise<any> {}

  async initEmailVerification(email: string): Promise<void> {
    const verificationCode = this.service.generateCode();
  }

  async verifyEmailCode(code: number): Promise<void> {}
}