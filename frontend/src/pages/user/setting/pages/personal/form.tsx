import { useEffect, useState, useRef, useContext } from "react";
import axios, { AxiosError } from "axios";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDialog } from "@/components/notification-dialog";
import { Pencil } from "lucide-react";

import { Context } from "@/context";
import { baseAPI } from "@/api";
import { userDataProps } from "@/types/user";
import UserSettingLayout from "../..";

const formSchema = z.object({
  nik: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  dateBirth: z.string(),
  gender: z.enum(["male", "female", "0"]),
  religion: z.enum(["islam", "kristen", "katolik", "hindu", "budha", "0"]),
  maritalStatus: z.enum(["single", "married", "widow", "0"]),
});

const UserSettingPersoalFormPage: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nik: "",
      first_name: "",
      last_name: "",
      dateBirth: "",
      gender: "0",
      religion: "0",
      maritalStatus: "0",
    },
  });
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();
  const ref = useRef<HTMLInputElement>(null);
  const {
    modalAlert,
    setModalAlert,
    setModalAlertData,
    modalAlertData,
    resetStateModal,
  } = useContext(Context);

  useEffect(() => {
    const fetchUserPersonalById = async () => {
      if (!id) return null;

      try {
        setIsLoading(true);
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userDataProps[] | null;
        }>(`${baseAPI.dev}/user/data/${id}`);
        const avatar = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: [
            {
              avatarImg: string | null;
            }
          ];
        }>(`${baseAPI.dev}/users/avatar/${id}`);

        setAvatarUrl(avatar.data.data[0].avatarImg);

        if (response.data.code === 200) {
          const data = response.data.data;
          if (data) {
            setIsAvailable(true);
            form.setValue("nik", data[0].nik);
            form.setValue("first_name", data[0].firstName);
            form.setValue("last_name", data[0].lastName);
            form.setValue(
              "dateBirth",
              new Date(data[0].dateBirth).toISOString().split("T")[0]
            );
            form.setValue("gender", data[0]?.gender);
            form.setValue("religion", data[0]?.religion);
            form.setValue("maritalStatus", data[0]?.maritalStatus);
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserPersonalById();
    }
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const dataForm = {
      user_id: id,
      nik: data.nik,
      first_name: data.first_name,
      last_name: data.last_name,
      dateBirth: new Date(data.dateBirth).toISOString(),
      gender: data.gender,
      religion: data.religion,
      maritalStatus: data.maritalStatus,
    };

    try {
      setIsLoading(true);

      let response;
      if (isAvailable) {
        response = await axios.put(`${baseAPI.dev}/user/data`, dataForm);
      } else {
        response = await axios.post<{
          code: number;
          status: string;
          message: string;
        }>(`${baseAPI.dev}/user/data`, dataForm);
      }

      setModalAlert(true);
      setModalAlertData({
        title: "Berhasil",
        description: response.data.message,
        status: "success",
      });
    } catch (error) {
      const errorResponse = error as AxiosError;
      setModalAlert(true);
      setModalAlertData({
        title: "Gagal",
        description: errorResponse.message,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        setIsLoading(true);
        const response = await axios.post(
          `${baseAPI.dev}/users/avatar/${id}`,
          formData
        );

        if (response.data.code === 200) {
          // reload browser
          window.location.reload();
        }
      } catch (error) {
        const errorResponse = error as AxiosError;

        setModalAlert(true);
        setModalAlertData({
          title: "Gagal",
          description: errorResponse.message,
          status: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <UserSettingLayout>
      <div className="mb-5">
        <h1 className="text-lg">Form Personal</h1>
        <p className="text-sm text-gray-500">Lengkapi form dibawah ini</p>
      </div>

      <div className="my-5 w-24 h-24 relative">
        <label
          htmlFor="avatarImg"
          onClick={() => ref.current?.click()}
          className="cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-transparent transition-all hover:text-white hover:bg-black/50 rounded-full p-4 flex items-center justify-center">
          <Pencil />
        </label>

        <Avatar className="w-24 h-24">
          {avatarUrl !== null ? (
            <AvatarImage
              className="object-cover"
              src={`${baseAPI.dev}/uploads/avatars/${avatarUrl}`}
              alt="profile"
            />
          ) : null}
          <AvatarFallback>?</AvatarFallback>
        </Avatar>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={ref}
          name="avatarImg"
          onChange={changeAvatar}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Induk Kependudukan (NIK)</FormLabel>
                    <FormControl>
                      <Input placeholder="NIK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama depan</FormLabel>
                    <FormControl>
                      <Input placeholder="Admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama belakang</FormLabel>
                    <FormControl>
                      <Input placeholder="Ganteng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {isLoading ? (
                <Skeleton />
              ) : (
                <FormField
                  control={form.control}
                  name="dateBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Lahir</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tanggal Lahir"
                          type="date"
                          id="dateBirth"
                          className="inline-block"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agama</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih agama" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Pilih agama</SelectItem>
                        <SelectItem value="islam">Islam</SelectItem>
                        <SelectItem value="kristen">Kristen</SelectItem>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="budha">Budha</SelectItem>
                        <SelectItem value="konghucu">Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Pilih gender</SelectItem>
                        <SelectItem value="male">Laki-Laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status menikah</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Pilih status</SelectItem>
                        <SelectItem value="single">Belum menikah</SelectItem>
                        <SelectItem value="married">Menikah</SelectItem>
                        <SelectItem value="widow">Duda/Janda</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Simpan</Button>
          </form>
        </Form>
      )}

      <NotificationDialog
        isOpen={modalAlert}
        onClose={() => {
          setModalAlert(false);
          resetStateModal();
        }}
        message={modalAlertData.description}
        title={modalAlertData.title}
        type={modalAlertData.status}
      />
    </UserSettingLayout>
  );
};

export default UserSettingPersoalFormPage;
