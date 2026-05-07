"use client";

import { Controller, useFormContext } from "react-hook-form";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { useUploadFileMutation } from "@/redux/api/uploaderApi";


type Props = {
  name: string;
  label?: string;
  description?: string;
  height?: string;
  multiple?: boolean;
  maxFiles?: number;
  type?: "image" | "video"; // 👈 NEW
};

export default function FormFileInput({
  name,
  label = "Upload File",
  description,
  height = "h-40",
  multiple = false,
  maxFiles = 5,
  type = "image", // default image
}: Props) {
  const { control } = useFormContext();
  const [uploadFile, { isLoading }] = useUploadFileMutation();

  const isVideo = type === "video";

  const accept = isVideo ? "video/*" : "image/*";

  const handleUpload = async (
    files: FileList,
    onChange: any,
    current: string[] = []
  ) => {
    try {
      const incomingFiles = Array.from(files);

      // ❌ MIX VALIDATION (important)
      for (const file of incomingFiles) {
        if (isVideo && !file.type.startsWith("video/")) {
          toast.error("Only video files allowed ❌");
          return;
        }

        if (!isVideo && !file.type.startsWith("image/")) {
          toast.error("Only image files allowed ❌");
          return;
        }
      }

      if (multiple && current.length + incomingFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const formData = new FormData();
      incomingFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await uploadFile(formData).unwrap();
      const urls = res?.data?.file_urls || [];

      const updated = multiple ? [...current, ...urls] : urls;

      onChange(updated);

      toast.success("Uploaded successfully 🚀");
    } catch (err) {
      toast.error("Upload failed ❌");
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value: string[] = field.value || [];

        return (
          <Field>
            <FieldLabel>{label}</FieldLabel>

            <FieldContent>
              {/* DROPZONE */}
              <div
                className={`bg-white relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition ${height}
                ${
                  fieldState.error
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                <input
                  type="file"
                  multiple={multiple}
                  accept={accept} // 👈 IMPORTANT
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleUpload(e.target.files, field.onChange, value);
                    }
                  }}
                />

                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <UploadCloud className="w-8 h-8" />
                  <p className="text-sm">
                    {isLoading
                      ? "Uploading..."
                      : isVideo
                      ? "Upload video file"
                      : multiple
                      ? `Upload up to ${maxFiles} images`
                      : "Upload image"}
                  </p>
                </div>
              </div>

              {/* PREVIEW */}
              {value?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {value.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded overflow-hidden border"
                    >
                      {isVideo ? (
                        <video
                          src={url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={url}
                          className="w-full h-full object-cover"
                          alt="upload"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const updated = value.filter((_, i) => i !== idx);
                          field.onChange(updated);
                        }}
                        className="absolute top-0 right-0 bg-black/60 text-white p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <FieldDescription>{description}</FieldDescription>
              <FieldError>{fieldState.error?.message}</FieldError>
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}