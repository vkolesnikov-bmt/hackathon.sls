import { DynamodbService } from '@services/dynamodb.service';
import { HumanRequest } from '../interface/interfaces';
import { AdminApiService } from './admin-api.service';

export class AdminApiManager {
  private service: AdminApiService;

  constructor() {
    this.service = new AdminApiService();
  }

  async updateUserReview(reviewId: string, status: string): Promise<void> {
    const dynamo = new DynamodbService('hackathon-user-feedback');
    return this.service.updateUserStatus(reviewId, status, dynamo);
  }

  async getTypedAnswers(tags: string[]): Promise<string[]> {
    const dynamo = new DynamodbService('hackathon-typed-answers');
    const answers: string[] = [];
    for (const tag of tags) {
      const typedAnswer = await this.service.getTypedAnswers(tag, dynamo);
      answers.push(...typedAnswer);
    }
    return answers;
  }

  async getUsersReviewsByOrganization(organizationId: string): Promise<HumanRequest[]> {
    const dynamo = new DynamodbService('hackathon-user-feedback');
    return this.service.getUserReviewsByOrganizationId(organizationId, dynamo);
  }
}
