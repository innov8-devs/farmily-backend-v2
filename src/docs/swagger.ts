import swaggerJsdoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

class SwaggerConfig {
  private options: OAS3Options;

  constructor() {
    this.options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'FARMILY AFRICA',
          version: '2.0.0',
          description: 'API documentation',
        },
        servers: [
          {
            url: 'http://localhost:8000',
          },
        ],
      },
      apis: ['../Modules/**/*.routes.js'],
    };
  }

  public getSpecs() {
    return swaggerJsdoc(this.options);
  }

  public getSwaggerUi() {
    return swaggerUi;
  }
}

export default new SwaggerConfig();
