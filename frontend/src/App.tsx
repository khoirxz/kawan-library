import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "@/pages/auth";
import DashboardPage from "@/pages/admin/dashboard";
import UserListPage from "./pages/admin/users";
import UserFormPage from "./pages/admin/users/form";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/admin/dashboard",
      element: <DashboardPage />,
    },
    {
      path: "/admin/list",
      element: <UserListPage />,
    },
    {
      path: "/admin/form",
      element: <UserFormPage />,
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

function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default App;
