import { FastifyInstance } from "fastify";
import { AppointmentController } from "./appointment.controller";

const appointmentController = new AppointmentController();

export default async function appointmentRoutes(fastify: FastifyInstance) {
  
  fastify.post(
    "/",
    {
      schema: {
        tags: ["appointments"],
        summary: "Create appointment",
        description: "Book a new appointment",
        body: {
          type: "object",
          required: ["patientId", "doctorId", "startTime", "endTime"],
          properties: {
            patientId: { type: "number" },
            doctorId: { type: "number" },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
            notes: { type: "string" },
          },
        },
      },
    },
    appointmentController.createAppointment,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["appointments"],
        summary: "Get appointment by ID",
        description: "Retrieve details of a specific appointment",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "number" },
          },
        },
      },
    },
    appointmentController.getAppointmentById,
  );

  fastify.put(
    "/:id/complete",
    {
      schema: {
        tags: ["appointments"],
        summary: "Complete appointment",
        description: "Mark an appointment as completed",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "number" },
          },
        },
        body: {
          type: "object",
          properties: {
            notes: { type: "string" },
          },
        },
      },
    },
    appointmentController.completeAppointment,
  );

  fastify.post(
    "/:id/prescription",
    {
      schema: {
        tags: ["appointments"],
        summary: "Create prescription",
        description: "Create a prescription for a completed appointment",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "number" },
          },
        },
        body: {
          type: "object",
          required: ["diagnosis", "medications"],
          properties: {
            diagnosis: { type: "string" },
            instructions: { type: "string" },
            medications: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "dosage", "frequency", "duration"],
                properties: {
                  name: { type: "string" },
                  dosage: { type: "string" },
                  frequency: { type: "string" },
                  duration: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    appointmentController.createPrescription,
  );

  fastify.get(
    "/patient/:patientId",
    {
      schema: {
        tags: ["appointments"],
        summary: "Get patient appointments",
        description: "Retrieve all appointments for a specific patient",
        params: {
          type: "object",
          required: ["patientId"],
          properties: {
            patientId: { type: "number" },
          },
        },
      },
    },
    appointmentController.getAppointmentsByPatient,
  );
}
