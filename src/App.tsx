
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ElectionProvider } from "./context/ElectionContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ElectionsList from "./pages/ElectionsList";
import ElectionDetail from "./pages/ElectionDetail";
import AdminDashboard from "./pages/AdminDashboard";
import CreateElection from "./pages/CreateElection";
import CandidatePortal from "./pages/CandidatePortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ElectionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/elections" element={<ElectionsList />} />
                  <Route path="/elections/:id" element={<ElectionDetail />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/create-election" element={<CreateElection />} />
                  <Route path="/candidate" element={<CandidatePortal />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ElectionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
