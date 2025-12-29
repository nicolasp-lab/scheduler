import { Request, Response } from "express";
import { PrismaBookingRepository } from "../../database/prisma/repositories/PrismaBookingRepository";
import { UpdateBookingUseCase } from "../../../application/use-cases/booking/UpdateBookingUseCase";

export class UpdateBookingController {
  async handle(req: Request, res: Response) {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ message: "bookingId and status are required." });
    }

    const bookingRepository = new PrismaBookingRepository();
    const updateBookingUseCase = new UpdateBookingUseCase(bookingRepository);

    try {
    await updateBookingUseCase.execute(bookingId, status);
    return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
