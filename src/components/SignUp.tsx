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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import axios from "@/services/axios";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "./ui/form";
import { LoadingButton } from "./ui/loading-button";

const REGISTER_URL = "/register";

const SignUpForm = () => {
  const FormSchema = z.object({
    firstName: z
      .string()
      .min(3, {
        message: "First name must be at least 3 characters",
      })
      .max(15, {
        message: "First name must be at most 15 characters",
      }),
    lastName: z
      .string()
      .min(3, {
        message: "Last name must be at least 3 characters",
      })
      .max(15, {
        message: "Last name must be at most 15 characters",
      }),
    email: z.string().email({ message: "Invalid email address" }).min(1, {
      message: "Email is required",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();

  const signup = async (data: z.infer<typeof FormSchema>) => {
    if (
      !data.email ||
      data.email.trim() === "" ||
      !data.password ||
      data.password.trim() === "" ||
      !data.firstName ||
      data.firstName.trim() === "" ||
      !data.lastName ||
      data.lastName.trim() === ""
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        REGISTER_URL,
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
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
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(signup)}
            className="flex flex-col gap-3"
          >
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
                  Create An Account
                </Button>
              ) : (
                <LoadingButton
                  asChild
                  loading
                  disabled={true}
                  className="w-full"
                >
                  <p>Create An Account</p>
                </LoadingButton>
              )}
              {!isLoading ? (
                <Button variant="outline" className="w-full">
                  Signup with Google
                </Button>
              ) : (
                <LoadingButton
                  asChild
                  loading
                  variant="outline"
                  className="w-full"
                >
                  <p>Signup with Google</p>
                </LoadingButton>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default SignUpForm;
