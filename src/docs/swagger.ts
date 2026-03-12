import swaggerJsdoc from "swagger-jsdoc"

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ZORDON API",
      version: "1.0.0",
      description: "Sistema de análise de vendas e geração de insights"
    },
    servers: [
      {
        url: "http://localhost:3333"
      }
    ]
  },
  apis: []
})
