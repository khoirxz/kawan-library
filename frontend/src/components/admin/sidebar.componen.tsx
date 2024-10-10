import { ReactNode } from "react";
import { useMatches, NavLink } from "react-router-dom";
import { Menu } from "antd";
import { routes } from "../../routes";
import { MenuProps as RoutesProps } from "../../utils/menu";

type MenuProps = {
  key: string;
  name?: string;
  icon?: ReactNode;
  label?: ReactNode | string;
  children?: MenuProps[];
  path?: string;
  id?: string;
  show?: boolean;
};

export const createRouteConfig = (routes: RoutesProps) => {
  const routeList: {
    path: string;
    element: React.ReactNode;
    id: string;
    parent?: string;
    show?: boolean;
  }[] = [];

  routes.forEach((route) => {
    // Check if the parent route should be shown
    if (route) {
      routeList.push({
        path: route.path,
        element: route.element,
        id: route.key,
        parent: route.parent,
      });

      // If the route has children, check their show property as well
      if (route.children) {
        route.children.forEach((child) => {
          if (child) {
            // Check show for children
            routeList.push({
              path: child.path,
              element: child.element,
              id: child.key,
              parent: child.parent, // Set parent to the parent's id
            });
          }
        });
      }
    }
  });

  return routeList;
};

const SidebarComponent: React.FC = () => {
  // Format routes untuk AntD Menu
  const formatMenu: (routes: MenuProps[]) => MenuProps[] = (routes) => {
    const items = routes
      .filter((route) => route.show) // Filter parent routes with show: true
      .map((route) => ({
        key: route.key.toString(),
        icon: route.icon,
        label: (
          <NavLink
            to={route.path || ""}
            style={{
              color: "#fff",
            }}>
            {route.name}
          </NavLink>
        ),
        children: route.children
          ?.filter((child) => child.show) // Filter children with show: true
          .map((child) => ({
            key: child.key.toString(),
            label: <NavLink to={child.path || ""}>{child.name}</NavLink>,
          })),
      }));

    return items;
  };

  // match id menus and id route
  const matches = useMatches();

  const getSelectedKeys = () => {
    const key = createRouteConfig(routes).find(
      (route) => route.id === matches[0].id
    );

    if (!key?.parent) {
      return key?.id;
    } else if (key?.parent.slice(0, 3) === "sub") {
      return key.id;
    }

    return key.parent;
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[getSelectedKeys() || ""]}
      defaultOpenKeys={[
        createRouteConfig(routes).find((route) => route.id === matches[0].id)
          ?.parent || "",
      ]}
      items={formatMenu(routes)}
    />
  );
};

export default SidebarComponent;
