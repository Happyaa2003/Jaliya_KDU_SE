import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentRegistrationPage from "./pages/StudentRegistrationPage";
import ManageStudentsPage from "./pages/ManageStudentsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import CourseManagementPage from "./pages/CourseManagementPage";
import EnrollmentManagementPage from "./pages/EnrollmentManagementPage";
import AuditTrailPage from "./pages/AuditTrailPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/register" element={<StudentRegistrationPage />} />
          <Route path="/students" element={<ManageStudentsPage />} />
          <Route path="/students/:id" element={<StudentProfilePage />} />
          <Route path="/courses" element={<CourseManagementPage />} />
          <Route path="/enrollment" element={<EnrollmentManagementPage />} />
          <Route path="/audit" element={<AuditTrailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
