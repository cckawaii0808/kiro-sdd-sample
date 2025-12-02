import swaggerJsdoc from 'swagger-jsdoc';
import projectConfig from '../../project.config.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${projectConfig.displayName} API`,
      version: projectConfig.version,
      description: `${projectConfig.description} - API 文件`,
    },
    servers: [
      {
        url: `http://localhost:${projectConfig.backend.port}`,
        description: '開發環境',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // 掃描所有路由檔案
};

export const swaggerSpec = swaggerJsdoc(options);
