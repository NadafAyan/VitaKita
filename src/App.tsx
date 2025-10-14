import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserRecord from "./components/UserRecord";
import CounselingPage from "./components/CounselingPage";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function useFirebaseAuth() {
  const [user, setUser] = useState<any | null>(undefined); // undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe();
  }, []);

  return user;
}

const queryClient = new QueryClient();

const App = () => {
  const user = useFirebaseAuth();

  // Defer auth gating to route elements; Index will show AuthPage when user is null

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index user={user} />} />
            <Route
              path="/counseling"
              element={user ? <CounselingPage user={user} /> : <Index user={user} />}
            />
            <Route
              path="/User"
              element={user ? <UserRecord user={user} /> : <Index user={user} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
