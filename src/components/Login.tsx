import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "@/services/axios";
import useToggle from "@/hooks/useToggle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { LoadingButton } from "./ui/loading-button";

const LOGIN_URL = "/auth";

const LoginForm = () => {
  const FormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).min(1, {
      message: "Email is required",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must be at most 20 characters" }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [check, toggleCheck] = useToggle("persist", false);
  const { setAuth } = useAuth();

  const login = async (data: z.infer<typeof FormSchema>) => {
    if (!data.email || data.email.trim() === "" || !data.password) {
      return;
    }

    setIsLoading(true);
    setErrMsg("");

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email: data.email, password: data.password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      setAuth({ email: data.email, accessToken });
      navigate(from, { replace: true });
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      // errRef.current?.focus();
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center align-center">
      <p
        className={
          errMsg
            ? "block p-3 w-full flex justify-center font-semibold text-sm text-red-500 bg-red-100"
            : "hidden"
        }
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(login)}
          className="flex flex-col gap-3"
        >
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!isLoading ? (
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                ) : (
                  <LoadingButton
                    asChild
                    loading
                    disabled={true}
                    className="w-full"
                  >
                    <p>Login</p>
                  </LoadingButton>
                )}
                {!isLoading ? (
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                ) : (
                  <LoadingButton
                    asChild
                    loading
                    variant="outline"
                    className="w-full"
                  >
                    <p>Login with Google</p>
                  </LoadingButton>
                )}
                <div className="flex gap-1 w-full justify-center">
                  <Label htmlFor="persist">Trust this device</Label>{" "}
                  <Input
                    id="persist"
                    type="checkbox"
                    onChange={toggleCheck}
                    checked={check}
                    className="w-4 h-4"
                  />
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};
export default LoginForm;
