const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { config } = require('./index');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ulster Delt Investment API',
            version: '1.0.0',
            description: 'API documentation for Ulster Delt Investment platform',
            contact: {
                name: 'API Support',
                email: 'customerservices@@ulsterdelt.it.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${config.app.port}`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js', './src/models/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Ulster Delt Investment API Documentation'
    })
}; 