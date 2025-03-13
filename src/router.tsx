import { Navigate, createBrowserRouter } from "react-router-dom";
import ForgotPassword from "./auth/pages/ForgotPassword";
import { Login } from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import ResetPassword from "./auth/pages/ResetPassword";
import SendOtp from "./auth/pages/SendOtp";
import { AppLayout } from "./components/appLayout/AppLayout";
import ProfileSection from "./components/navBar/ProfileSection";
import NotFound from "./components/notFound/NotFound";
import UnauthorizePage from "./components/notFound/UnauthorizePage";
import About from "./modules/about/page/About";
import AdminList from "./modules/admin/pages/Adminlist";
import AssetsList from "./modules/assets/pages/AssetsList";
import DistributedAsset from "./modules/assets/pages/DistributedAsset";
import EmployeeDistributedAsset from "./modules/assets/pages/EmployeeDistributedAsset";
import CTCList from "./modules/ctc/pages/CTCLIst";
import DashboardCards from "./modules/dashboard/Pages/DashboardCards";
import EmployeeList from "./modules/employee/pages/Employeelist";
import EmployeeListForEmployeePanel from "./modules/employee/pages/EmployeeListForEmployeePanel";
import Forms from "./modules/forms/page/Forms";
import LicenseList from "./modules/Licenses/pages/LicenseList";
import UnitList from "./modules/Unit/pages/UnitList";
import ProtectedRoute from "./utils/ProtectRoute";
import RequireUser from "./utils/requireUser";
import LocationList from "./modules/location/pages/LocationList";
import ITSop from "./modules/sop/page/ITSop";
import CategoryList from "./modules/Category/pages/CategoryList";
import AssignCategoryList from "./modules/assignCategory/pages/AssignCategoryList";
import TicketMain from "./modules/ticket/page/TicketMain";
import TicketConfig from "./modules/ticket/page/TicketConfig";
import TaskMain from "./modules/task/page/TaskMain";
import TaskConfigurationList from "./modules/taskConfiguration/pages/TaskCategoryList";
import TaskConfiguration from "./modules/taskConfiguration/pages/TaskConfiguration";

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
      {
        path: "/setting/profile",
        element: <ProfileSection />,
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
        path: "/employee/distributed",
        element: <EmployeeDistributedAsset />,
      },
      {
        path: "/employee/list",
        element: <EmployeeList />,
      },
      {
        path: "/employee/employee-list",
        element: <EmployeeListForEmployeePanel />,
      },
      {
        path: "/admin/list",
        element: <AdminList />,
      },
      {
        path: "/tickets/list",
        element: <TicketMain />,
      },
      {
        path: "/task/list",
        element: <TaskMain />,
      },
      {
        path: "/ctc/list",
        element: <CTCList />,
      },
      {
        path: "/forms",
        element: <Forms />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/sop/list",
        element: <ITSop />,
      },
      {
        path: "settings",
        children: [
          {
            path: "unit",
            element: <UnitList />,
          },
          {
            path: "location",
            element: <LocationList />,
          },
          {
            path: "license",
            element: <LicenseList />,
          },
          {
            path: "tickets-config",
            element: <TicketConfig />,
          },
          {
            path: "task-config",
            element: <TaskConfiguration />,
          },
        ],
      },
    ],
  },
]);
