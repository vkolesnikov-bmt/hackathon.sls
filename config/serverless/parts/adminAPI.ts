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
    getAnswersByTags: {
      handler: 'api/admin-api/handler.getAnswersByTags',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/admin/answers',
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
    updateHumanRequest: {
      handler: 'api/admin-api/handler.updateHumanRequest',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/admin/human-requests/{requestId}',
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
    createReviewGroup: {
      handler: 'api/admin-api/handler.createReviewGroup',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/admin/reviews/',
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
    getReviewGroups: {
      handler: 'api/admin-api/handler.getReviewGroups',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/admin/reviews/',
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
    completeRequest: {
      handler: 'api/admin-api/handler.completeRequest',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/admin/completeRequest/',
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
    rejectReview: {
      handler: 'api/admin-api/handler.rejectReview',
      memorySize: 128,
      events: [
        {
          http: {
            path: 'api/admin/rejectReview/',
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
