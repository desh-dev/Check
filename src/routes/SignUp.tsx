import { Link, useNavigate } from "react-router-dom";

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
// import useAuth from "@/hooks/useAuth";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../components/ui/form";
import { LoadingButton } from "../components/ui/loading-button";
import supabase from "@/config/supabaseClient";
import ErrorMessage from "@/components/ErrorMessage";

// const REGISTER_URL = "/register";

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

  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async (formData: z.infer<typeof FormSchema>) => {
    if (
      !formData.email ||
      formData.email.trim() === "" ||
      !formData.password ||
      formData.password.trim() === "" ||
      !formData.firstName ||
      formData.firstName.trim() === "" ||
      !formData.lastName ||
      formData.lastName.trim() === ""
    ) {
      return;
    }

    setIsLoading(true);
    setErrMsg("");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      },
    });
    console.log(data);
    if (error) {
      setIsLoading(false);
      error.message
        ? setErrMsg(error.message)
        : setErrMsg("Something went wrong");
      return;
    }
    setIsLoading(false);
    navigate("/signup/confirm-email");
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-center align-center"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(signup)}
          className="flex flex-col gap-3"
        >
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </form>
        {errMsg && <ErrorMessage message={errMsg} />}
      </Form>
    </div>
  );
};
export default SignUpForm;
