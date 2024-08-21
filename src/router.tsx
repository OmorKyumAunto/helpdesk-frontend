import { Navigate, createBrowserRouter } from "react-router-dom";
import NotFound from "./components/notFound/NotFound";
import UnauthorizePage from "./components/notFound/UnauthorizePage";
import ProtectedRoute from "./utils/ProtectRoute";
import { Login } from "./auth/pages/Login";
import ForgotPassword from "./auth/pages/ForgotPassword";
import SendOtp from "./auth/pages/SendOtp";
import { AppLayout } from "./components/appLayout/AppLayout";
import ResetPassword from "./auth/pages/ResetPassword";
import EmployeeList from "./modules/employee/pages/Employeelist";
import SingleEmployee from "./modules/employee/pages/SingleEmployee";
import AssetsList from "./modules/assets/pages/AssetsList";
import DistributedAsset from "./modules/assets/pages/DistributedAsset";

export const routers = createBrowserRouter([
  { path: "*", element: <NotFound /> },
  {
    path: "/login",
    element: <ProtectedRoute children={<Login />} />,
  },

  {
    path: "/unauthorized",
    element: <UnauthorizePage />,
  },
  {
    path: "/forget-password",
    element: <ProtectedRoute children={<ForgotPassword />} />,
  },
  {
    path: "forget-password/otp",
    element: <ProtectedRoute children={<SendOtp />} />,
  },
  {
    path: "/reset-password",

    element: <ProtectedRoute children={<ResetPassword />} />,
  },
  {
    path: "/dashboard",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/",
    element: <AppLayout />,
    // element: <RequireUser children={<AppLayout />} />,
    children: [
      {
        path: "/",
        // element: <RequireUser children={<DashboardDemo />} />,
      },
      {
        path: "/assets/list",
        element: <AssetsList />,
      },
      {
        path: "/assets/distributed",
        element: <DistributedAsset />,
      },
      {
        path: "/employee/list",
        element: <EmployeeList />,
      },
      {
        path: "/employee/list/:id",
        element: <SingleEmployee />,
      },
    ],
  },
]);
