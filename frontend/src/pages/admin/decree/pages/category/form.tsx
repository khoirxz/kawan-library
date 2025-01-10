import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NotificationDialog } from "@/components/notification-dialog";

import { Context } from "@/context";
import { AdminLayout } from "@/layouts/admin";
import { baseAPI } from "@/api";
import { decreeCategoryListProps } from "@/types/decree";

const formSchema = z.object({
  title: z.string(),
  description: z.string().max(50).min(2),
  isPublic: z.boolean(),
});

/**
 * Halaman untuk menambah atau mengedit kategori SK
 *
 * Halaman ini akan menampilkan form untuk menginputkan data kategori SK
 * dan akan menampilkan notifikasi apabila data berhasil disimpan atau gagal
 * disimpan
 *
 * @returns {React.ReactElement}
 */
const DecreeCategoryFormPage: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
    },
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    modalAlert,
    setModalAlert,
    setModalAlertData,
    modalAlertData,
    resetStateModal,
  } = useContext(Context);

  useEffect(() => {
    const getDecreeCategoriesById = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: decreeCategoryListProps;
        }>(`${baseAPI.dev}/decree/category/${id}`);

        form.setValue("title", response.data.data.title);
        form.setValue("description", response.data.data.description);
        form.setValue("isPublic", response.data.data.isPublic);
      } catch (error) {
        console.log(error);
        setModalAlert(true);
        setModalAlertData({
          title: "Gagal",
          description: "Gagal mengambil data",
          status: "error",
        });
      }
    };

    if (id) {
      getDecreeCategoriesById();
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      let response;
      if (!id) {
        response = await axios.post<{
          code: number;
          status: string;
          message: string;
          data: decreeCategoryListProps;
        }>(`${baseAPI.dev}/decree/category`, data);
      } else {
        response = await axios.put<{
          code: number;
          status: string;
          message: string;
          data: [number];
        }>(`${baseAPI.dev}/decree/category/${id}`, data);
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

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {id ? "Edit Kategori SK" : "Tambah Kategori SK"}
          </h1>
          <Button asChild>
            <Link to="/admin/decree/category/list">Kembali</Link>
          </Button>
        </div>

        <div className="mt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <FormLabel>Tersedia untuk publik ?</FormLabel>

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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Masukan Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Jelaskan deskripsi kategori"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Maksimal 50 karakter
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Simpan</Button>
            </form>
          </Form>
        </div>

        <NotificationDialog
          isOpen={modalAlert}
          onClose={() => {
            setModalAlert(false);
            resetStateModal();
            navigate("/admin/decree/category/list", { replace: true });
          }}
          message={modalAlertData.description}
          title={modalAlertData.title}
          type={modalAlertData.status}
        />
      </div>
    </AdminLayout>
  );
};

export default DecreeCategoryFormPage;
