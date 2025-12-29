import { Request, Response } from "express";
import { AuthenticateAdminUseCase } from "../../../application/use-cases/auth/AuthenticateAdminUseCase";

export class AuthenticateAdminController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const authenticateAdmin = new AuthenticateAdminUseCase();

    try {
      const result = await authenticateAdmin.execute({ email, password });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
