import { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { FormInput } from "../form/FormInput";
import { Button } from "../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function PasswordForm() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const methods = useForm({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((d) => console.log(d))} className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-black font-bold text-lg">Password</h2>
          <Info className="text-gray-400 w-4 h-4" />
        </div>
        <div className="w-full h-px bg-gray-100" />

        <FormInput
          name="oldPassword"
          label="Old Password"
          type={showOld ? "text" : "password"}
          placeholder="Input your old password"
          endIcon={{ 
            icon: showOld ? EyeOff : Eye, 
            onClick: () => setShowOld(!showOld) 
          }}
        />

        <FormInput
          name="newPassword"
          label="New Password"
          type={showNew ? "text" : "password"}
          placeholder="Input your new password"
          description="Min 8 Characters with a combination of letters and numbers"
          endIcon={{ 
            icon: showNew ? EyeOff : Eye, 
            onClick: () => setShowNew(!showNew) 
          }}
        />

        <FormInput
          name="confirmPassword"
          label="Confirmation New Password"
          type={showConfirm ? "text" : "password"}
          placeholder="confirmation your new password"
          endIcon={{ 
            icon: showConfirm ? EyeOff : Eye, 
            onClick: () => setShowConfirm(!showConfirm) 
          }}
        />

        <div className="pt-4">
          <Button type="submit" className="px-10 py-6 bg-black rounded-lg">Save</Button>
        </div>
      </form>
    </FormProvider>
  );
}