// src\components\Settings\BasicForm.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Info, Camera, Loader2, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormInput } from '../form/FormInput'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useUploadProfilePhotoMutation,
  useDeleteProfilePhotoMutation,
  useGetProfilePhotoQuery,
} from '@/redux/api/adminApi'
import toast from 'react-hot-toast'

// Types
interface ProfileData {
  fullName: string
  email: string
}

interface UpdateProfileData {
  fullName?: string
  email?: string
}

interface UploadPhotoResponse {
  success: boolean
  message: string
  photoUrl?: string
}

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

type ProfileValues = z.infer<typeof profileSchema>

export function BasicForm(): React.ReactElement {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    data: profileResponse,
    isLoading,
    refetch,
  } = useGetAdminProfileQuery(undefined)
  const { data: photoData, refetch: refetchPhoto } =
    useGetProfilePhotoQuery(undefined)
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateAdminProfileMutation()
  const [uploadPhoto, { isLoading: isUploading }] =
    useUploadProfilePhotoMutation()
  const [deletePhoto, { isLoading: isDeleting }] =
    useDeleteProfilePhotoMutation()

  const profileData = profileResponse?.data as ProfileData | undefined
  const profilePhoto = photoData?.data?.photoUrl as string | undefined
  
  // Set image preview from API - This is the correct way to sync external data
  useEffect(() => {
    if (profilePhoto) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImagePreview(profilePhoto)
    }
  }, [profilePhoto]) // ✅ This is correct for syncing external data

  const methods = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  })

  const { reset } = methods

  // Reset form when profile data loads
  useEffect(() => {
    if (profileData) {
      reset({
        fullName: profileData.fullName || '',
        email: profileData.email || '',
      })
    }
  }, [profileData, reset])

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
    const allowedTypes: string[] = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, and GIF files are allowed')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary via backend
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const result = (await uploadPhoto(formData).unwrap()) as UploadPhotoResponse
      if (result.success) {
        toast.success('Profile photo updated successfully')
        refetchPhoto()
      } else {
        toast.error(result.message || 'Failed to upload photo')
        // Revert preview on error
        if (profilePhoto) {
          setImagePreview(profilePhoto)
        } else {
          setImagePreview(null)
        }
      }
    } catch (error: unknown) {
      console.error('Upload error:', error)
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || 'Failed to upload photo')
      // Revert preview on error
      if (profilePhoto) {
        setImagePreview(profilePhoto)
      } else {
        setImagePreview(null)
      }
    }
  }

  const handleDeleteClick = (): void => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async (): Promise<void> => {
    setDeleteDialogOpen(false)

    try {
      // ✅ Fix 2: deletePhoto doesn't require an argument
      const result = (await deletePhoto(undefined).unwrap()) as UploadPhotoResponse
      if (result.success) {
        setImagePreview(null)
        toast.success('Profile photo deleted')
        refetchPhoto()
      } else {
        toast.error(result.message || 'Failed to delete photo')
      }
    } catch (error: unknown) {
      console.error('Delete error:', error)
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || 'Failed to delete photo')
    }
  }

  const cancelDelete = (): void => {
    setDeleteDialogOpen(false)
  }

  const onSubmit = async (data: ProfileValues): Promise<void> => {
    const updateData: UpdateProfileData = {}

    if (data.fullName && data.fullName !== profileData?.fullName) {
      updateData.fullName = data.fullName
    }
    if (data.email && data.email !== profileData?.email) {
      updateData.email = data.email
    }

    try {
      const result = await updateProfile(updateData).unwrap() as { success: boolean; message?: string }
      if (result.success) {
        toast.success('Profile updated successfully')
        refetch()
      } else {
        toast.error(result.message || 'Failed to update profile')
      }
    } catch (error: unknown) {
      console.error('Update error:', error)
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-black font-bold text-lg">
              Profile Information
            </h2>
            <Info className="text-gray-400 w-4 h-4" />
          </div>
          <div className="w-full h-px bg-gray-100" />

          {/* Photo Profile Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Profile Photo</p>
            <div className="flex items-start gap-4">
              <div className="relative">
                <input
                  type="file"
                  id="profile-image-input"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  disabled={isUploading}
                />

                <label
                  htmlFor="profile-image-input"
                  className="relative cursor-pointer block w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 hover:opacity-80 transition-opacity"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">Add</span>
                    </div>
                  )}
                </label>

                <label
                  htmlFor="profile-image-input"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors shadow-md"
                >
                  <Camera className="w-3 h-3 text-white" />
                </label>
              </div>

              <div className="flex flex-col gap-2">
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
                {isUploading && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>
          </div>

          <FormInput
            name="fullName"
            label="Full Name"
            placeholder="Admin User"
          />
          <FormInput
            name="email"
            label="Email"
            placeholder="admin@example.com"
            type="email"
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isUpdating}
              className="px-10 py-6 bg-black hover:bg-zinc-800 rounded-md transition-colors"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Profile Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your profile photo? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}