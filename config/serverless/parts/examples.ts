import { AWSPartitial } from '../types';

export const examplesConfig: AWSPartitial = {
  provider: {
    httpApi: {
      authorizers: {
        exampleAuthorizer: {
          type: 'request',
          enableSimpleResponses: true,
          functionName: 'exampleAuthorizerHttpApi',
          identitySource: '$request.header.Authorization',
        },
      },
    },
  },
  functions: {
    // prefix "api" for API Gateway Lambda triggers
    apiExampleRestApiDefaultResponse: {
      handler: 'api/rest-api/handler.handler',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'example/rest-api/default-response',
            method: 'post',
            integration: 'lambda',
            cors: true,
            authorizer: {
              name: 'exampleAuthorizerRestApi',
            },
            response: {
              headers: {
                'Access-Control-Allow-Origin': "'*'",
                'Content-Type': "'application/json'",
              },
              template: "$input.json('$')",
            },
          },
        },
      ],
    },
    exampleAuthorizerRestApi: {
      handler: 'api/auth/handler.authentication',
      memorySize: 128,
    },
  },
};
