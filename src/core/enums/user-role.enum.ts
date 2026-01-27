export const USER_ROLE = {
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
