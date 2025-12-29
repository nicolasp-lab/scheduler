import { IBookingRepository } from "../../interfaces/IBookingRepository";

export class DeleteBookingUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(bookingId: string) {
    
    try {
    await this.bookingRepository.delete(bookingId);
    } catch (error) {
      throw new Error("Failed to delete booking");
    }
  }
}
