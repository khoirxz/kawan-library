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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/layouts/admin";

import { baseAPI } from "@/api";

const formSchema = z.object({
  username: z.string().min(2).max(20),
  password: z.string().max(20).optional(),
  role: z.enum(["user", "admin"]),
  verified: z.boolean().default(false),
});

const UserFormPage: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "user",
      verified: false,
    },
  });
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: [
            {
              id: string;
              role: "user" | "admin";
              username: string;
              verified: boolean;
            }
          ];
        }>(`${baseAPI.dev}/users/${id}`);

        form.setValue("username", response.data.data[0].username);
        form.setValue("role", response.data.data[0].role);
        form.setValue("verified", response.data.data[0].verified);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      getUserById();
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
          data: {
            id: string;
            username: string;
            password: string;
            role: string;
            verified: boolean;
            updatedAt: string;
            createdAt: string;
          };
        }>(`${baseAPI.dev}/users`, data);
      } else {
        response = await axios.put<{
          code: number;
          status: string;
          message: string;
          data: {
            id: string;
            username: string;
            password: string;
            role: string;
            verified: boolean;
            updatedAt: string;
            createdAt: string;
          };
        }>(`${baseAPI.dev}/users/${id}`, data);
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
            {id ? "Edit User" : "Tambah User"}
          </h1>
          <Button asChild>
            <Link to="/admin/user/list">Kembali</Link>
          </Button>
        </div>

        <div className="mt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="verified"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <FormLabel>Verifikasi</FormLabel>

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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
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

export default UserFormPage;
