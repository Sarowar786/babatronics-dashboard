import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Info, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "../form/FormInput";
import Image from "next/image";
import { FormSelect } from "../form/FormSelect";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  bio: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function BasicForm() {
  const methods = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      city: "",
      province: "",
      bio: "",
    },
  });

  const City_Options = [
    { label: "New York", value: "new-york" },
    { label: "Los Angeles", value: "los-angeles" },
    { label: "Chicago", value: "chicago" },
    { label: "Houston", value: "houston" },
    { label: "Phoenix", value: "phoenix" },
  ];

  const Province_Options = [
    { label: "Street 1", value: "street-1" },
    { label: "Street 2", value: "street-2" },
    { label: "Street 3", value: "street-3" },
  ];

  const Country_Options = [
    { label: "United States", value: "united-states" },
    { label: "Canada", value: "canada" },
    { label: "United Kingdom", value: "united-kingdom" },
    { label: "Australia", value: "australia" },
    { label: "Germany", value: "germany" },
  ];

  const onSubmit = (data: ProfileValues) => console.log(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-black font-bold text-lg">Profile Information</h2>
          <Info className="text-gray-400 w-4 h-4" />
        </div>
        <div className="w-full h-px bg-gray-100" />

        {/* Photo Profile Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Photo Profile</p>
          <div className=" flex flex-col items-start mb-4">
            {/*  hidden file input */}
            <input
              type="file"
              id="profile-image-input"
              accept="image/*"
              className="hidden"
              // onChange={handleImageChange}
            />

            {/*  uniform size fixed container */}
            <div className="relative">
              <label
                htmlFor="profile-image-input"
                className="relative cursor-pointer block w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50"
              >
                <Image
                  src={"/images/logo.png"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-content w-full h-full"
                />
              </label>

              {/*  click to open file picker */}
              <label
                htmlFor="profile-image-input"
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <Camera className="w-3 h-3 text-white" />
              </label>
            </div>
          </div>
        </div>

        <FormInput name="name" label="Display Name" placeholder="Full Name" />
        <FormInput name="email" label="Email" placeholder="email@example.com" />

        <div className="grid grid-cols-3 gap-4">
          <FormSelect name={`country`} label="Country" options={Country_Options} placeholder="Select a country"/>
          <FormSelect name={`city`} label="City" options={City_Options} placeholder="Select a city" />
          <FormSelect name={`province`} label="Province" options={Province_Options} placeholder="Select a province" />
        </div>

        <FormInput
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself"
        />

        <div className="pt-4">
          <Button
            type="submit"
            className="px-10 py-6 bg-black hover:bg-zinc-800 rounded-md"
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
