import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const allExceptionFilter = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(error);

  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      error: "Validation Error",
      message: "Invalid request data",
      details: error.errors,
    });
  }

  if (error.message) {
    const errorMessage = error.message;

    if (errorMessage.includes("in the past")) {
      return reply.status(400).send({
        error: "Invalid Time",
        message: errorMessage,
      });
    }

    if (errorMessage.includes("End time must be after start time")) {
      return reply.status(400).send({
        error: "Invalid Time Range",
        message: errorMessage,
      });
    }

    if (errorMessage.includes("does not exist")) {
      return reply.status(404).send({
        error: "Not Found",
        message: errorMessage,
      });
    }

    if (
      errorMessage.includes("already booked") ||
      errorMessage.includes("already exists")
    ) {
      return reply.status(409).send({
        error: "Conflict",
        message: errorMessage,
      });
    }

    if (
      errorMessage.includes("Only scheduled") ||
      errorMessage.includes("can only be created")
    ) {
      return reply.status(400).send({
        error: "Invalid Status",
        message: errorMessage,
      });
    }
  }

  return reply.status(500).send({
    error: "Internal Server Error",
    message: "Something went wrong",
  });
};
