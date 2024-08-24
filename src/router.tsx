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
import AssetsList from "./modules/assets/pages/AssetsList";
import DistributedAsset from "./modules/assets/pages/DistributedAsset";
import RequireUser from "./utils/requireUser";
import { DashboardDemo } from "./modules/dashboard/Pages/DashboardDemo";
import DashboardCards from "./modules/dashboard/Pages/DashboardCards";
import ProfileSection from "./components/navBar/ProfileSection";
import About from "./modules/about/page/About";
import Forms from "./modules/forms/page/Forms";
import Register from "./auth/pages/Register";

export const routers = createBrowserRouter([
  { path: "*", element: <NotFound /> },
  {
    path: "/login",
    element: <ProtectedRoute children={<Login />} />,
  },
  {
    path: "/register",
    element: <ProtectedRoute children={<Register />} />,
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
    // element: <AppLayout />,
    element: <RequireUser children={<AppLayout />} />,
    children: [
      {
        path: "/",
        // element: <RequireUser children={<DashboardDemo />} />,
        element: <DashboardCards />,
      },
      // {
      //   path: "/setting/profile",
      //   element: <ProfileSection />,
      // },
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
        path: "/forms",
        element: <Forms />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);
