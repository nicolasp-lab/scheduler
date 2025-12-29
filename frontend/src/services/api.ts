import axios from "axios";

const isProd = process.env.NODE_ENV === "production";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (isProd && !apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in production environment");
}

export const api = axios.create({
  baseURL: apiUrl || "http://localhost:3333",
});

export async function getServices() {
  const response = await api.get("/services/active");
  return response.data;
}

export async function getAllServices(token: string) {
  const response = await api.get("/services/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function authenticateUser(email: string, password: string) {
  const response = await api.post("/admin/authenticate", { email, password });
  return response.data;
}

export async function getBookings(token: string) {
  const response = await api.get("/bookings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getAvailableSlots(date: string, serviceId: number) {
  const response = await api.get("/bookings/available-slots", {
    params: { date, serviceId },
  });
  return response.data;
}

export async function updateStatusBooking(bookingId: string, status: string, token: string) {
  const response = await api.patch(
    "/bookings",
    { bookingId, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function deleteBooking(bookingId: string, token: string) {
  const response = await api.delete("/bookings", {
    data: { bookingId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteService(serviceId: number, token: string) {
  const response = await api.delete(`/services/${serviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateServiceActive(serviceId: string, active: boolean, token: string) {
  const response = await api.patch(
    `/services/${serviceId}/active`,
    { active },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
