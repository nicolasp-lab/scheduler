import { Request, Response } from "express";
import { z } from "zod";
import { PrismaBookingRepository } from "../../database/prisma/repositories/PrismaBookingRepository";
import { CreateBookingUseCase } from "../../../application/use-cases/booking/CreateBookingUseCase";

export class CreateBookingController {
  async handle(req: Request, res: Response) {
    const createBookingSchema = z.object({
      clientName: z.string().min(3),
      clientEmail: z.email(),
      serviceId: z.uuid(),
      startTime: z.string().transform((str) => new Date(str)),
      endTime: z.string().transform((str) => new Date(str)),
    });

    try {
      const data = createBookingSchema.parse(req.body);

      const bookingRepository = new PrismaBookingRepository();
      const createBookingUseCase = new CreateBookingUseCase(bookingRepository);

      await createBookingUseCase.execute({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        serviceId: data.serviceId,
        startTime: data.startTime,
        endTime: data.endTime,
      });

      return res.status(201).send();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }

      if (
        err.message === "Time slot is already booked." ||
        err.message.includes("Invalid duration")
      ) {
        return res.status(400).json({ error: err.message });
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
