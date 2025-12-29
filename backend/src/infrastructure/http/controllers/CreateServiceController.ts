import { Request, Response } from "express";
import { prisma } from "../../database/prisma/client";

export class CreateServiceController {
  async handle(req: Request, res: Response) {
    const { name, description, price, duration } = req.body;

    try {
      const service = await prisma.service.create({
        data: {
          name,
          description,
          price,
          duration,
          active: true,
        },
      });

      return res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
