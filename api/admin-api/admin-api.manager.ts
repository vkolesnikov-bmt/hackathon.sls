import { DynamodbService } from '@services/dynamodb.service';
import { HumanRequest, ReviewBody } from '../interface/interfaces';
import { AdminApiService } from './admin-api.service';
import { v4 as uuidv4 } from 'uuid';

export class AdminApiManager {
  private service: AdminApiService;
  private humanRequestsDB = 'hackathon-human-request';
  private typedAnswersDB = 'hackathon-answers';
  private reviewsDB = 'hackathon-reviews';

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

  async createReviewGroup(reviewBody: ReviewBody): Promise<void> {
    const reviewsDynamo = new DynamodbService(this.reviewsDB);
    const requestsDynamo = new DynamodbService(this.humanRequestsDB);
    const review = {
      id: uuidv4(),
      ...reviewBody,
      requests: reviewBody.requests.map((req) => req.requestId),
    };
    await reviewsDynamo.createItem(review);
    for (const request of reviewBody.requests) {
      // TODO на какой статус меняем?
      await this.service.attachRequestToReview(review.id, request.requestId, requestsDynamo);
    }
  }
}
