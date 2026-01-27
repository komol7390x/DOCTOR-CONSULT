import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

const swaggerPlugin = fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Doctor Consult API",
        description:
          "Telemedicine API for booking consultations and prescriptions",
        version: "1.0.0",
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });
});

export default swaggerPlugin;
