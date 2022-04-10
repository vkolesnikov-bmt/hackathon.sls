import { log } from '@helper/logger';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { EmailService } from '@services/email.service';
import { Handler } from 'aws-lambda';
import { HumanRequest, Review, ReviewBody } from '../interface/interfaces';
import { AdminApiManager } from './admin-api.manager';

export const getHumanRequests: Handler<APIGatewayLambdaEvent<void>, HumanRequest[]> = async (event) => {
  log(event);
  try {
    const manager = new AdminApiManager();
    return await manager.getHumanRequests();
  } catch (error) {
    errorHandler(error);
  }
};

export const getAnswersByTags: Handler<APIGatewayLambdaEvent<null, null, { tags: string }>, string[]> = async (
  event
) => {
  log(event);
  try {
    const manager = new AdminApiManager();
    return await manager.getTypedAnswers(event.query.tags);
  } catch (error) {
    errorHandler(error);
  }
};

export const updateHumanRequest: Handler<
  APIGatewayLambdaEvent<Partial<HumanRequest>, { requestId: string }>,
  void
> = async (event) => {
  log('UPDATE HUMAN REQUEST', event);
  try {
    const manager = new AdminApiManager();
    return await manager.updateHumanReport(event.path.requestId, event.body);
  } catch (error) {
    errorHandler(error);
  }
};

export const createReviewGroup: Handler<APIGatewayLambdaEvent<ReviewBody>, void> = async (event) => {
  log('createReviewGroup', event);
  try {
    const manager = new AdminApiManager();
    return await manager.createReviewGroup(event.body);
  } catch (error) {
    errorHandler(error);
  }
};

export const getReviewGroups: Handler<APIGatewayLambdaEvent<void>, Review[]> = async (event) => {
  log('createReviewGroup', event);
  try {
    const manager = new AdminApiManager();
    return await manager.getReviewGroups();
  } catch (error) {
    errorHandler(error);
  }
};

export const completeRequest: Handler<APIGatewayLambdaEvent<Review>, void> = async (event) => {
  log('createReviewGroup', event);
  try {
    const manager = new AdminApiManager();
    const emailService = new EmailService();
    return await manager.completeRequest(event.body, emailService);
  } catch (error) {
    errorHandler(error);
  }
};
