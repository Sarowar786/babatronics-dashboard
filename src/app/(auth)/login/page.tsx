"use client";

import Link from "next/link";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import leftimage from "../../../../public/images/company-logo.png";
import logo from "../../../../public/images/logonav.png";
import { useLoginMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { setRefreshToken, setUser } from "@/redux/features/authSlice";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ 1) Zod schema: rules এখানে define হবে
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
  // ✅ 3) useForm সেটআপ + zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
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
      identifier: String(data.email).trim(),
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
      <div className="flex items-center justify-center px-6 py-12 bg-gray-50">
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
            noValidate
          >
            {/* Email */}
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                  ${errors.email ? "border-red-500" : "border-gray-200 focus:border-orange-500"}
                `}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                  ${errors.password ? "border-red-500" : "border-gray-200 focus:border-orange-500"}
                `}
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}

              <div className="mt-2 flex justify-end">
                <Link
                  href="/forget-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-3 disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-orange-500 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
