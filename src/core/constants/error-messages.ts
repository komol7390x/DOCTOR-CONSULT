export const ERROR_MESSAGES = {
  APPOINTMENT_NOT_FOUND: "The specified appointment does not exist",
  APPOINTMENT_PAST_BOOKING: "Cannot book appointments in the past",
  APPOINTMENT_INVALID_TIME: "End time must be after start time",
  APPOINTMENT_ALREADY_COMPLETED: "Only scheduled appointments can be completed",
  APPOINTMENT_DOCTOR_BUSY: "The doctor is already booked at this time",

  DOCTOR_NOT_FOUND: "The specified doctor does not exist",
  DOCTOR_NOT_AVAILABLE: "The doctor is not available for appointments",

  PATIENT_NOT_FOUND: "The specified patient does not exist",

  PRESCRIPTION_NOT_FOUND: "The specified prescription does not exist",
  PRESCRIPTION_ALREADY_EXISTS:
    "A prescription already exists for this appointment",
  PRESCRIPTION_INCOMPLETE_APPOINTMENT:
    "Prescriptions can only be created for completed appointments",

  INVALID_ID: "Invalid ID format",
  INVALID_DOCTOR_ID: "Invalid doctor ID",
  INVALID_PATIENT_ID: "Invalid patient ID",
  INVALID_APPOINTMENT_ID: "Invalid appointment ID",
  VALIDATION_ERROR: "Validation error",

  INTERNAL_SERVER_ERROR: "Internal server error",
  RESOURCE_NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
