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
import { Skeleton } from "@/components/ui/skeleton";

import { baseAPI } from "@/api";
import { userDataProps } from "@/types/user";

const formSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  dateBirth: z.string(),
  gender: z.enum(["male", "female", "0"]),
  religion: z.enum(["islam", "kristen", "katolik", "hindu", "budha", "0"]),
  maritalStatus: z.enum(["single", "married", "widow", "0"]),
});

const FormPersonal: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      dateBirth: "",
      gender: "0",
      religion: "0",
      maritalStatus: "0",
    },
  });
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

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

        if (response.data.code === 200) {
          const data = response.data.data;
          if (data) {
            setIsAvailable(true);
            form.setValue("first_name", data[0].firstName);
            form.setValue("last_name", data[0].lastName);
            form.setValue(
              "dateBirth",
              new Date(data[0].dateBirth).toISOString().split("T")[0]
            );
            form.setValue("gender", data[0].gender);
            form.setValue("religion", data[0].religion);
            form.setValue("maritalStatus", data[0].maritalStatus);
          }
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchUserPersonalById();
    }
  }, [id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // return console.log(data);

    try {
      setIsLoading(true);

      let response;
      if (isAvailable) {
        response = await axios.put(`${baseAPI.dev}/user/data`, {
          user_id: id,
          first_name: data.first_name,
          last_name: data.last_name,
          dateBirth: new Date(data.dateBirth).toISOString(),
          gender: data.gender,
          religion: data.religion,
          maritalStatus: data.maritalStatus,
        });
      } else {
        response = await axios.post<{
          code: number;
          status: string;
          message: string;
        }>(`${baseAPI.dev}/user/data`, {
          user_id: id,
          first_name: data.first_name,
          last_name: data.last_name,
          dateBirth: new Date(data.dateBirth).toISOString(),
          gender: data.gender,
          religion: data.religion,
          maritalStatus: data.maritalStatus,
        });
      }

      console.log(response);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="my-7">
        <h1 className="font-semibold text-xl">Informasi Personal</h1>
        <p className="text-gray-500 text-sm">
          Anda sudah melengkapi informasi personal
        </p>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {id ? (
                !isLoading ? (
                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agama</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? field.value : "0"}>
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
                ) : null
              ) : (
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
              )}
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
    </>
  );
};

export default FormPersonal;
