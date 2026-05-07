"use client";
import { z } from "zod";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .max(10, "Password must be at least 10 characters"),
    confirm: z
      .string()
      .min(1, "Password is required")
      .max(10, "Password must be at least 10 characters"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function ResetPassPage() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const reset_token = useSearchParams().get("token");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const methods = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  // console.log(useForm())

  const onSubmit = async (data: FieldValues) => {
    console.log("Reset pass data : ", data);
    try {
      const payload = {
        password: data.password,
        confirm: data.confirm,
        reset_token: reset_token,
      };
      console.log("payload", payload);

      const res = await resetPassword(payload).unwrap();
      console.log("reset pass response ", res);
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FFF6FA]">
      <div className="w-full max-w-md px-6 py-12 ">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Create New Password
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Your password must be different from previous used password
            </p>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="mt-8 space-y-4"
            >
              <div>
                <FormInput
                  name="password"
                  label="New Password"
                  type={showPass ? "text" : "password"}
                  placeholder="New Password"
                  endIcon={{
                    icon: showPass ? EyeOff : Eye,
                    onClick: () => setShowPass((p) => !p),
                  }}
                />
              </div>
              <div>
                <FormInput
                  name="confirm"
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  endIcon={{
                    icon: showConfirm ? EyeOff : Eye,
                    onClick: () => setShowConfirm((p) => !p),
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={methods.formState.isSubmitting}
                className="w-full transition font-semibold py-6 mt-3 disabled:opacity-60"
              >
                {methods.formState.isSubmitting
                  ? "Reseting..."
                  : "Reset Password"}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
