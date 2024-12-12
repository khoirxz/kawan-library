import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NotificationDialog } from "@/components/notification-dialog";

import { Context } from "@/context";
import { baseAPI } from "@/api";
import { userJobHistoryProps } from "@/types/user";
import { responseProps } from "@/types/response";
import UserSettingLayout from "../..";

const formSchema = z.object({
  company_name: z.string(),
  position: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  job_description: z.string(),
  location: z.string(),
  is_current: z.boolean().default(false),
});

const UserSettingWorkFormPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      position: "",
      start_date: "",
      end_date: "",
      job_description: "",
      location: "",
      is_current: false,
    },
  });
  const { id, itemId } = useParams<{ id: string; itemId: string }>();
  const {
    modalAlert,
    setModalAlert,
    setModalAlertData,
    modalAlertData,
    resetSate,
  } = useContext(Context);

  useEffect(() => {
    const fetchJobHistory = async () => {
      if (!itemId) return null;

      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userJobHistoryProps[] | null;
        }>(`${baseAPI.dev}/user/job/history/id/${itemId}`);

        if (response.data.code === 200) {
          const data = response.data.data;
          if (data) {
            form.setValue("company_name", data[0].company_name);
            form.setValue("position", data[0].position);
            form.setValue(
              "start_date",
              new Date(data[0].start_date).toISOString().split("T")[0]
            );
            form.setValue(
              "end_date",
              new Date(data[0].end_date).toISOString().split("T")[0]
            );
            form.setValue("job_description", data[0].job_description);
            form.setValue("location", data[0].location);
            form.setValue("is_current", data[0].is_current);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobHistory();
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // return console.log(data);

    let response;
    try {
      if (itemId) {
        response = await axios.put<responseProps>(
          `${baseAPI.dev}/user/job/history/${itemId}`,
          {
            ...data,
            start_date: new Date(data.start_date).toISOString(),
            end_date: new Date(data.end_date).toISOString(),
            user_id: id,
          }
        );
      } else {
        response = await axios.post<
          responseProps & { data: userJobHistoryProps }
        >(`${baseAPI.dev}/user/job/history`, {
          ...data,
          start_date: new Date(data.start_date).toISOString(),
          end_date: new Date(data.end_date).toISOString(),
          user_id: id,
        });
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

  return (
    <UserSettingLayout>
      <div className="mb-5">
        <h1 className="text-lg">Tambah Riwayat Kerja</h1>
        <p className="text-sm text-gray-500">Lengkapi form dibawah ini</p>
      </div>

      {isLoading && itemId ? (
        <p>Loading</p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-7 space-y-4">
            <FormField
              control={form.control}
              name="is_current"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <FormLabel>Aktif</FormLabel>

                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Perusahaan</FormLabel>
                    <FormControl>
                      <Input placeholder="Perusahaan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posisi</FormLabel>
                    <FormControl>
                      <Input placeholder="Kepala Divisi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukan nama kota saja" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Masuk</FormLabel>
                    <FormControl>
                      <Input
                        className="inline-block"
                        placeholder="Tanggal Masuk"
                        type="date"
                        id="start_date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Keluar</FormLabel>
                    <FormControl>
                      <Input
                        className="inline-block"
                        placeholder="Tanggal Keluar"
                        type="date"
                        id="end_date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="job_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Deskripsikan tentang pekerjaan kamu"
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
      )}

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
    </UserSettingLayout>
  );
};

export default UserSettingWorkFormPage;
