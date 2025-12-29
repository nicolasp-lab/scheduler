import BookingWizard from "@/components/BookingWizard";
import { getServices } from "@/services/api";

export default async function Home() {
  const services = await getServices();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Scheduler System</h1>
      <BookingWizard services={services} />
    </main>
  );
}
