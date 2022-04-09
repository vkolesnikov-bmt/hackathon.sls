import { log } from '@helper/logger';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { Handler } from 'aws-lambda';
import { HumanRequest } from '../interface/interfaces';
import { AdminApiManager } from './admin-api.manager';

export const updateUserReview: Handler<APIGatewayLambdaEvent<{ status: string }>, void> = async (event) => {
  log(event);
  try {
    const manager = new AdminApiManager();
    return await manager.updateUserReview(event.path.id, event.body.status);
  } catch (error) {
    errorHandler(error);
  }
};

export const getTypedAnswers: Handler<APIGatewayLambdaEvent<{ tags: string[] }>, string[]> = async (event) => {
  log(event);
  try {
    const manager = new AdminApiManager();
    return await manager.getTypedAnswers(event.body.tags);
  } catch (error) {
    errorHandler(error);
  }
};

export const getUsersReviewsByOrganization: Handler<APIGatewayLambdaEvent<any>, HumanRequest[]> = async (event) => {
  log(event);
  try {
    const manager = new AdminApiManager();
    return await manager.getUsersReviewsByOrganization(event.path.organizationId);
  } catch (error) {
    errorHandler(error);
  }
};
