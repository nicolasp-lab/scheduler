import { randomUUID } from "node:crypto";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export class Booking {
  public readonly id: string;
  public readonly status: BookingStatus;

  constructor(
    public readonly clientName: string,
    public readonly clientEmail: string,
    public readonly serviceId: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    id?: string,
    status?: BookingStatus
  ) {
    this.id = id || randomUUID();
    this.status = status || "PENDING";
  }

  private validate(): void {
    if (this.endTime <= this.startTime) {
      throw new Error("Invalid duration: End time must be after start time.");
    }
  }
}
