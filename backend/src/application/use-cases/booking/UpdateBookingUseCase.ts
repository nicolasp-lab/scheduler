import { IBookingRepository } from "../../interfaces/IBookingRepository";
import { BookingStatus } from "@prisma/client";

export class UpdateBookingUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(bookingId: string, status: string) {
    if (!BookingStatus[status as keyof typeof BookingStatus]) {
      throw new Error("Invalid booking status");
    }

    try {
    await this.bookingRepository.updateStatus(bookingId, status);
    } catch (error) {
      throw new Error("Failed to update booking status");
    }
  }
}
