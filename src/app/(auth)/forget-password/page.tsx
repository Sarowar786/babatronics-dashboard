// src/app/(auth)/forget-password/page.tsx
'use client'

import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForgotPasswordMutation } from '@/redux/api/authApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'

// Types
type ForgotFormValues = {
  email: string
  otp?: string
}

interface ForgotPasswordResponse {
  success: boolean
  message?: string
}

interface ApiError {
  data?: {
    error?: {
      email?: string[]
    }
    message?: string
  }
  message?: string
}

const emailOnlySchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email is required')
    .email('Invalid email address'),
})

const emailOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email is required')
    .email('Invalid email address'),
  otp: z
    .string()
    .trim()
    .nonempty('OTP is required')
    .min(4, 'OTP is too short')
    .max(8, 'OTP is too long'),
})

type Step = 'SEND' | 'VERIFY'

export default function ForgetPasswordPage(): React.ReactElement {
  const router = useRouter()
  const [step] = useState<Step>('SEND')
  const schema = useMemo(
    () => (step === 'SEND' ? emailOnlySchema : emailOtpSchema),
    [step],
  )

  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation()

  const methods = useForm<ForgotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: { email: string }): Promise<void> => {
    try {
      const res = (await forgotPassword(
        data,
      ).unwrap()) as ForgotPasswordResponse
      console.log(res)
      toast.success('OTP has been sent to your email. Please check your inbox.')

      router.push(
        `/verification?forgot-password=success&email=${encodeURIComponent(data.email)}`,
      )
    } catch (error: unknown) {
      console.log('error', error)
      const apiError = error as ApiError
      const errorMessage =
        apiError?.data?.error?.email?.[0] ||
        apiError?.data?.message ||
        'Failed to send OTP. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FFF6FA]">
      <div className="w-full max-w-md px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-gray-900">
              Reset Password?
            </h1>
            <p className="mt-1 text-sm text-gray-500 text-center">
              Enter your email, we will send a verification code to your email
            </p>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="mt-8 space-y-4"
              noValidate
            >
              {/* Email */}
              <div>
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={step === 'VERIFY'}
                />
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Remember password?{' '}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>

              {/* Button */}
              <Button
                type="submit"
                className="w-full rounded-md py-6 disabled:opacity-60"
              >
                {isSending ? 'Sending...' : 'Send Code'}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
