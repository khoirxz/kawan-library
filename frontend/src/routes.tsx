import { MenuProps } from "./utils/menu";
import ProtectedRoute from "./utils/protectedRoute";
import { UserOutlined, DashboardOutlined } from "@ant-design/icons";

import DashboardPage from "./pages/admin/dashboard.page";
import UserListPage from "./pages/admin/users/list.page";
import UserFormPage from "./pages/admin/users/form.page";
import DecreeListPage from "./pages/admin/decrees/list.page";
import DecreeFormPage from "./pages/admin/decrees/form.page";
import CertificateListPage from "./pages/admin/certificates/list.page";
import CertificateFormPage from "./pages/admin/certificates/form.page";

export const routes: MenuProps = [
  {
    key: "1",
    path: "/admin/dashboard",
    show: true,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    name: "Dashboard",
    id: "dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "2",
    path: "/admin/users",
    show: true,
    element: (
      <ProtectedRoute>
        <UserListPage />{" "}
      </ProtectedRoute>
    ),
    id: "users",
    name: "Users",
    icon: <UserOutlined />,
  },
  {
    key: "3",
    path: "/admin/users/form",
    show: false,
    element: (
      <ProtectedRoute>
        <UserFormPage />
      </ProtectedRoute>
    ),
    id: "users-form",
    name: "User Form",
    icon: <UserOutlined />,
    parent: "2",
  },
  {
    key: "4",
    path: "/admin/users/form/:id",
    show: false,
    element: (
      <ProtectedRoute>
        <UserFormPage />
      </ProtectedRoute>
    ),
    id: "user-form-edit",
    name: "User Form",
    icon: <UserOutlined />,
    parent: "2",
  },
  {
    key: "sub2",
    path: "",
    element: (
      <ProtectedRoute>
        <UserListPage />
      </ProtectedRoute>
    ),
    name: "General",
    show: true,
    id: "general",
    icon: <DashboardOutlined />,
    children: [
      {
        key: "6",
        parent: "sub2",
        show: true,
        path: "/admin/general/product",
        name: "Produk",
        element: (
          <ProtectedRoute>
            <UserListPage />
          </ProtectedRoute>
        ),
        id: "general-list",
      },
      {
        key: "7",
        parent: "sub2",
        show: true,
        path: "/admin/general/human-resource",
        name: "SDM",
        element: (
          <ProtectedRoute>
            <UserListPage />
          </ProtectedRoute>
        ),
        id: "human-resource-list",
      },
    ],
  },
  {
    key: "8",
    path: "/admin/decree/:id",
    element: (
      <ProtectedRoute>
        <DecreeListPage />
      </ProtectedRoute>
    ),
    name: "List Surat Keputusan",
    show: false,
    id: "decree",
    icon: <UserOutlined />,
    parent: "2",
  },
  {
    key: "9",
    path: "/admin/decree/form/add/:id/",
    element: (
      <ProtectedRoute>
        <DecreeFormPage />
      </ProtectedRoute>
    ),
    name: "Form add Surat Keputusan By Id",
    show: false,
    id: "decree",
    icon: <UserOutlined />,
    parent: "2",
  },
  {
    key: "10",
    path: "/admin/decree/form/edit/:id/:decreeId",
    element: (
      <ProtectedRoute>
        <DecreeFormPage />
      </ProtectedRoute>
    ),
    name: "Form edit Surat Keputusan By Id",
    show: false,
    id: "decree",
    icon: <UserOutlined />,
    parent: "2",
  },
  {
    key: "11",
    path: "/admin/portfolio/:id",
    element: (
      <ProtectedRoute>
        <CertificateListPage />
      </ProtectedRoute>
    ),
    name: "List Sertifikat",
    show: false,
    id: "certificate",
    icon: <UserOutlined />,
    parent: "2",
  },
  {
    key: "12",
    path: "/admin/portofolio/form/add/:id",
    element: (
      <ProtectedRoute>
        <CertificateFormPage />
      </ProtectedRoute>
    ),
    name: "Form add Sertifikat By Id",
    show: false,
    id: "certificate",
    icon: <UserOutlined />,
    parent: "2",
  },
  {
    key: "13",
    path: "/admin/portofolio/form/edit/:id/:certificateId",
    element: (
      <ProtectedRoute>
        <CertificateFormPage />
      </ProtectedRoute>
    ),
    name: "Form edit Sertifikat By Id",
    show: false,
    id: "certificate",
    icon: <UserOutlined />,
    parent: "2",
  },
];
