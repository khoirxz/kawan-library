import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { SelectedUserDisplay } from "@/components/selected-user-display";
import { UserSelectionModal } from "@/components/user-selection-modal";

import { Context } from "@/context";
import { AdminLayout } from "@/layouts/admin";
import { baseAPI } from "@/api";
import { userProp } from "@/types/user";
import useEmployee from "./employeHook";
import { userEmployeProps } from "@/types/user";
import { NotificationDialog } from "@/components/notification-dialog";

const formSchema = z.object({
  user_id: z.string(),
  position: z.string().min(2, { message: "Title minimal 2 karakter" }),
  status: z.enum(["active", "inactive"]),
  salary: z.string().min(2, { message: "Description minimal 2 karakter" }),
});

const EmployeFormPage: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<userProp | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      position: "",
      status: "active",
      salary: "0",
    },
  });
  const { id } = useParams<{ id: string }>();
  const { users } = useEmployee();
  const {
    modalAlert,
    setModalAlert,
    setModalAlertData,
    modalAlertData,
    resetSate,
  } = useContext(Context);

  useEffect(() => {
    const getEmployeByIdUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userEmployeProps[] | null;
        }>(`${baseAPI.dev}/user/data/employe/${id}`);

        if (response.data.code === 200 && response.data.data) {
          const data = response.data.data[0];

          setIsAvailable(true);
          form.setValue("user_id", data.user_id || "");
          form.setValue("position", data.position || "");
          form.setValue("status", data.status);
          form.setValue("salary", data.salary.toString() || "0");
          if (data.supervisor_info) {
            setSelectedUser({
              id: data.supervisor_info?.id,
              role: data.supervisor_info?.role,
              username: data.supervisor_info?.username,
              avatarImg: data.supervisor_info?.avatarImg,
              verified: data.supervisor_info?.verified,
            });
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getEmployeByIdUser();
    }
  }, [id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log(data);
    try {
      const formData = {
        user_id: id,
        supervisor_id: selectedUser?.id ? selectedUser.id : null,
        position: data.position,
        status: data.status,
        salary: parseInt(data.salary, 10),
      };

      let response;
      if (isAvailable) {
        response = await axios.put<{
          code: number;
          status: string;
          message: string;
          data: userEmployeProps;
        }>(`${baseAPI.dev}/user/data/employe`, formData);
      } else {
        response = await axios.post<{
          code: number;
          status: string;
          message: string;
          data: userEmployeProps;
        }>(`${baseAPI.dev}/user/data/employe`, formData);
      }

      if (response.data.code === 201 || response.data.code === 200) {
        setModalAlert(true);
        setModalAlertData({
          title: "Berhasil",
          description: response.data.message,
          status: "success",
        });
      }
    } catch (error) {
      setModalAlert(true);
      setModalAlertData({
        title: "Gagal",
        description: "Data gagal disimpan",
        status: "error",
      });
    }
  };

  const handleUserSelect = (user: userProp) => {
    form.setValue("user_id", user.id);
    setSelectedUser(user);
    setIsModalOpen(false);
  };

  const handleUserRemove = () => {
    setSelectedUser(null);
  };

  console.log(form.getValues());

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {id ? "Edit SK" : "Tambah SK"}
          </h1>
          <Button asChild>
            <Link to="/admin/user/list">Kembali</Link>
          </Button>
        </div>

        {!isLoading ? (
          <div className="mt-10">
            <div className="py-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Pilih user sebagai Supervisor
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Kosongi jika user tidak Memiliki Supervisor
                </p>
                {selectedUser ? (
                  <SelectedUserDisplay
                    user={selectedUser}
                    onRemove={handleUserRemove}
                  />
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Select User
                  </Button>
                )}
              </div>

              <UserSelectionModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectUser={handleUserSelect}
              />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Posisi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status surat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Tidak Aktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gaji</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukan nominal gaji"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Simpan</Button>
              </form>
            </Form>
          </div>
        ) : null}

        <NotificationDialog
          isOpen={modalAlert}
          onClose={() => {
            setModalAlert(false);
            resetSate();
          }}
          message={modalAlertData.description}
          title={modalAlertData.title}
          type={modalAlertData.status}
        />
      </div>
    </AdminLayout>
  );
};

export default EmployeFormPage;
