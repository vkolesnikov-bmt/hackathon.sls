import { DynamodbService } from '@services/dynamodb.service';
import { HumanRequest } from '../interface/interfaces';
import { AdminApiService } from './admin-api.service';

export class AdminApiManager {
  private service: AdminApiService;
  private humanRequestsDB = 'hackathon-human-request';
  private typedAnswersDB = 'hackathon-answers';
  constructor() {
    this.service = new AdminApiService();
  }

  async getHumanRequests(): Promise<HumanRequest[]> {
    const dynamo = new DynamodbService(this.humanRequestsDB);
    return this.service.getUserReviews(dynamo);
  }

  async updateHumanReport(reviewId: string, body: Partial<HumanRequest>): Promise<void> {
    const dynamo = new DynamodbService(this.humanRequestsDB);
    return this.service.updateHumanReport(reviewId, body, dynamo);
  }

  async getTypedAnswers(tagsStr: string): Promise<string[]> {
    const dynamo = new DynamodbService(this.typedAnswersDB);
    const tags = decodeURIComponent(tagsStr).split(',');
    const answers: string[] = [];
    for (const tag of tags) {
      const typedAnswer = await this.service.getTypedAnswers(tag, dynamo);
      answers.push(...typedAnswer);
    }
    return answers;
  }
}
