import { log } from '@helper/logger';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { Handler } from 'aws-lambda';
import { HumanRequest } from '../interface/interfaces';
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

export const getAnswersByTags: Handler<APIGatewayLambdaEvent<null, null, { tags: string }>, string[]> = async (event) => {
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
