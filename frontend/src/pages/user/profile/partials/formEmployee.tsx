import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";

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
import { Button } from "@/components/ui/button";
import { UserSelectionModal } from "@/components/user-selection-modal";
import { SelectedUserDisplay } from "@/components/selected-user-display";
import { User } from "lucide-react";

import { baseAPI } from "@/api";
import { userEmployeProps, userProp } from "@/types/user";
import { useProfile } from "./profileHook";

const formSchema = z.object({
  supervisor_id: z.string().nullable(),
  position: z.string(),
  status: z.enum(["active", "inactive", "0"]),
  salary: z.number(),
});

const FormEmployee: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supervisor_id: "",
      position: "",
      status: "0",
      salary: 0,
    },
  });
  const [selectedUser, setSelectedUser] = useState<userProp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const { users } = useProfile();

  useEffect(() => {
    const fetchUserEmployeeById = async () => {
      if (!id) return null;

      try {
        setIsLoading(true);
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userEmployeProps[] | null;
        }>(`${baseAPI.dev}/user/data/employe/${id}`);

        if (response.data.code === 200) {
          const data = response.data.data;
          if (data) {
            setIsAvailable(true);
            if (data[0].supervisor_info) {
              form.setValue("supervisor_id", data[0].supervisor_info.id);
              setSelectedUser({
                id: data[0].supervisor_info.id,
                role: data[0].supervisor_info.role,
                username: data[0].supervisor_info.username,
                avatarImg: data[0].supervisor_info.avatarImg,
                verified: data[0].supervisor_info.verified,
              });
            }
            form.setValue("position", data[0].position);
            form.setValue("status", data[0].status);
            form.setValue("salary", data[0].salary);
          }
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchUserEmployeeById();
    }
  }, [id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // return console.log(data);

    try {
      setIsLoading(true);

      let response;
      if (isAvailable) {
        response = await axios.put(`${baseAPI.dev}/user/data/employe`, {
          user_id: id,
          supervisor_id: data.supervisor_id,
          position: data.position,
          status: data.status,
          salary: data.salary,
        });
      } else {
        response = await axios.post<{
          code: number;
          status: string;
          message: string;
        }>(`${baseAPI.dev}/user/data/employe`, {
          user_id: id,
          supervisor_id: data.supervisor_id,
          position: data.position,
          status: data.status,
          salary: data.salary,
        });
      }

      console.log(response);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserSelect = (user: userProp) => {
    form.setValue("supervisor_id", user.id);
    setSelectedUser(user);
    setIsModalOpen(false);
  };

  const handleUserRemove = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <h1 className="my-7 font-semibold text-xl">Informasi Pegawai</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="my-7">
            <div>
              <h3 className="text-lg font-semibold">Pilih user</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Kosongi jika SK tidak berkaitan dengan user
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posisi/Jabatan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Posisi/Jawbatan kamu saat ini"
                          {...field}
                        />
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
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ? field.value : "0"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status kerja saat ini" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Pilih status</SelectItem>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Tidak aktif</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gaji</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nominal Gaji"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Simpan</Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
};

export default FormEmployee;
