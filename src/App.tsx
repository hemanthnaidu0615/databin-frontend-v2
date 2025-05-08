import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/auth/PrivateRoute";
import Home from "./pages/Dashboard/Home";
import OrdersPage from "./components/Pages/Orders/OrdersPage";
import { SalesDashboard } from "./components/Pages/Sales/SalesDashboard";
import { Analysis } from "./components/Pages/Sales/Analysis";
import { SalesByRegion } from "./components/Pages/Sales/SalesByRegion";
import SalesFlow from "./components/Pages/Sales/SalesFlow";
import Scheduler from "./components/Pages/Scheduler/Scheduler";
import { UserManagement } from "./components/Pages/user Management/UserManagement";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        console.log("User data from /me:", data);
        setUser({
          id: data.id,
          role_id: data.role_id,
          role: data.role,
          token: "", // token not used with httpOnly cookie
        });
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ✅ Prevent premature route rendering
  if (loading) {
    console.log("Still loading user...");
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<AppLayout user={user} />}>
            <Route index element={<Home />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/sales/dashboard" element={<SalesDashboard />} />
            <Route path="/sales/analysis" element={<Analysis />} />
            <Route path="/sales/region" element={<SalesByRegion />} />
            <Route path="/sales/flow" element={<SalesFlow />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/UserManagement" element={<UserManagement />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
