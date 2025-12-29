import { Request, Response } from "express";
import { PrismaBookingRepository } from "../../database/prisma/repositories/PrismaBookingRepository";
import { ListBookingsUseCase } from "../../../application/use-cases/booking/ListBookingsUseCase";

export class ListBookingsController {
  async handle(req: Request, res: Response) {
    const bookingRepository = new PrismaBookingRepository();
    const listBookingsUseCase = new ListBookingsUseCase(bookingRepository);

    const bookings = await listBookingsUseCase.execute();
    return res.json(bookings);
  }
}
