import { log } from '@helper/logger';
import { Handler } from 'aws-lambda';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { ClientApiManager } from './client-api.manager';

export interface City {
  id: string;
  name: string;
  organizations: string[];
}

export type CitiesGetResponse = City[];
export const getCities: Handler<APIGatewayLambdaEvent<null>, void> = async (event) => {
  log(event);
  try {
    const manager = new ClientApiManager();
  } catch (error) {
    errorHandler(error);
  }
};

export type EmailBody = { email: string };
export const initEmailVerification: Handler<APIGatewayLambdaEvent<EmailBody>, void> = async (event) => {
  log(event);
  try {
    const manager = new ClientApiManager();
    const { email } = event.body;
    return await manager.initEmailVerification(email);
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
