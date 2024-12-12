import { useEffect, useState, useContext } from "react";
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, User } from "lucide-react";
import { SelectedUserDisplay } from "@/components/selected-user-display";
import { Label } from "@/components/ui/label";
import { UserSelectionModal } from "@/components/user-selection-modal";

import { Context } from "@/context";
import { AdminLayout } from "@/layouts/admin";
import { baseAPI } from "@/api";
import useCertificate from "./certificateHook";
import { userProp } from "@/types/user";
import { certificationListProps } from "@/types/certificate";
import { NotificationDialog } from "@/components/notification-dialog";

const formSchema = z.object({
  user_id: z.string().optional().nullable(),
  title: z.string().min(2, { message: "Title minimal 2 karakter" }),
  description: z.string().min(2, { message: "Description minimal 2 karakter" }),
  date: z.date(),
});

const CertificateFormPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<userProp | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: null,
      title: "",
      description: "",
      date: new Date(Date.now()),
    },
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users } = useCertificate();
  const {
    modalAlert,
    setModalAlert,
    setModalAlertData,
    modalAlertData,
    resetSate,
  } = useContext(Context);

  useEffect(() => {
    const getCertificateById = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          data: certificationListProps;
        }>(`${baseAPI.dev}/certifications/${id}`);

        setBlobUrl(
          `${baseAPI.dev}/uploads/certificates/${response.data.data.file_path}`
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
        form.setValue("date", new Date(response.data.data.date));
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
      getCertificateById();
    }
  }, [id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // console.log(data);
    try {
      const formData = new FormData();

      if (data.user_id) {
        formData.append("user_id", data.user_id);
      }

      if (certificateFile) {
        formData.append("certificateFile", certificateFile);
      }

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("date", data.date.toString());

      let response;
      if (id) {
        response = await axios.put(
          `${baseAPI.dev}/certifications/${id}`,
          formData
        );
      } else {
        response = await axios.post(`${baseAPI.dev}/certifications`, formData);
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

  const handelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCertificateFile(e.target.files?.[0] || null);

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
            <Link to="/admin/certificate/list">Kembali</Link>
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
            <Label htmlFor="picture">File Sertifikat</Label>
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
                      <Input placeholder="Judul" {...field} />
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
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Deskripsi Tentang sertifikat"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Tanggal</FormLabel>
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

              <Button type="submit">Simpan</Button>
            </form>
          </Form>
        </div>

        <NotificationDialog
          isOpen={modalAlert}
          onClose={() => {
            setModalAlert(false);
            resetSate();
            navigate("/admin/certificate/list", { replace: true });
          }}
          message={modalAlertData.description}
          title={modalAlertData.title}
          type={modalAlertData.status}
        />
      </div>
    </AdminLayout>
  );
};

export default CertificateFormPage;
