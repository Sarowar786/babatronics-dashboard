// src\app\(auth)\login\page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/form/FormInput'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import leftimage from '../../../../public/images/leftImage.png'
import logo from '../../../../public/images/logo.png'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/merchants'
  const { login, isLoading } = useAuth()

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: { email: string; password: string }) => {
    const success = await login(data.email, data.password)
    if (success) {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Image */}
      <div className="relative hidden lg:block border-r border-r-amber-50">
        <Image
          src={leftimage}
          alt="Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-[#FFF6FA]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <Link href={'/'} className="w-60 flex items-center justify-center">
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
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                startIcon={{ icon: Mail }}
              />

              <FormInput
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                startIcon={{ icon: LockKeyhole }}
                endIcon={{
                  icon: showPassword ? EyeOff : Eye,
                  onClick: () => setShowPassword((prev) => !prev),
                }}
              />

              <div className="flex justify-end -mt-2">
                <Link
                  href="/forget-password"
                  className="text-sm text-[#52C41A] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'} <ArrowRight />
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
