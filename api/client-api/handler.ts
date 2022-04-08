import { log } from '@helper/logger';
import { Handler } from 'aws-lambda';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';

export const initEmailVerification: Handler<APIGatewayLambdaEvent<null>, string> = async (event) => {
  log(event);
  try {
    return 'Hi!';
  } catch (error) {
    errorHandler(error);
  }
};

export const verifyEmail: Handler<APIGatewayLambdaEvent<null>, string> = async (event) => {
  log(event);
  try {
    return 'Hi!';
  } catch (error) {
    errorHandler(error);
  }
};

export const addUserReview: Handler<APIGatewayLambdaEvent<null>, string> = async (event) => {
  log(event);
  try {
    return 'Hi!';
  } catch (error) {
    errorHandler(error);
  }
};
