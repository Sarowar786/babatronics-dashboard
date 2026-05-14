// src/components/Settings/PasswordForm.tsx
import { useState } from 'react'
import { Eye, EyeOff, Info, Loader2 } from 'lucide-react'
import { FormInput } from '../form/FormInput'
import { Button } from '../ui/button'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useUpdateAdminProfileMutation } from '@/redux/api/adminApi'
import toast from 'react-hot-toast'

// Types
interface UpdatePasswordData {
  password: string
}

interface ApiError {
  data?: {
    message?: string
  }
  message?: string
}

interface UpdateProfileResponse {
  success: boolean
  message?: string
}

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

export function PasswordForm(): React.ReactElement {
  const [showOld, setShowOld] = useState<boolean>(false)
  const [showNew, setShowNew] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const [updateProfile, { isLoading }] = useUpdateAdminProfileMutation()

  const methods = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const { reset } = methods

  const onSubmit = async (data: PasswordFormValues): Promise<void> => {
    console.log('Password change submitted:', {
      hasOldPassword: !!data.oldPassword,
      hasNewPassword: !!data.newPassword,
    })

    // Only send the new password to the API
    const updateData: UpdatePasswordData = {
      password: data.newPassword,
    }

    try {
      const result = (await updateProfile(
        updateData,
      ).unwrap()) as UpdateProfileResponse
      console.log('Password update result:', result)

      if (result.success) {
        toast.success('Password changed successfully')
        // Reset the form
        reset({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(result.message || 'Failed to change password')
      }
    } catch (error: unknown) {
      console.error('Password update error:', error)
      const apiError = error as ApiError
      const message =
        apiError?.data?.message || apiError?.message || 'Something went wrong'
      toast.error(message)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-black font-bold text-lg">Password</h2>
          <Info className="text-gray-400 w-4 h-4" />
        </div>
        <div className="w-full h-px bg-gray-100" />

        <FormInput
          name="oldPassword"
          label="Old Password"
          type={showOld ? 'text' : 'password'}
          placeholder="Input your old password"
          endIcon={{
            icon: showOld ? EyeOff : Eye,
            onClick: () => setShowOld(!showOld),
          }}
        />

        <FormInput
          name="newPassword"
          label="New Password"
          type={showNew ? 'text' : 'password'}
          placeholder="Input your new password"
          description="Min 8 Characters with a combination of letters and numbers"
          endIcon={{
            icon: showNew ? EyeOff : Eye,
            onClick: () => setShowNew(!showNew),
          }}
        />

        <FormInput
          name="confirmPassword"
          label="Confirmation New Password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirmation your new password"
          endIcon={{
            icon: showConfirm ? EyeOff : Eye,
            onClick: () => setShowConfirm(!showConfirm),
          }}
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="px-10 py-6 bg-black rounded-lg hover:bg-zinc-800"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
