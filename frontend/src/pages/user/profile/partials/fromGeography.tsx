import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { baseAPI } from "@/api";
import { userGeographyProps } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  country: z.string(),
  province: z.string(),
  city: z.string(),
  subdistrict: z.string(),
  postal_code: z.string(),
  address: z.string(),
});

const FormGeography: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "Indonesia",
      province: "Jawa Timur",
      city: "Malang",
      subdistrict: "",
      postal_code: "",
      address: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProfileId = async () => {
      if (!id) return null;

      try {
        setIsLoading(true);
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userGeographyProps[] | null;
        }>(`${baseAPI.dev}/user/geography/${id}`);

        if (response.data.code === 200) {
          const data = response.data.data;
          if (data) {
            setIsAvailable(true);
            form.setValue("country", data[0].country);
            form.setValue("province", data[0].province);
            form.setValue("city", data[0].city);
            form.setValue("subdistrict", data[0].subdistrict);
            form.setValue("postal_code", data[0].postal_code);
            form.setValue("address", data[0].address);
          }
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchProfileId();
    }
  }, [id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // return console.log(data);

    try {
      setIsLoading(true);

      let response;
      if (isAvailable) {
        response = await axios.put(`${baseAPI.dev}/user/geography`, {
          user_id: id,
          address: data.address,
          subdistrict: data.subdistrict,
          city: data.city,
          province: data.province,
          country: data.country,
          postal_code: data.postal_code,
        });
      } else {
        response = await axios.post<{
          code: number;
          status: string;
          message: string;
        }>(`${baseAPI.dev}/user/geography`, {
          user_id: id,
          address: data.address,
          subdistrict: data.subdistrict,
          city: data.city,
          province: data.province,
          country: data.country,
          postal_code: data.postal_code,
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
      <h1 className="my-7 font-semibold text-xl">Informasi Geografi</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              <Skeleton className="h-10" />
            ) : (
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Negara</FormLabel>
                    <FormControl>
                      <Input placeholder="Indonesia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama belakang</FormLabel>
                  <FormControl>
                    <Input placeholder="Jawa Timur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota/Kabupaten</FormLabel>
                  <FormControl>
                    <Input placeholder="Malang" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subdistrict"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kecamatan kamu tinggal sekarang"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kodepos</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kodepos kamu"
                      type="number"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat/Patokan rumah</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Jl. Kenangan No. 1"
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
  );
};

export default FormGeography;