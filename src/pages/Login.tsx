import { ApiException } from "@/services/apiException";
import { isAuthenticated } from "@/services/auth";
import { login } from "@/services/authService";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import z from "zod";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function Login() {
  const navigate = useNavigate();
  if (isAuthenticated()) navigate("/");

  const [isVisible, setIsVisible] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isLoading },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      const apiError = error as ApiException;
      setServerErrorMessage(apiError.message);
    }
  };

  const handleDemoLogin = () => {
    setValue("email", "test@gmail.com");
    setValue("password", "123456");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Stethoscope className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ClinicMS</h1>
          <p className="text-default-500">
            Sign in to your clinic management system
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border border-divider">
          <CardHeader className="pb-4">
            <div className="w-full text-center">
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-default-500 mt-1">
                Enter your credentials to access your dashboard
              </p>
              {serverErrorMessage && (
                <p className="text-red-400 mt-1">{serverErrorMessage}</p>
              )}
            </div>
          </CardHeader>
          {/* Error message for the sever */}
          <CardBody className="pt-0">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Input */}
              <Input
                isRequired
                className="w-full"
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email?.message}
                label="Email Address"
                placeholder="Enter your email"
                startContent={<Mail className="text-default-400" size={18} />}
                type="email"
                variant="bordered"
                {...register("email")}
              />

              {/* Password Input */}
              <Input
                isRequired
                className="w-full"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisible((prev) => !prev)}
                  >
                    {isVisible ? (
                      <EyeOff className="text-default-400" size={18} />
                    ) : (
                      <Eye className="text-default-400" size={18} />
                    )}
                  </button>
                }
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password?.message}
                label="Password"
                placeholder="Enter your password"
                startContent={<Lock className="text-default-400" size={18} />}
                type={isVisible ? "text" : "password"}
                variant="bordered"
                {...register("password")}
              />

              {/* Forgot Password */}
              <div className="flex justify-end items-center">
                <Link
                  className="text-primary hover:text-primary-600"
                  href="#"
                  size="sm"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                className="w-full"
                color="primary"
                isLoading={isLoading}
                size="lg"
                startContent={!isLoading ? <Shield size={18} /> : null}
                type="submit"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Divider className="my-6" />

            {/* Demo Login */}
            <div className="space-y-3">
              <p className="text-center text-sm text-default-500">
                Demo Credentials
              </p>
              <Button
                className="w-full"
                startContent={<Users size={18} />}
                variant="bordered"
                onPress={handleDemoLogin}
              >
                Use Demo Account
              </Button>
              <div className="text-xs text-center text-default-400 space-y-1">
                <p>Email: test@gmail.com</p>
                <p>Password: password</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="p-2 bg-primary/10 rounded-lg mx-auto w-fit">
              <Stethoscope className="text-primary" size={20} />
            </div>
            <p className="text-xs text-default-500">Doctor Management</p>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-secondary/10 rounded-lg mx-auto w-fit">
              <Users className="text-secondary" size={20} />
            </div>
            <p className="text-xs text-default-500">Patient Records</p>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-success/10 rounded-lg mx-auto w-fit">
              <Activity className="text-success" size={20} />
            </div>
            <p className="text-xs text-default-500">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
