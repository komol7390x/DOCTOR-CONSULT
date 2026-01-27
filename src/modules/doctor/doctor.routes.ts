import { FastifyInstance } from "fastify";
import { DoctorController } from "./doctor.controller";

const doctorController = new DoctorController();

export default async function doctorRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["doctors"],
        summary: "Get all doctors",
        description:
          "Retrieve a list of doctors with optional filtering and pagination",
        querystring: {
          type: "object",
          properties: {
            specialty: { type: "string" },
            experience: { type: "number" },
            limit: { type: "number" },
            skip: { type: "number" },
          },
        },
      },
    },
    doctorController.getDoctors,
  );

  fastify.get(
    "/patients",
    {
      schema: {
        tags: ["patients"],
        summary: "Get all patients",
        description: "Retrieve a list of patients with pagination",
        querystring: {
          type: "object",
          properties: {
            limit: { type: "number" },
            skip: { type: "number" },
          },
        },
      },
    },
    doctorController.getPatients,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["doctors"],
        summary: "Get doctor by ID",
        description: "Retrieve details of a specific doctor",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "number" },
          },
        },
      },
    },
    doctorController.getDoctorById,
  );

  fastify.get(
    "/:id/appointments",
    {
      schema: {
        tags: ["doctors"],
        summary: "Get doctor appointments",
        description: "Retrieve all appointments for a specific doctor",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "number" },
          },
        },
      },
    },
    doctorController.getDoctorAppointments,
  );
}
