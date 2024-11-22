import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthRouter from "@/utils/authRouter";

import AuthPage from "@/pages/auth";
import DashboardPage from "@/pages/admin/dashboard";
import UserListPage from "@/pages/admin/user";
import UserFormPage from "@/pages/admin/user/form";
import DecreeListPage from "@/pages/admin/decree";
import DecreeFormPage from "@/pages/admin/decree/form";
import DecreeCategoryListPage from "@/pages/admin/decree/pages/category";
import DecreeCategoryFormPage from "@/pages/admin/decree/pages/category/form";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AuthPage />,
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
  ],
  {
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
