export type CreateUserInput = {
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  department?: string;
  position?: string;
};

export function validateCreateUserInput(
  data: unknown
): { valid: true; data: CreateUserInput } | { valid: false; message: string } {
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      message: "Request body must be a JSON object",
    };
  }

  const body = data as Record<string, unknown>;

  const requiredFields = [
    "employeeId",
    "email",
    "password",
    "firstName",
    "lastName",
  ];

  for (const field of requiredFields) {
    if (
      typeof body[field] !== "string" ||
      body[field].trim().length === 0
    ) {
      return {
        valid: false,
        message: `${field} is required`,
      };
    }
  }

  const employeeId = (body.employeeId as string).trim();
  const email = (body.email as string).trim().toLowerCase();
  const password = body.password as string;
  const firstName = (body.firstName as string).trim();
  const lastName = (body.lastName as string).trim();

  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters",
    };
  }

  if (password.length > 128) {
    return {
      valid: false,
      message: "Password is too long",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Invalid email address",
    };
  }

  if (employeeId.length > 50) {
    return {
      valid: false,
      message: "Employee ID is too long",
    };
  }

  return {
    valid: true,
    data: {
      employeeId,
      email,
      password,
      firstName,
      lastName,
      phone:
        typeof body.phone === "string"
          ? body.phone.trim()
          : undefined,
      address:
        typeof body.address === "string"
          ? body.address.trim()
          : undefined,
      department:
        typeof body.department === "string"
          ? body.department.trim()
          : undefined,
      position:
        typeof body.position === "string"
          ? body.position.trim()
          : undefined,
    },
  };
}