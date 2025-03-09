"use client";
import { EyeOff, Eye, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { onlyRegister } from "@/app/actions/auth.actions";
import { toast } from "@/hooks/use-toast";
import { SignInValues } from "@/lib/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Register = ({ role }: { role?: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignInValues>({
    defaultValues: {
      username: "",
      password: "",
      role: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    setIsLoading(true); 
    const res = await onlyRegister(values);
    if (res.error) {
      setIsLoading(false); 
      toast({
        variant: "destructive",
        title: res.error,
      });
    } else {
      setIsLoading(false); 
      router.push("/dashboard/penyaluran-elpiji");
      toast({
        title: "Register has been succesfully",
      });
    }
  }

  if (role != "ADMIN") {
    toast({
      variant: "destructive",
      title: "Hanya admin yang bisa akses",
    });
    redirect("/dashboard/penyaluran-elpiji");
  }

  return (
    <div className="flex w-full h-auto">
      <Card className="p-6 m-6 justify-center items-center w-full">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="max-w-lg">
                        <Input
                          placeholder="Enter your username..."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative max-w-lg">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password..."
                          {...field}
                        />
                        {/* Eye Icon Button */}
                        <button
                          type="button"
                          className="absolute inset-y-0 right-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="self-start">
                {isLoading && (
                  <Loader className="mr-2 h-4 w-4 px-3 animate-spin" />
                )}
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
