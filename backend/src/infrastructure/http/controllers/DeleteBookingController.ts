import { Request, Response } from "express";
import { PrismaBookingRepository } from "../../database/prisma/repositories/PrismaBookingRepository";
import { DeleteBookingUseCase } from "../../../application/use-cases/booking/DeleteBookingUseCase";

export class DeleteBookingController {
  async handle(req: Request, res: Response) {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required." });
    }

    const bookingRepository = new PrismaBookingRepository();
    const deleteBookingUseCase = new DeleteBookingUseCase(bookingRepository);

    try {
      await deleteBookingUseCase.execute(bookingId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
