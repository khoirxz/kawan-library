import { useState } from "react";
import { Box, Flex, Stack, Text, Input, Tabs } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { ColorModeButton } from "@/components/ui/color-mode";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

type formLoginProps = {
  username: string;
  password: string;
};

type formRegisterProps = {
  username: string;
  password: string;
  confirmPassword: string;
};

const LoginPage: React.FC = () => {
  return (
    <Box fontFamily="Outfit">
      <Flex justifyContent="flex-end" position="absolute" right={"7"} top={"7"}>
        <ColorModeButton />
      </Flex>

      <Stack maxW={"md"} mx="auto" pt={"36"} width="full">
        <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"tab-1"}>
          <Tabs.List>
            <Tabs.Trigger value="tab-1">Login</Tabs.Trigger>
            <Tabs.Trigger value="tab-2">Register</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab-1">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="tab-2">
            <Register />
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </Box>
  );
};

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState<formLoginProps>({} as formLoginProps);

  console.log(data);
  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((data) =>
        setData({ username: data.username, password: data.password })
      )}>
      <Text textStyle="3xl" mb={6}>
        Login
      </Text>
      <Stack gap={4}>
        <Field label="Username" required>
          <Input {...register("username")} type="text" placeholder="Username" />
        </Field>
        <Field label="Password" required>
          <PasswordInput {...register("password")} placeholder="Password" />
        </Field>

        <Button type="submit">Login</Button>
      </Stack>
    </Stack>
  );
};

const Register = () => {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState<formRegisterProps>({} as formRegisterProps);

  console.log(data);
  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((data) =>
        setData({
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword,
        })
      )}>
      <Text textStyle="3xl" mb={6}>
        Register
      </Text>
      <Stack gap={4}>
        <Field label="Username" required>
          <Input {...register("username")} type="text" placeholder="Username" />
        </Field>
        <Field label="Password" required>
          <PasswordInput {...register("password")} placeholder="Password" />
        </Field>
        <Field label="Konfirmasi Password" required>
          <PasswordInput
            {...register("confirmPassword")}
            placeholder="Masukan Password lagi"
          />
        </Field>

        <Button type="submit">Register</Button>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
