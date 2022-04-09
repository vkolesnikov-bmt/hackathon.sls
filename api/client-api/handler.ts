import { log } from '@helper/logger';
import { DynamodbService } from '@services/dynamodb.service';
import { EmailService } from '@services/email.service';
import { Handler } from 'aws-lambda';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { ClientApiManager } from './client-api.manager';
import { City } from './client.interfaces';

export type CitiesGetResponse = City[];
export const getCities: Handler<APIGatewayLambdaEvent<null>, CitiesGetResponse> = async (event) => {
  log(event);
  try {
    const dynamoDB = new DynamodbService('hackathon-organizations');
    const cities = await dynamoDB.scan();
    return cities.map((city) => ({
      city: city.city,
      organizations: JSON.parse(city.organizations),
    }));
  } catch (error) {
    errorHandler(error);
  }
};

export type EmailBody = { email: string };
export const initEmailVerification: Handler<APIGatewayLambdaEvent<EmailBody>, string> = async (event) => {
  log(event);
  try {
    const manager = new ClientApiManager();
    const dynamoDB = new DynamodbService('hackathon-email-verification');
    const emailService = new EmailService();
    const { email } = event.body;
    return await manager.initEmailVerification(email, dynamoDB, emailService);
  } catch (error) {
    errorHandler(error);
  }
};

export type VerifyEmailBody = { email: string; verificationCode: string };
export const verifyEmail: Handler<APIGatewayLambdaEvent<VerifyEmailBody>, string> = async (event) => {
  log(event);
  try {
    const manager = new ClientApiManager();
    const dynamoDB = new DynamodbService('hackathon-email-verification');
    const { email, verificationCode } = event.body;
    return await manager.verifyEmailCode(email, verificationCode, dynamoDB);
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
