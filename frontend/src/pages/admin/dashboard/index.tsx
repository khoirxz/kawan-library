import { AdminLayout } from "@/layouts/admin";

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
          Hello World
        </h1>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
