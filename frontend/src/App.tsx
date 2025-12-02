import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OpenStudy from "./pages/OpenStudy";
import GroupStudy from "./pages/GroupStudy";
import Checklist from "./pages/Checklist";
import OpenStudyRoom from "./pages/OpenStudyRoom";
import GroupStudyRoom from "./pages/GroupStudyRoom"; // ✅ 추가
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/open-study" element={<OpenStudy />} />
            <Route path="/group-study" element={<GroupStudy />} />
            {/* 초대 링크 라우트 (별도 페이지 없이 GroupStudy에서 처리) */}
            <Route path="/group-invite/:groupId" element={<GroupStudy />} />
            <Route path="/checklist" element={<Checklist />} />
            {/* ✅ 추가: 그룹 스터디룸 페이지 */}
            <Route
              path="/group-study/room/:roomId"
              element={<GroupStudyRoom />}
            />
            {/* 오픈 스터디룸 페이지 */}
            <Route
              path="/open-study/room/:roomId"
              element={<OpenStudyRoom />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
