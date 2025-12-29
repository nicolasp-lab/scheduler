"use client"

import AuthForm from "@/components/AuthForm";
import { authenticateUser } from "@/services/api";
import { useRouter } from "next/navigation";
import { AdminFormData } from "@/components/AuthForm";
import { setCookie } from "nookies";

export default function Home() {
  const router = useRouter();

  const handleLogin = async (data: AdminFormData) => {
    try {
      const response = await authenticateUser(data.email, data.password);

      setCookie(null, "scheduler-token", response.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      router.push("/admin/dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Login</h1>
      <AuthForm onSubmit={handleLogin} />
    </main>
  );
}
