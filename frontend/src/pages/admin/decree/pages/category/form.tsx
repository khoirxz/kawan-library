import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/layouts/admin";

import { baseAPI } from "@/api";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
});

type decreeCategoriesProps = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const DecreeCategoryFormPage: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getDecreeCategoriesById = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: decreeCategoriesProps;
        }>(`${baseAPI.dev}/decree/category/${id}`);

        form.setValue("name", response.data.data.name);
        form.setValue("description", response.data.data.description);
      } catch (error) {
        console.log(error);
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
          data: decreeCategoriesProps;
        }>(`${baseAPI.dev}/decree/category`, data);
      } else {
        response = await axios.put<{
          code: number;
          status: string;
          message: string;
          data: [number];
        }>(`${baseAPI.dev}/decree/category/${id}`, data);
      }

      console.log(response);
    } catch (error) {
      console.log(error);
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
                name="name"
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
                      <Input
                        placeholder="Jelaskan deskripsi kategori"
                        {...field}
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
      </div>
    </AdminLayout>
  );
};

export default DecreeCategoryFormPage;
