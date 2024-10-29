const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'NoLeftOvers-V1',
            description: '잔반 남기기 방지 프로젝트',
        },
        servers: [
            {
                url: 'http://13.209.118.89:8000/api', // 요청 URL
            },
        ],
    },
    apis: ['../routes/*.js'], //Swagger 파일 연동
};
const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
