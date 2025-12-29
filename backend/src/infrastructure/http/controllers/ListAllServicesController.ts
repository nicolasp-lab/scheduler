import { Request, Response } from "express";
import { prisma } from "../../database/prisma/client";

export class ListAllServicesController {
  async handle(req: Request, res: Response) {
    const services = await prisma.service.findMany({});
    return res.json(services);
  }
}
