import "dotenv/config";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../infrastructure/database/prisma/client";

interface AuthRequest {
  email: string;
  password: string;
}

export class AuthenticateAdminUseCase {
  async execute({ email, password }: AuthRequest) {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });
    if (!admin) throw new Error("Email or password incorrect");

    const passwordMatch = await compare(password, admin.password);
    if (!passwordMatch) throw new Error("Email or password incorrect");

    const token = sign({}, process.env.JWT_SECRET!, {
      subject: admin.id,
      expiresIn: "1d"
    });

    return { token };
  }
}
