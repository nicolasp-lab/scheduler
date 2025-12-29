import { Request, Response } from "express";
import { prisma } from "../../database/prisma/client";

export class ListServicesController {
  async handle(req: Request, res: Response) {
    const services = await prisma.service.findMany({
      where: {
        active: true,
      },
    });
    return res.json(services);
  }
}
