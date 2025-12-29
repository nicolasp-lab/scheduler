
import express from "express";
import cors from "cors";
import { CreateBookingController } from "./infrastructure/http/controllers/CreateBookingController";
import { CreateServiceController } from "./infrastructure/http/controllers/CreateServiceController";
import { ListServicesController } from "./infrastructure/http/controllers/ListServicesController";
import { AuthenticateAdminController } from "./infrastructure/http/controllers/AuthenticateAdminController";
import { ListBookingsController } from "./infrastructure/http/controllers/ListBookingsController";
import { ensureAuthenticated } from "./infrastructure/http/middlewares/ensureAuthenticated";
import { UpdateBookingController } from "./infrastructure/http/controllers/UpdateBookingController";
import { DeleteBookingController } from "./infrastructure/http/controllers/DeleteBookingController";
import { GetAvailableSlotsController } from "./infrastructure/http/controllers/GetAvailableSlotsController";
import { UpdateServiceActiveController } from "./infrastructure/http/controllers/UpdateServiceActiveController";
import { DeleteServiceController } from "./infrastructure/http/controllers/DeleteServiceController";
import { ListAllServicesController } from "./infrastructure/http/controllers/ListAllServicesController";

const app = express();
app.use(express.json());
app.use(cors());

const controllers = {
  createBooking: new CreateBookingController(),
  createService: new CreateServiceController(),
  listServices: new ListServicesController(),
  authenticateAdmin: new AuthenticateAdminController(),
  listBookings: new ListBookingsController(),
  updateBooking: new UpdateBookingController(),
  deleteBooking: new DeleteBookingController(),
  getAvailableSlots: new GetAvailableSlotsController(),
  updateServiceActive: new UpdateServiceActiveController(),
  deleteService: new DeleteServiceController(),
  listAllServices: new ListAllServicesController(),
};

const route = (method: keyof typeof app, path: string, ...handlers: any[]) => {
  const last = handlers[handlers.length - 1];
  if (last && typeof last.handle === "function") {
    handlers[handlers.length - 1] = (req: any, res: any) => last.handle(req, res);
  }
  (app[method] as any)(path, ...handlers);
};

route("post", "/bookings", controllers.createBooking);
route("post", "/services", controllers.createService);
route("post", "/admin/authenticate", controllers.authenticateAdmin);

route("get", "/bookings", ensureAuthenticated, controllers.listBookings);
route("get", "/services/active", controllers.listServices);
route("get", "/services", ensureAuthenticated, controllers.listAllServices);
route("get", "/bookings/available-slots", controllers.getAvailableSlots);

route("patch", "/bookings", ensureAuthenticated, controllers.updateBooking);
route("patch", "/services/:id/active", ensureAuthenticated, controllers.updateServiceActive);

route("delete", "/bookings", ensureAuthenticated, controllers.deleteBooking);
route("delete", "/services/:id", ensureAuthenticated, controllers.deleteService);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
