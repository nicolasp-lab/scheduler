import { prisma } from "../client";
import { Booking } from "../../../../domain/entities/Booking";
import { IBookingRepository } from "../../../../application/interfaces/IBookingRepository";
import { BookingStatus } from "../../../../domain/entities/Booking";

export class PrismaBookingRepository implements IBookingRepository {
  async save(booking: Booking): Promise<void> {
    await prisma.booking.create({
      data: {
        id: booking.id,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        serviceId: booking.serviceId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
      },
    });
  }

  async findOverlappingBooking(startTime: Date, endTime: Date): Promise<Booking | null> {
    const found = await prisma.booking.findFirst({
      where: {
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
          { status: { not: "CANCELLED" } },
        ],
      },
    });

    if (!found) return null;

    return new Booking(
      found.clientName,
      found.clientEmail,
      found.serviceId,
      found.startTime,
      found.endTime,
      found.id,
      found.status
    );
  }

  async findAll(): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      orderBy: { startTime: "desc" },
      include: { service: true },
    });

    return bookings as any;
  }

  async updateStatus(bookingId: string, status: string): Promise<void> {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as BookingStatus },
    });
  }

  async delete(bookingId: string): Promise<void> {
    await prisma.booking.delete({
      where: { id: bookingId },
    });
  }

  async findManyByDate(startDate: Date, endDate: Date): Promise<Booking[]> {
    
    
    const bookings = await prisma.booking.findMany({
      where: {
        startTime: { gte: startDate },
        endTime: { lte: endDate },
        status: { not: "CANCELLED" },
      },
    });

    return bookings as any;
  }
}
