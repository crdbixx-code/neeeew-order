import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Checkout from "./pages/checkout";
import PaymentSuccess from "./pages/payment/Success";
import PaymentFailed from "./pages/payment/Failed";
import PaymentPending from "./pages/payment/Pending";
import AdminOrders from "./pages/admin/Orders";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import Inventory from "./pages/inventory";
import AdminControl from "./pages/admincontrol";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/admin", element: <AdminOrders /> },
  { path: "/setting", element: <Settings /> },
  { path: "/inventory", element: <Inventory /> },
  { path: "/admincontrol", element: <AdminControl /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/payment/success", element: <PaymentSuccess /> },
  { path: "/payment/failed", element: <PaymentFailed /> },
  { path: "/payment/pending", element: <PaymentPending /> },
  { path: "/payment/cancel", element: <PaymentFailed /> },
  { path: "/admin/orders", element: <AdminOrders /> },
]);

export default router;
