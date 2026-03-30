"use client";

import Link from "next/link";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import leftimage from "../../../../public/images/company-logo.png";
import logo from "../../../../public/images/logonav.png";
import {
  useForgotPasswordMutation,
  useResetEmailVerifyMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { useStep } from "usehooks-ts";
import { useMemo, useState } from "react";


type ForgotFormValues = {
  email: string;
  otp?: string; // ✅ optional so TS knows it may exist
};
// ✅ 1) Zod schema: rules এখানে define হবে
const emailOnlySchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email is required")
    .email("Invalid email address"),
});
const emailOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email is required")
    .email("Invalid email address"),
  otp: z
    .string()
    .trim()
    .nonempty("OTP is required")
    .min(4, "OTP is too short")
    .max(8, "OTP is too long"),
});

type Step = "SEND" | "VERIFY";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("SEND");
  const schema = useMemo(
    () => (step === "SEND" ? emailOnlySchema : emailOtpSchema),
    [step],
  );

  // toast.success(res?.message || "Verified")
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      otp: "",
    },
    mode: "onTouched", // UX better: touch করলে error দেখায়
  });

  const [forgotPassword, { isLoading: isSending }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useResetEmailVerifyMutation();

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      if (step === "SEND") {
        const res = await forgotPassword({ email: data.email }).unwrap();
        console.log('forget pass response', res);
        
        toast.success(res?.message || "Code sent!");

        // সফল হলে OTP field দেখাবে + button verify হবে
        setStep("VERIFY");
        return;
      }
      const res = await verifyOtp({
        email: data.email,
        otp: data.otp,
      }).unwrap();
      toast.success(res?.message || "Verified!");
      console.log('verify otp response',res);
      

      const resetToken = res?.data?.reset_token;
      console.log('reset token ', resetToken);
      
      if (resetToken) {
        router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`);
      } else {
        // token না থাকলে simple redirect
        router.push("/reset-password");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };
  const loading = isSubmitting || isSending || isVerifying;

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Image */}
      <div className="relative hidden lg:block border-r border-r-amber-50">
        <Image
          src={leftimage} // ✅ তুমি public/images এ image রাখো
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
            <div className="w-60 flex items-center justify-center">
              <Image src={logo} alt="logo" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Forget Password?
            </h1>
            <p className="mt-1 text-sm text-gray-500 w-80 text-center">
              Enter your email and we’ll send a verification code to reset
              password.
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
                  ${errors.email ? "border-red-500" : "border-gray-200 focus:border-orange-500"}`}
                {...register("email")}
                disabled={step === "VERIFY"} // verify step এ email lock রাখা ভালো
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {String(errors.email.message)}
                </p>
              )}
            </div>

            {/* OTP (only after send code) */}
            {step === "VERIFY" && (
              <div>
                <label className="text-sm text-gray-700">OTP Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                    ${errors.otp ? "border-red-500" : "border-gray-200 focus:border-orange-500"}`}
                  {...register("otp")}
                />
                {errors.otp && (
                  <p className="mt-1 text-xs text-red-600">
                    {String(errors.otp.message)}
                  </p>
                )}

                {/* Optional: resend */}
                <button
                  type="button"
                  className="mt-2 text-sm text-orange-500 font-semibold hover:underline"
                  onClick={async () => {
                    try {
                      const email = getValues("email");
                      const res = await forgotPassword({ email }).unwrap();
                      toast.success(res?.message || "Code resent!");
                    } catch (err: any) {
                      toast.error(err?.data?.message || "Failed to resend");
                    }
                  }}
                >
                  Resend code
                </button>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-3 disabled:opacity-60"
            >
              {step === "SEND"
                ? loading
                  ? "Sending..."
                  : "Send Code"
                : loading
                  ? "Verifying..."
                  : "Verify"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Back to{" "}
              <Link
                href="/login"
                className="text-orange-500 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
