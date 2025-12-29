"use client";

import { useEffect, useState } from "react";
import {
  updateStatusBooking,
  deleteBooking,
  getBookings,
  deleteService,
  updateServiceActive,
  getAllServices,
} from "@/services/api";
import { Service } from "@/types";
import { LogOut, Trash2 } from "lucide-react";
import { Booking } from "@/types";
import { useRouter } from "next/navigation";
import CreateServiceForm from "@/components/CreateServiceForm";

export default function AdminPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [token, setToken] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchToken = () => {
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/scheduler-token=([^;]+)/);

        if (!match) {
          window.location.href = "/admin/login";
          return;
        }

        setToken(match ? match[1] : "");
      }
    };
    fetchToken();
  }, []);

  const router = useRouter();

  const statuses: Booking["status"][] = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      const data = await getBookings(token);
      setBookings(data);
    };

    const fetchServices = async () => {
      const data = await getAllServices(token);
      setServices(data);
    };

    fetchBookings();
    fetchServices();
  }, [token]);
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(Number(serviceId), token);
      setServices((prev) => prev.filter((service) => String(service.id) !== String(serviceId)));
    } catch (error) {
      alert("Error deleting service. It might be associated with existing bookings.");
      console.error(error);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: Booking["status"]) => {
    setLoading(bookingId);
    try {
      await updateStatusBooking(bookingId, newStatus, token);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      setOpenDropdown(null);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    setLoading(bookingId);
    try {
      if (!confirm("Are you sure you want to delete this booking?")) return;

      await deleteBooking(bookingId, token);
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } finally {
      setLoading(null);
    }
  };

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;

    if (typeof document !== "undefined") {
      document.cookie = "scheduler-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    router.push("/admin/login");
    router.refresh();
  };

  const handleToggleActive = async (serviceId: string, currentActive: boolean) => {
    await updateServiceActive(serviceId, !currentActive, token);
    setServices((prev) =>
      prev.map((s) => (String(s.id) === serviceId ? { ...s, active: !currentActive } : s))
    );
  };

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="border rounded-lg overflow-auto mb-8 max-h-96">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Client</th>
              <th className="p-4">Service</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{new Date(booking.startTime).toLocaleString()}</td>
                <td className="p-4">
                  {booking.clientName}
                  <div className="text-xs text-gray-500">{booking.clientEmail}</div>
                </td>
                <td className="p-4">{booking.service.name}</td>
                <td className="p-4 relative">
                  <div className="relative inline-block">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === booking.id ? null : booking.id)
                      }
                      disabled={loading === booking.id}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${getStatusColor(
                        booking.status as unknown as string
                      )} ${loading === booking.id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {booking.status}
                    </button>
                    {openDropdown === booking.id && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(booking.id, status)}
                            disabled={loading === booking.id}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                              booking.status === status ? "bg-gray-100 font-bold" : ""
                            } ${loading === booking.id ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(booking.id)}
                    disabled={loading === booking.id}
                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete booking"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateServiceForm token={token} />
      <div className="border rounded-lg overflow-auto max-h-96 mt-8">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Price</th>
              <th className="p-4">Active</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{service.name}</td>
                <td className="p-4">{service.description}</td>
                <td className="p-4">{service.duration} min</td>
                <td className="p-4">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                    service.price
                  )}
                </td>
                <td className="p-4">
                  <button
                    className={`font-semibold ${
                      service.active ? "text-green-700" : "text-gray-500"
                    } underline`}
                    onClick={() => handleToggleActive(String(service.id), service.active)}
                    style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
                  >
                    {service.active ? "Yes" : "No"}
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteService(String(service.id))}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete service"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
