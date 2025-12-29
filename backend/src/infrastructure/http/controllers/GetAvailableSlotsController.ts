import { Request, Response } from 'express';
import { PrismaBookingRepository } from '../../database/prisma/repositories/PrismaBookingRepository';
import { GetAvailableSlotsUseCase } from '../../../application/use-cases/booking/GetAvailableSlotsUseCase';
import { prisma } from '../../database/prisma/client';

export class GetAvailableSlotsController {
  async handle(req: Request, res: Response) {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.status(400).json({ error: 'Missing date or serviceId' });
    }

    const service = await prisma.service.findUnique({ where: { id: String(serviceId) }});
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const bookingRepository = new PrismaBookingRepository();
    const getAvailableSlots = new GetAvailableSlotsUseCase(bookingRepository);

    const slots = await getAvailableSlots.execute({
      date: String(date),
      serviceDuration: service.duration
    });

    return res.json(slots);
  }
}