// src\hooks\useAuth.ts
'use client'

import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setUser, setRefreshToken, logout } from '@/redux/features/authSlice'
import { useLoginMutation, useGetMeQuery } from '@/redux/api/authApi'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

// Types
interface LoginResponse {
  success: boolean
  message?: string
  data?: {
    tokens?: {
      accessToken: string
      refreshToken: string
    }
    user?: {
      id: string
      email: string
      role: string
      merchant?: {
        id: string
        businessName: string
        plan: string | null
      }
    }
  }
}

interface ApiError {
  data?: {
    message?: string
  }
  message?: string
}

interface UserData {
  id: string
  email: string
  fullName: string
  role: string
  merchant?: {
    id: string
    businessName: string
    plan: string | null
  }
}

export function useAuth() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { token } = useSelector((state: RootState) => state.auth)

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation()
  const { data: meData, refetch: refetchMe } = useGetMeQuery(undefined, {
    skip: !token,
  })

  const isAuthenticated: boolean = !!token

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = (await loginMutation({
        email,
        password,
      }).unwrap()) as LoginResponse

      if (response.success && response.data?.tokens?.accessToken) {
        dispatch(setUser({ token: response.data.tokens.accessToken }))
        dispatch(
          setRefreshToken({ refresh_token: response.data.tokens.refreshToken }),
        )

        // Store user info in localStorage if needed
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }

        toast.success('Login successful!')
        return true
      } else {
        toast.error(response.message || 'Login failed')
        return false
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      const message =
        apiError?.data?.message || apiError?.message || 'Something went wrong'
      toast.error(message)
      return false
    }
  }

  const logoutUser = (): void => {
    dispatch(logout())
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  // Get user data from API when token is available
  useEffect(() => {
    if (token && !localStorage.getItem('user')) {
      refetchMe()
    }
  }, [token, refetchMe])

  // Get user from localStorage
  const getUserFromStorage = (): UserData | null => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? (JSON.parse(user) as UserData) : null
  }

  const userData: UserData | null = getUserFromStorage()

  return {
    user: userData,
    token,
    isAuthenticated,
    isLoading: isLoggingIn,
    login,
    logout: logoutUser,
  }
}
