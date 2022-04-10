import { DynamodbService } from '@services/dynamodb.service';
import { HumanRequest } from '../interface/interfaces';
import { AdminApiService } from './admin-api.service';

export class AdminApiManager {
  private service: AdminApiService;
  private humanRequestsDB = 'hackathon-human-request';
  private typedAnswersDB = 'hackathon-typed-answers';
  constructor() {
    this.service = new AdminApiService();
  }

  async getHumanRequests(): Promise<HumanRequest[]> {
    const dynamo = new DynamodbService(this.humanRequestsDB);
    return this.service.getUserReviewsByOrganizationId(dynamo);
  }

  async updateUserReview(reviewId: string, status: string): Promise<void> {
    const dynamo = new DynamodbService(this.humanRequestsDB);
    return this.service.updateUserStatus(reviewId, status, dynamo);
  }

  async getTypedAnswers(tags: string[]): Promise<string[]> {
    const dynamo = new DynamodbService(this.typedAnswersDB);
    const answers: string[] = [];
    for (const tag of tags) {
      const typedAnswer = await this.service.getTypedAnswers(tag, dynamo);
      answers.push(...typedAnswer);
    }
    return answers;
  }
}
