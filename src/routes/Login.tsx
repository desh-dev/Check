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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { LoadingButton } from "../components/ui/loading-button";
import supabase from "@/config/supabaseClient";
import ErrorMessage from "@/components/ErrorMessage";
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

  const login = async (formData: z.infer<typeof FormSchema>) => {
    if (!formData.email || formData.email.trim() === "" || !formData.password) {
      return;
    }

    setIsLoading(true);
    setErrMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      if (error.message === "Email not confirmed") {
        const { error: resendError } = await supabase.auth.resend({
          type: "signup",
          email: formData.email,
          options: {
            emailRedirectTo: "localhost:3000",
          },
        });
        if (resendError) {
          throw resendError;
        }
        navigate("/signup/confirm-email");
        return;
      }
      setErrMsg(error.message);
      setIsLoading(false);
      console.log(error);
      return;
    }

    setIsLoading(false);
    navigate(from, { replace: true });
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-1 justify-center align-center"
      style={{ height: "100vh", width: "100vw" }}
    >
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
        {errMsg && <ErrorMessage message={errMsg} />}
      </Form>
    </div>
  );
};
export default LoginForm;
