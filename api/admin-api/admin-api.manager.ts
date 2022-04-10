import { DynamodbService } from '@services/dynamodb.service';
import { EmailService } from '@services/email.service';
import { RequestStatus } from '../client-api/client.interfaces';
import { HumanRequest, Review, ReviewBody } from '../interface/interfaces';
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
    const allUserReviews = await dynamo.scan<HumanRequest[]>();
    const statuses: RequestStatus[] = ['created', 'inProgress', 'reject'];
    return allUserReviews.filter((review) => statuses.includes(review.status));
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
      const status: RequestStatus = 'readyToReview';
      await this.service.attachRequestToReview(review.id, request.requestId, requestsDynamo, status);
    }
  }

  async getReviewGroups(): Promise<Review[]> {
    const reviewsDynamo = new DynamodbService(this.reviewsDB);
    const reviews: any[] = await reviewsDynamo.scan();
    const requestsDynamo = new DynamodbService(this.humanRequestsDB);
    const statuses: RequestStatus[] = ['readyToReview'];
    for (const review of reviews) {
      review.requests = (
        await Promise.all(review.requests.map((requestId) => requestsDynamo.getItem({ requestId })))
      ).filter((review) => statuses.includes(review.status));
    }
    return reviews.filter((review) => review.requests.length);
  }

  async completeRequest({ text, requests }: Review, emailService: EmailService): Promise<void> {
    const requestsDynamo = new DynamodbService(this.humanRequestsDB);
    const emails = requests.map((request) => request.email);
    await Promise.all(
      emails.map((email) => {
        try {
          emailService.sendEmail(email, text);
        } catch (error) {
          console.log('email send error', error);
        }
      })
    );
    const requestsIds = requests.map((request) => request.requestId);
    await Promise.all(
      requestsIds.map((requestId) => {
        try {
          this.service.updateHumanReport(requestId, { status: 'done' }, requestsDynamo);
        } catch (error) {
          console.log('change requestId status error', error);
        }
      })
    );
  }

  async rejectReview({ cancelMessage, requests }: Review) {
    const requestsDynamo = new DynamodbService(this.humanRequestsDB);
    const requestsIds = requests.map((request) => request.requestId);
    await Promise.all(
      requestsIds.map((requestId) => {
        try {
          this.service.updateHumanReport(requestId, { status: 'reject', cancelMessage }, requestsDynamo);
        } catch (error) {
          console.log('change requestId status error', error);
        }
      })
    );
  }
}
