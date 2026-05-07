"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/redux/api/authApi";
import SectionHeader from "@/components/common/SectionHeader";

export const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits"),
});

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");
  const forgotPassword = params.get("forgot-password");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();

  const methods = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  // Submit
  const onSubmit = async (data: { otp: string }) => {
    try {
      if (!email) {
        toast.error("Email not found ❌");
        return;
      }
      console.log({
        email,
        otp: data.otp,
      });
      const res=await verifyOtp({
        email,
        otp: data.otp,
      }).unwrap();
      
      toast.success(
        forgotPassword === "success"
          ? "OTP verified! Reset your password."
          : "OTP verified! Please log in.",
      );

      //  redirect with email
      forgotPassword === "success"
        ? router.push(`/reset-password?token=${res?.data?.reset_token}`)
        : router.push(`/login`);
    } catch (error: any) {
      console.log(error);

      const err = error?.data;

      // Priority based message extract
      const message =
        err?.errors?.non_field_errors?.[0] ||
        err?.errors?.email?.[0] ||
        err?.message ||
        "OTP verification failed ❌";

      toast.error(message);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      if (!email) return;

      await resendOtp({ email }).unwrap();
      toast.success("OTP sent again 📩");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#FFF6FA] px-4">
      <div className="w-full max-w-md space-y-6">
        <SectionHeader
          align="center"
          title="Verify OTP"
          description={`Enter the code sent to ${email}`}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* OTP */}
            <div className="flex items-center justify-center">
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <InputOTP
                    maxLength={4}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup className="w-full gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="bg-white size-12 border"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>

            {/* Error */}
            {errors.otp && (
              <p className="text-sm text-red-500 text-center">
                {errors.otp.message as string}
              </p>
            )}

            {/* Resend */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Back */}
            <p className="text-center text-sm text-muted-foreground pt-2">
              Wrong email?{" "}
              <Link
                href="/forget-password"
                className="text-primary font-semibold hover:underline"
              >
                Change email
              </Link>
            </p>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
