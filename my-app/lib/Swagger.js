import nextConnect from 'next-connect';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { GET, POST, PUT, DELETE } from '../app/api/users/route';

 // Adjust the path based on your project structure

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your application',
    },
  },
  apis: ['./app/api/users/route.tsx'], // Adjust the path to your API endpoint file(s)
};

const specs = swaggerJsdoc(options);

const handler = nextConnect();

// Serve Swagger UI and API documentation
handler.get('/api-docs', swaggerUi.setup(specs));

// Export the handler for use in Next.js
export default handler;
