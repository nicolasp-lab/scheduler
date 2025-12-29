import { Request, Response } from "express";
import { prisma } from "../../database/prisma/client";

export class UpdateServiceActiveController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { active } = req.body

    try {
      const service = await prisma.service.update({
        where: { id },
        data: { active },
      });
      return res.json(service);
    } catch (error) {
      console.error("Error updating service active status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}