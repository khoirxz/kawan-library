import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TriangleAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import Login from "@/pages/auth/partials/Login";
import SignUp from "@/pages/auth/partials/SignUp";

import { useAppSelector } from "@/app/store";
import useAuth from "@/pages/auth/partials/hook/useAuth";

const AuthPage: React.FC = () => {
  const {
    main: { message, isError },
  } = useAppSelector((state) => state.authState);
  const { isLoading } = useAuth();

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-blue-100/30">
      {isError ? (
        <div className="absolute z-10 top-10 max-w-screen-sm px-3">
          <Alert
            variant={isError ? "destructive" : "default"}
            className="bg-white">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Peringatan</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </div>
      ) : null}
      {!isLoading ? (
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <SignUp />
          </TabsContent>
        </Tabs>
      ) : (
        <Progress value={100} className="max-w-screen-sm" />
      )}
    </div>
  );
};

export default AuthPage;
