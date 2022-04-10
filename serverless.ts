import type { AWS } from '@serverless/typescript';
import { adminAPIConfig } from './config/serverless/parts/adminAPI';
import { clientAPIConfig } from './config/serverless/parts/clientAPI';
import { clientReviewsConfig } from './config/serverless/parts/reviews';
import { joinParts } from './config/serverless/utils';

const CLIENT = '${file(./env.yml):${self:provider.stage}.CLIENT}';
const SERVICE_NAME = `template-sls`;
const STAGE = '${opt:stage, "dev"}';
const REGION = '${file(./env.yml):${self:provider.stage}.REGION}';
const PROFILE = '${file(./env.yml):${self:provider.stage}.PROFILE}';

const masterConfig: AWS = {
  service: SERVICE_NAME,
  configValidationMode: 'warn',
  variablesResolutionMode: '20210326',
  unresolvedVariablesNotificationMode: 'error',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: STAGE,
    lambdaHashingVersion: '20201221',
    // @ts-ignore
    region: REGION,
    profile: PROFILE,
    environment: {
      STAGE,
    },
    tags: {
      client: CLIENT,
    },
    logs: {
      httpApi: true,
    },
    httpApi: {
      useProviderTags: true,
      payload: '2.0',
      cors: true,
    },
  },
  package: {
    individually: true,
    patterns: ['bin/*', '.env'],
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      metafile: false,
      keepOutputDirectory: true,
      packager: 'npm',
      inject: ['loadenv.ts'],
      plugins: 'esbuild-plugins.js',
      watch: {
        pattern: ['api/**/*.ts', 'helper/**/*.ts', 'interfaces/**/*.ts', 'models/**/*.ts', 'services/**/*.ts'],
      },
    },
    prune: {
      automatic: true,
      number: 3,
    },
    envFiles: ['env.yml'],
    // envEncryptionKeyId: {
    //   local: '${file(./kms_key.yml):local}',
    //   dev: '${file(./kms_key.yml):dev}',
    //   prod: '${file(./kms_key.yml):prod}',
    // },
    'serverless-offline': {
      ignoreJWTSignature: true,
    },
    // s3: {
    //   host: '0.0.0.0',
    //   port: 8001,
    //   directory: '/tmp',
    // },
    // capacities: [
    //   {
    //     table: 'UsersTable',
    //     read: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //     write: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //   },
    //   {
    //     table: 'JobsTable',
    //     index: ['ProducerIdGlobalIndex', 'CrewIdGlobalIndex'],
    //     read: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //     write: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //   },
    // ],
    // 'serverless-offline-sns': {
    //   port: 4002,
    //   debug: false,
    // },
    // 'serverless-offline-sqs': {
    //   autoCreate: true,
    //   apiVersion: '2012-11-05',
    //   endpoint: 'http://0.0.0.0:9324',
    //   region: '${file(./env.yml):${self:provider.stage}.REGION}',
    //   accessKeyId: 'root',
    //   secretAccessKey: 'root',
    //   skipCacheInvalidation: false,
    // },
  },
  plugins: [
    '@redtea/serverless-env-generator',
    'serverless-esbuild',
    'serverless-offline-sqs',
    'serverless-offline',
    // 'serverless-offline-sns',
    // 'serverless-s3-local',
    'serverless-prune-plugin',
  ],
};

module.exports = joinParts(masterConfig, [clientAPIConfig, clientReviewsConfig, adminAPIConfig]);
