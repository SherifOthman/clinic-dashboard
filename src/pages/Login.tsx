import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
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
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";

      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await authLogin(email, password);

      if (success) {
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        // Redirect to the page they were trying to access, or dashboard
        const from = location.state?.from?.pathname || "/";

        navigate(from, { replace: true });
      } else {
        setErrors({
          email: "Invalid credentials",
          password: "Invalid credentials",
        });
      }
    } catch (error) {
      setErrors({
        email: "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("admin@clinic.com");
    setPassword("password");
    setErrors({});
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
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email Input */}
              <Input
                isRequired
                className="w-full"
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Email Address"
                placeholder="Enter your email"
                startContent={<Mail className="text-default-400" size={18} />}
                type="email"
                value={email}
                variant="bordered"
                onValueChange={setEmail}
              />

              {/* Password Input */}
              <Input
                isRequired
                className="w-full"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeOff className="text-default-400" size={18} />
                    ) : (
                      <Eye className="text-default-400" size={18} />
                    )}
                  </button>
                }
                errorMessage={errors.password}
                isInvalid={!!errors.password}
                label="Password"
                placeholder="Enter your password"
                startContent={<Lock className="text-default-400" size={18} />}
                type={isVisible ? "text" : "password"}
                value={password}
                variant="bordered"
                onValueChange={setPassword}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center">
                <Checkbox
                  isSelected={rememberMe}
                  size="sm"
                  onValueChange={setRememberMe}
                >
                  Remember me
                </Checkbox>
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
                <p>Email: admin@clinic.com</p>
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

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-default-400">
          <p>© 2024 ClinicMS. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="#" size="sm">
              Privacy Policy
            </Link>
            <Link href="#" size="sm">
              Terms of Service
            </Link>
            <Link href="#" size="sm">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
