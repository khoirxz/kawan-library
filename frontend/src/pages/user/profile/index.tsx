import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BriefcaseBusiness,
  Contact,
  FileText,
  MapPin,
  Trophy,
  User,
} from "lucide-react";

import FormPersonal from "./partials/formPersonal";
import FormGeography from "./partials/fromGeography";
import FormContact from "./partials/formContact";
import FormEmployee from "./partials/formEmployee";
import TableCertificate from "./partials/tableCertificate";
import TableDecree from "./partials/tableDecree";

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              alt="User's profile picture"
              src="/placeholder.svg?height=80&width=80"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>@johndoe</CardDescription>
          </div>
          <Button className="ml-auto">Edit Profile</Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="flex gap-4 justify-normal overflow-x-auto h-full scrollbar">
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="location">
                <MapPin className="h-4 w-4 mr-2" />
                Lokasi
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Contact className="h-4 w-4 mr-2" />
                Kontak
              </TabsTrigger>
              <TabsTrigger value="employe">
                <BriefcaseBusiness className="h-4 w-4 mr-2" />
                Pegawai
              </TabsTrigger>
              <TabsTrigger value="certificate">
                <Trophy className="h-4 w-4 mr-2" />
                Sertifikat
              </TabsTrigger>
              <TabsTrigger value="decree">
                <FileText className="h-4 w-4 mr-2" />
                SK
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <FormPersonal />
            </TabsContent>
            <TabsContent value="location">
              <FormGeography />
            </TabsContent>
            <TabsContent value="contact">
              <FormContact />
            </TabsContent>
            <TabsContent value="employe">
              <FormEmployee />
            </TabsContent>
            <TabsContent value="certificate">
              <TableCertificate />
            </TabsContent>
            <TabsContent value="decree">
              <TableDecree />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
