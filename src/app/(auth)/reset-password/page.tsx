'use client'
import Link from "next/link";
import {z} from 'zod'
import leftimage from '../../../../public/images/company-logo.png'
import Image from "next/image";
import logo from '../../../../public/images/logonav.png'
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { p } from "framer-motion/client";
import { useRouter, useSearchParams, } from "next/navigation";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/redux/api/authApi";

const registerSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .max(10, "Password must be at least 10 characters"),
  confirm:z
    .string()
    .min(1, "Password is required")
    .max(10, "Password must be at least 10 characters"),
}).refine((data) => data.password === data.confirm, {
    message: "Passwords don't match", 
    path: ["confirm"], 
  });

export default function ResetPassPage() {
  const router = useRouter()
  const [resetPassword, {isLoading}] = useResetPasswordMutation();
  const reset_token =useSearchParams().get("token")
 
  const {register,handleSubmit,setError, formState:{errors,isSubmitting}, } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues:{
      password: "",
      confirm: "",
    },
  })

  // console.log(useForm())


  const onSubmit=async(data:FieldValues)=>{
    console.log( "Reset pass data : ", data)
    try {
      const payload = {
        password: data.password,
        confirm: data.confirm,
        reset_token: reset_token,
      };
      console.log("payload", payload);

      const res = await resetPassword(payload).unwrap();
      console.log("reset pass response ", res);
      router.push('/login')
    } catch (err:any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
    
  }
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
            {/* চাইলে logo image দাও */}
            <div className="w-60 flex items-center justify-center">
              <Image src={logo} alt="logo"/>
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Create New Password
            </h1>
            <p className="mt-1 text-sm text-gray-500">Your password must be different from previous used password</p>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-4">            
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
            </div>
            <div>
              <label className="text-sm text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                  ${errors.password ? "border-red-500" : "border-gray-200 focus:border-orange-500"}
                `}
                {...register("confirm")}
              />
              {errors.confirm && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirm.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-3 disabled:opacity-60"
            >
              {isSubmitting ? "Continue..." : "Continue"}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
