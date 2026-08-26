import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { CreateUserInput } from "@/validations/user.validation";

export async function createUser(data: CreateUserInput) {
  const existingEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
    },
  });

  if (existingEmail) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const existingEmployee = await prisma.user.findUnique({
    where: {
      employeeId: data.employeeId,
    },
    select: {
      id: true,
    },
  });

  if (existingEmployee) {
    throw new Error("EMPLOYEE_ID_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      employeeId: data.employeeId,
      email: data.email,
      passwordHash,

      employee: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
          department: data.department,
          position: data.position,
        },
      },
    },

    select: {
      id: true,
      employeeId: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,

      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          department: true,
          position: true,
          joiningDate: true,
        },
      },
    },
  });

  return user;
}