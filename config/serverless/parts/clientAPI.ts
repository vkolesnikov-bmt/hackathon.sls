import { AWSPartitial } from '../types';

export const clientAPIConfig: AWSPartitial = {
  functions: {
    initEmailVerification: {
      handler: 'api/client-api/handler.initEmailVerification',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/client/code/send',
            method: 'post',
            integration: 'lambda',
            cors: true,
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
    verifyEmail: {
      handler: 'api/client-api/handler.verifyEmail',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/client/code/verify',
            method: 'post',
            integration: 'lambda',
            cors: true,
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
    addUserReview: {
      handler: 'api/client-api/handler.addUserReview',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/client/review/',
            method: 'post',
            integration: 'lambda',
            cors: true,
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
  },
};
