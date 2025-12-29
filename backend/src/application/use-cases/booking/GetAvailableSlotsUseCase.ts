import { startOfDay, endOfDay, setHours, setMinutes, addMinutes, isBefore, format, parseISO } from 'date-fns';
import { IBookingRepository } from '../../interfaces/IBookingRepository';
import { Booking } from '../../../domain/entities/Booking';

interface Request {
  date: string;
  serviceDuration: number;
}

export class GetAvailableSlotsUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute({ date, serviceDuration }: Request): Promise<string[]> {
    const searchDate = parseISO(date);
    
    const startHour = 9;
    const endHour = 18;

    const bookings = await this.bookingRepository.findManyByDate(
      startOfDay(searchDate),
      endOfDay(searchDate)
    );

    const slots: string[] = [];
    let currentTime = setHours(setMinutes(searchDate, 0), startHour);
    const endTime = setHours(setMinutes(searchDate, 0), endHour);

    while (isBefore(currentTime, endTime)) {
      const slotEnd = addMinutes(currentTime, serviceDuration);

      if (isBefore(slotEnd, endTime) || slotEnd.getTime() === endTime.getTime()) {
        
        const isBusy = bookings.some((booking: Booking) => {
          return (
            (currentTime >= booking.startTime && currentTime < booking.endTime) ||
            (slotEnd > booking.startTime && slotEnd <= booking.endTime) ||
            (currentTime <= booking.startTime && slotEnd >= booking.endTime)
          );
        });

        if (!isBusy) {
          slots.push(format(currentTime, 'HH:mm'));
        }
      }

      currentTime = addMinutes(currentTime, 60); 
    }

    return slots;
  }
}