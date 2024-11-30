import React, { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FileText, Check, ChevronsUpDown, User } from "lucide-react";
import { SelectedUserDisplay } from "@/components/selected-user-display";
import { Label } from "@/components/ui/label";
import { UserSelectionModal } from "@/components/user-selection-modal";

import { AdminLayout } from "@/layouts/admin";
import useDecree from "./decreeHook";
import { baseAPI } from "@/api";
import { userProp } from "@/types/user";

const formSchema = z.object({
  user_id: z.string().optional().nullable(),
  title: z.string().min(2, { message: "Title minimal 2 karakter" }),
  description: z.string().min(2, { message: "Description minimal 2 karakter" }),
  category: z.number(),
  status: z.enum(["approved", "canceled", "draft"]),
  effective_date: z.date(),
  expired_date: z.date(),
});

const DecreeFormPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<userProp | null>(null);
  const [decreeFile, setDecreeFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: null,
      title: "",
      description: "",
      category: 1,
      status: "draft",
      effective_date: new Date(Date.now()),
      expired_date: new Date(Date.now()),
    },
  });
  const { id } = useParams<{ id: string }>();
  const { users, categories, isLoading } = useDecree();

  useEffect(() => {
    const getDecreeById = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          data: {
            id: string;
            user: userProp | null;
            category_id: number;
            title: string;
            description: string;
            status: "approved" | "canceled" | "draft";
            effective_date: string;
            expired_date: string;
            file_path: string;
          };
        }>(`${baseAPI.dev}/decrees/${id}`);

        setBlobUrl(
          `${baseAPI.dev}/uploads/decrees/${response.data.data.file_path}`
        );
        if (response.data.data.user) {
          form.setValue("user_id", response.data.data.user.id);
          setSelectedUser({
            id: response.data.data.user.id,
            role: response.data.data.user.role,
            username: response.data.data.user.username,
            avatarImg: response.data.data.user.avatarImg,
            verified: response.data.data.user.verified,
          });
        }
        form.setValue("title", response.data.data.title);
        form.setValue("description", response.data.data.description);
        form.setValue("category", response.data.data.category_id);
        form.setValue("status", response.data.data.status);
        form.setValue(
          "effective_date",
          new Date(response.data.data.effective_date)
        );
        form.setValue(
          "expired_date",
          new Date(response.data.data.expired_date)
        );
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      getDecreeById();
    }
  }, [id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log(data);
    try {
      const formData = new FormData();

      if (data.user_id) {
        formData.append("user_id", data.user_id);
      }

      if (decreeFile) {
        formData.append("decreeFile", decreeFile);
      }

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category_id", data.category.toString());
      formData.append("status", data.status);
      formData.append("effective_date", data.effective_date.toString());
      formData.append("expired_date", data.expired_date.toString());

      if (id) {
        await axios.put(`${baseAPI.dev}/decrees/${id}`, formData);
      } else {
        await axios.post(`${baseAPI.dev}/decrees`, formData);
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setDecreeFile(e.target.files?.[0] || null);

    if (file) {
      const newBlobUrl = URL.createObjectURL(file);
      setBlobUrl(newBlobUrl);

      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
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

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {id ? "Edit SK" : "Tambah SK"}
          </h1>
          <Button asChild>
            <Link to="/admin/decree/list">Kembali</Link>
          </Button>
        </div>

        <div className="mt-10">
          <div className="py-4">
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

          <div className="mb-3">
            {blobUrl ? (
              <iframe
                src={blobUrl}
                height={"288px"}
                width={"100%"}
                className="my-3"
                title="Preview PDF"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 border-dotted border-4 rounded-md w-full h-72 justify-center">
                <FileText />
                <p className="text-sm font-light">Maksimal file 8MB PDF</p>
              </div>
            )}
          </div>

          <div className="mb-3">
            <Label htmlFor="picture">File Surat Keterangan</Label>
            <Input
              id="picture"
              type="file"
              accept="application/pdf"
              onChange={(e) => handelFileChange(e)}
            />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Judul SK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isLoading ? (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Kategori</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}>
                              {field.value
                                ? categories.find(
                                    (item) => item.value === field.value
                                  )?.label
                                : "Select language"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search framework..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {categories.map((item) => (
                                  <CommandItem
                                    value={item.label}
                                    key={item.value}
                                    onSelect={() => {
                                      form.setValue("category", item.value);
                                    }}>
                                    {item.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        item.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Deskripsi Surat keterangan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="effective_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Effective Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={``}>
                              {field.value
                                ? field.value.toLocaleDateString()
                                : "Pilih tanggal"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expired_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Expired Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={``}>
                              {field.value
                                ? field.value.toLocaleDateString()
                                : "Pilih tanggal"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

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
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
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

export default DecreeFormPage;
