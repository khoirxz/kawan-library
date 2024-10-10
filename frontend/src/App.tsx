import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes as route } from "./routes";
import { MenuProps } from "./utils/menu";
import { ConfigProvider } from "antd";

import LoginPage from "./pages/auth/login.page";
import SignupPage from "./pages/auth/signup.page";

export const createRouteConfig = (routes: MenuProps) => {
  const routeList: {
    path: string;
    element: React.ReactNode;
    id: string;
  }[] = [];

  route.forEach((route) => {
    routeList.push({
      path: route.path,
      element: route.element,
      id: route.key,
    });

    if (route.children) {
      route.children.forEach((child) => {
        routeList.push({
          path: child.path,
          element: child.element,
          id: child.key,
        });
      });
    }
  });

  // filter if path === "" dont show
  return routeList.filter((route) => route.path !== "");
};

const router = createBrowserRouter([
  ...createRouteConfig(route),
  {
    path: "/",
    element: <LoginPage />,
    id: "login",
  },
  {
    path: "/signup",
    element: <SignupPage />,
    id: "signup",
  },
]);

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Inter",
        },
      }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
