import { Booking } from "../../domain/entities/Booking";

export interface IBookingRepository {
  save(booking: Booking): Promise<void>;
  findOverlappingBooking(startTime: Date, endTime: Date): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  updateStatus(bookingId: string, status: string): Promise<void>;
  delete(bookingId: string): Promise<void>;
  findManyByDate(startDate: Date, endDate: Date): Promise<Booking[]>;
}
