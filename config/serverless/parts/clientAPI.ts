import { AWSPartitial } from '../types';

export const clientAPIConfig: AWSPartitial = {
  functions: {
    getCities: {
      handler: 'api/client-api/handler.getCities',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/client/cities',
            method: 'get',
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
    addHumanRequest: {
      handler: 'api/client-api/handler.addHumanRequest',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/client/addHumanRequest',
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
