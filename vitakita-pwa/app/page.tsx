"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth");
      return;
    }

    // Check if user has taken the test TODAY
    const checkAssessmentStatus = () => {
      const lastDate = userData?.lastAssessmentDate?.toDate();
      if (!lastDate) {
        // Never taken
        router.push("/onboarding");
        return;
      }

      const today = new Date();
      const isSameDay =
        lastDate.getDate() === today.getDate() &&
        lastDate.getMonth() === today.getMonth() &&
        lastDate.getFullYear() === today.getFullYear();

      if (!isSameDay) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    };

    checkAssessmentStatus();

  }, [user, loading, router, userData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-2xl">❤️</span>
        </div>
        <h1 className="text-2xl font-bold text-blue-900">VitaKita</h1>
        <p className="text-gray-500 flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} />
          Loading...
        </p>
      </div>
    </div>
  );
}
