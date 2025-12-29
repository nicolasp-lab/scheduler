import { Request, Response } from "express";
import { prisma } from "../../database/prisma/client";

export class DeleteServiceController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const service = await prisma.service.delete({
        where: { id },
      });
      return res.json(service);
    } catch (error) {
      console.error("Error deleting service:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
