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
import Home from "./pages/Dashboard/Home";

// ✅ Corrected import
import OrdersPage from "./components/Pages/Orders/OrdersPage";
import { SalesDashboard } from "./components/Pages/Sales/SalesDashboard";
import { Analysis } from "./components/Pages/Sales/Analysis";
import { SalesByRegion } from "./components/Pages/Sales/SalesByRegion";
import SalesFlow from "./components/Pages/Sales/SalesFlow";
import Scheduler  from "./components/Pages/Scheduler/Scheduler";
// import Sales from "./components/Pages/sales copy/Sales";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />

          {/* ✅ Orders Page Route */}
          <Route path="/orders" element={<OrdersPage />} />

          {/* Sales Pages */}
          {/* <Route path="/sales" element={<Sales />} /> */}
          <Route path="/sales/dashboard" element={<SalesDashboard />} />
          <Route path="/sales/analysis" element={<Analysis />} />
          <Route path="/sales/region" element={<SalesByRegion />} />
          <Route path="/sales/flow" element={<SalesFlow />} />

          {/* Scheduler Page */}
          <Route path="/scheduler" element={<Scheduler />} />

          {/* Inventory Pages */}

          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* UI Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Auth Layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
