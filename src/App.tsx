import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/DashboardHome";
import DummyDashboard from "./components/Pages/Sales1/Dashboard/DummyDashboard";
import InventoryPage from "./components/Pages/Inventory/InventoryPage";
import ShipmentPage from "./components/Pages/Shipment/ShipmentPage";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
// import ProtectedRoute from "./components/auth/ProtectedRoute";

import OrdersPage from "./components/Pages/Orders/OrdersPage";
import SalesAnalysis from "./components/Pages/Sales1/Sales Analysis/SalesAnalysis";
import { SalesByRegion } from "./components/Pages/Sales1/Region/SalesByRegion";
import SalesFlow from "./components/Pages/Sales1/SalesFlow";
import Scheduler from "./components/Pages/Scheduler/Scheduler";
import FulfillmentPage from "./components/Pages/Fulfillment/FulfillmentPage";
import { UserManagement } from "./components/Pages/user Management/UserManagement";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Layout & Routes */}
        {/* <Route path="/" element={<ProtectedRoute element={<AppLayout />} />}> */}
          <Route index element={<Home />} />

          {/* User Management (Admin/Manager Only) */}
          <Route
            path="usermanagement"
            element={<UserManagement />}
          />

          {/* <Route
            path="usermanagement"
            element={
              <ProtectedRoute
                element={<UserManagement />}
                allowedRoles={["admin", "manager"]}
              />
            }
          /> */}

          {/* General Pages */}
          <Route path="orders" element={<OrdersPage />} />
          <Route path="sales/analysis" element={<SalesAnalysis />} />
          <Route path="sales/dashboard" element={<DummyDashboard />} />
          <Route path="sales/region" element={<SalesByRegion />} />
          <Route path="sales/flow" element={<SalesFlow />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="shipment" element={<ShipmentPage />} />
          <Route path="fulfillment" element={<FulfillmentPage />} />
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />

          {/* Fallback Page inside Protected Layout */}
          <Route path="*" element={<NotFound />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
}
