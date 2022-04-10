import { AWSPartitial } from '../types';

const basePath = 'api/admin';
export const adminAPIConfig: AWSPartitial = {
  functions: {
    getCities: {
      handler: 'api/admin-api/handler.getHumanRequests',
      memorySize: 128,
      events: [
        {
          http: {
            path: `${basePath}/human-requests`,
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
  },
};
