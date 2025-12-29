import { Booking } from "../../../domain/entities/Booking";
import { IBookingRepository } from "../../interfaces/IBookingRepository";

export interface CreateBookingInput {
  clientName: string;
  clientEmail: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
}

export class CreateBookingUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(input: CreateBookingInput): Promise<void> {
    const overlappingBooking = await this.bookingRepository.findOverlappingBooking(
      input.startTime,
      input.endTime
    );

    if (overlappingBooking) {
      throw new Error("Time slot is already booked.");
    }

    const booking = new Booking(
      input.clientName,
      input.clientEmail,
      input.serviceId,
      input.startTime,
      input.endTime
    );
    await this.bookingRepository.save(booking);
  }
}
