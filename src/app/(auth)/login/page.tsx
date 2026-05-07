"use client";

import Link from "next/link";
import Image from "next/image";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import leftimage from "../../../../public/images/leftImage.png";
import logo from "../../../../public/images/logo.png";
import { useLoginMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { setRefreshToken, setUser } from "@/redux/features/authSlice";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { FormInput } from "@/components/form/FormInput";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(10, "Password max characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async (data: FieldValues) => {
    const payload = {
      email: String(data.email).trim(),
      password: String(data.password),
    };
    console.log("payload", payload);

    try {
      const response = await loginUser(payload).unwrap();
      console.log("response ", response);

      if (response.success && response?.data?.access) {
        dispatch(setUser({ token: response.data.access }));
        dispatch(setRefreshToken({ refresh_token: response.data.refresh }));
        toast.success("Login Successfull", {
          style: {
            background: "#1AC19C",
            color: "#fff",
            border: "1px solid #F97316",
          },
          iconTheme: {
            primary: "#F97316",
            secondary: "#111827",
          },
        });

        router.push(callbackUrl);
        return;
      }
    } catch (err: any) {
      console.log("FULL ERROR:", err);

      const backend = err?.data;

      let msg = "Something went wrong. Please try again.";

      if (backend) {
        // Case 1: Field level error
        if (backend?.error) {
          const firstKey = Object.keys(backend.error)[0];
          if (firstKey && backend.error[firstKey]?.length > 0) {
            msg = backend.error[firstKey][0];
          }
        }

        // Case 2: General message
        if (backend?.message) {
          msg = backend.message;
        }
      }

      toast.error(msg, {
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          border: "1px solid #FCA5A5",
        },
      });
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Image */}
      <div className="relative hidden lg:block border-r border-r-amber-50">
        <Image
          src={leftimage}
          alt="Campus"
          fill
          className="object-content"
          priority
        />
        {/* optional overlay blur / tint */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-[#FFF6FA]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <Link href={"/"} className="w-60 flex items-center justify-center">
              <Image src={logo} alt="logo" />
            </Link>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Hey! Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldSet>
                <FieldGroup>
                  {/* Email */}
                  <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    startIcon={{ icon: Mail }}
                  />

                  {/* Password */}
                  <FormInput
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    startIcon={{ icon: LockKeyhole }}
                    endIcon={{
                      icon: showPassword ? EyeOff : Eye,
                      onClick: () => setShowPassword((prev) => !prev),
                    }}
                  />
                </FieldGroup>
              </FieldSet>

              {/* Forgot password */}
              <div className="flex justify-end -mt-2">
                <Link
                  href="/forget-password"
                  className="text-sm text-[#52C41A] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? "logging in..." : "Log In"} <ArrowRight />
              </Button>

              {/* Divider */}
              {/* <div className="flex items-center gap-3 my-2">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Or Continue with
          </span>
          <Separator className="flex-1" />
        </div> */}

              {/* Google */}
              {/* <Button type="button" variant="outline" className="w-full h-12">
          <svg width="18" height="18" viewBox="0 0 21 21">
            <rect width="10" height="10" fill="#f25022" />
            <rect x="11" width="10" height="10" fill="#7fba00" />
            <rect y="11" width="10" height="10" fill="#00a4ef" />
            <rect x="11" y="11" width="10" height="10" fill="#ffb900" />
          </svg>
          Sign in with Google
        </Button> */}

            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
