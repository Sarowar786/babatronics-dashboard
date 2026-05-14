// src/app/(auth)/otp-verify/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  useResendOtpMutation,
  useVerifyEmailOtpMutation,
} from '@/redux/api/authApi'

type VerifyForm = {
  otp: string
}

// Types for API responses
interface ApiError {
  data?: {
    message?: string
  }
  error?: string
  message?: string
}

export default function VerifyOtpPage(): React.ReactElement {
  const router = useRouter()
  const params = useSearchParams()

  const email = useMemo(() => params.get('email') || '', [params])

  const [verifyOtp, { isLoading: verifying }] = useVerifyEmailOtpMutation()
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForm>({
    defaultValues: { otp: '' },
  })

  // cooldown for resend
  const [cooldown, setCooldown] = useState<number>(0)
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  // If email missing, user probably opened verify page directly
  useEffect(() => {
    if (!email) {
      toast.error('Email missing. Please register first.')
      router.push('/register')
    }
  }, [email, router])

  const onSubmit = async (data: VerifyForm): Promise<void> => {
    const toastId = toast.loading('Verifying OTP...')

    try {
      const res = await verifyOtp({
        email,
        otp: data.otp.trim(),
      }).unwrap()

      if (res?.success) {
        toast.success(res?.message || 'Email verified successfully!', {
          id: toastId,
        })
        router.push('/login')
      } else {
        toast.error(res?.message || 'OTP verification failed!', {
          id: toastId,
        })
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      const msg =
        apiError?.data?.message || apiError?.error || 'Something went wrong'
      toast.error(msg, { id: toastId })
    }
  }

  const handleResend = async (): Promise<void> => {
    const toastId = toast.loading('Resending OTP...')

    try {
      const res = await resendOtp({ email }).unwrap()

      if (res?.success) {
        toast.success(res?.message || 'OTP resent successfully!', {
          id: toastId,
        })
        setCooldown(30)
      } else {
        toast.error(res?.message || 'Resend failed!', { id: toastId })
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      const msg =
        apiError?.data?.message || apiError?.error || 'Something went wrong'
      toast.error(msg, { id: toastId })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold">Verify Email</h1>
        <p className="text-sm text-gray-500 mt-1">
          We sent an OTP to{' '}
          <span className="font-semibold text-gray-900">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">OTP</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2 outline-none focus:ring tracking-[0.35em] text-lg"
              placeholder="OTP"
              inputMode="numeric"
              maxLength={6}
              {...register('otp', {
                required: 'OTP is required',
                minLength: { value: 4, message: 'OTP is too short' },
              })}
            />
            {errors.otp?.message && (
              <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
            )}
          </div>

          <button
            disabled={verifying}
            className="w-full rounded-xl py-2.5 font-semibold bg-black text-white disabled:opacity-60"
            type="submit"
          >
            {verifying ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/register')}
            className="text-sm font-semibold underline"
            type="button"
          >
            Back
          </button>

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="text-sm font-semibold underline disabled:opacity-50"
            type="button"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resending
                ? 'Resending...'
                : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}
