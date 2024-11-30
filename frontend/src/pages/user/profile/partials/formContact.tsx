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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { baseAPI } from "@/api";
import { userContactProps } from "@/types/user";

const formSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  emergency_contact: z.string(),
  instagram: z.string(),
  facebook: z.string(),
});

const FormContact: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
      emergency_contact: "",
      instagram: "",
      facebook: "",
    },
  });
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUserContactId = async () => {
      if (!id) return null;

      try {
        setIsLoading(true);
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userContactProps[] | null;
        }>(`${baseAPI.dev}/user/contact/${id}`);

        if (response.data.code === 200) {
          const data = response.data.data;
          if (data) {
            setIsAvailable(true);
            form.setValue("email", data[0].email);
            form.setValue("phone", data[0].phone);
            form.setValue("emergency_contact", data[0].emergency_contact);
            form.setValue("facebook", data[0].facebook);
            form.setValue("instagram", data[0].instagram);
          }
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchUserContactId();
    }
  }, [id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // return console.log(data);

    try {
      setIsLoading(true);

      let response;
      if (isAvailable) {
        response = await axios.put(`${baseAPI.dev}/user/contact/`, {
          user_id: id,
          email: data.email,
          phone: data.phone,
          emergency_contact: data.emergency_contact,
          instagram: data.instagram,
          facebook: data.facebook,
        });
      } else {
        response = await axios.post<{
          code: number;
          status: string;
          message: string;
        }>(`${baseAPI.dev}/user/contact/`, {
          user_id: id,
          email: data.email,
          phone: data.phone,
          emergency_contact: data.emergency_contact,
          instagram: data.instagram,
          facebook: data.facebook,
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
      <h1 className="my-7 font-semibold text-xl">Informasi Kontak</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-7 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="useremail@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergency_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor kontak darurat</FormLabel>
                    <FormControl>
                      <Input placeholder="08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.facebook.com/username"
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
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.instagram.com/username"
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
    </>
  );
};

export default FormContact;