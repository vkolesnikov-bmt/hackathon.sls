import { AWSPartitial } from '../types';

export const adminAPIConfig: AWSPartitial = {
  functions: {
    getHumanRequests: {
      handler: 'api/admin-api/handler.getHumanRequests',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/admin/human-requests',
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
