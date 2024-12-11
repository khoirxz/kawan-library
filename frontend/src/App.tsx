import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthRouter from "@/utils/authRouter";

import AuthPage from "@/pages/auth";
import UserHomePage from "@/pages/user/home";
import DashboardPage from "@/pages/admin/dashboard";
import UserListPage from "@/pages/admin/user";
import UserFormPage from "@/pages/admin/user/form";
import DecreeListPage from "@/pages/admin/decree";
import DecreeFormPage from "@/pages/admin/decree/form";
import DecreeCategoryListPage from "@/pages/admin/decree/pages/category";
import DecreeCategoryFormPage from "@/pages/admin/decree/pages/category/form";
import CertificateListPage from "@/pages/admin/certificates";
import CertificateFormPage from "@/pages/admin/certificates/form";
import EmployeFormPage from "@/pages/admin/employee/form";
import UserProfilePage from "@/pages/user/profile/pages/user";
import UserProfileEmployePage from "@/pages/user/profile/pages/employe";
import UserPortfolioPage from "@/pages/user/portfolio";
import UserSettingPersoalFormPage from "@/pages/user/setting/pages/personal/form";
import UserSettingLocationFormPage from "@/pages/user/setting/pages/location/form";
import UserSettingContactFormPage from "@/pages/user/setting/pages/contact/form";
import UserSettingWorkListPage from "./pages/user/setting/pages/work";
import UserSettingWorkFormPage from "./pages/user/setting/pages/work/form";
import UserCertificateListPage from "@/pages/user/certificates";
import UserDecreeListPage from "@/pages/user/decree";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AuthPage />,
    },
    {
      path: "/home",
      element: (
        <AuthRouter>
          <UserHomePage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        <AuthRouter>
          <DashboardPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/user/list",
      element: (
        <AuthRouter>
          <UserListPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/user/form",
      element: (
        <AuthRouter>
          <UserFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/user/form/:id",
      element: (
        <AuthRouter>
          <UserFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/decree/list",
      element: (
        <AuthRouter>
          <DecreeListPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/decree/form",
      element: (
        <AuthRouter>
          <DecreeFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/decree/form/:id",
      element: (
        <AuthRouter>
          <DecreeFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/decree/category/list",
      element: (
        <AuthRouter>
          <DecreeCategoryListPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/decree/category/form/",
      element: (
        <AuthRouter>
          <DecreeCategoryFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/decree/category/form/:id",
      element: (
        <AuthRouter>
          <DecreeCategoryFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/certificate/list",
      element: (
        <AuthRouter>
          <CertificateListPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/certificate/form",
      element: (
        <AuthRouter>
          <CertificateFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/certificate/form/:id",
      element: (
        <AuthRouter>
          <CertificateFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/admin/employee/form/:id",
      element: (
        <AuthRouter>
          <EmployeFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/profile/:id",
      element: (
        <AuthRouter>
          <UserProfilePage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/profile/employe/:id",
      element: (
        <AuthRouter>
          <UserProfileEmployePage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/portfolio/:id",
      element: (
        <AuthRouter>
          <UserPortfolioPage />
        </AuthRouter>
      ),
    },
    // setting route
    {
      path: "/user/setting/personal/:id",
      element: (
        <AuthRouter>
          <UserSettingPersoalFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/setting/work/:id",
      element: (
        <AuthRouter>
          <UserSettingWorkListPage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/setting/work/form/:id/",
      element: (
        <AuthRouter>
          <UserSettingWorkFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/setting/work/form/:id/:itemId",
      element: (
        <AuthRouter>
          <UserSettingWorkFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/setting/location/:id",
      element: (
        <AuthRouter>
          <UserSettingLocationFormPage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/setting/contact/:id",
      element: (
        <AuthRouter>
          <UserSettingContactFormPage />
        </AuthRouter>
      ),
    },
    // end setting route
    {
      path: "/user/certificate/:id",
      element: (
        <AuthRouter>
          <UserCertificateListPage />
        </AuthRouter>
      ),
    },
    {
      path: "/user/decree/:id",
      element: (
        <AuthRouter>
          <UserDecreeListPage />
        </AuthRouter>
      ),
    },
  ],
  {
    // basename: "/library",
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

const App: React.FC = () => {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
};
export default App;
