export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  serviceId: number;
  createdAt: string;
  udpatedAt: string;
  service: Service;
}
