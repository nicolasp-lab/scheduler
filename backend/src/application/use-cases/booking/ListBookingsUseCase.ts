import { IBookingRepository } from "../../interfaces/IBookingRepository";

export class ListBookingsUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute() {
    const bookings = await this.bookingRepository.findAll();
    return bookings;
  }
}
