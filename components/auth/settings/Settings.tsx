"use client";

import CustomSelect from "@/components/custom-select/CustomSelect";
import { ForgotPasswordModal } from "@/components/forgot-password/ForgotPassword";
import ChangePasswordModal from "./ChangePasswordModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/auth-context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import countryList from "react-select-country-list";
import { toast } from "@/components/AvidToast";
import * as yup from "yup";

type Option = { value: string; label: string };
type SettingsFormValues = {
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  country: Option | null;
  mobile_no: string;
  department: Option | null;
  market_interest: string[];
  receive_updates: boolean;
};


function findOption(options: Option[], rawValue: string | null | undefined): Option | null {
  if (!rawValue) return null;
  const normalized = rawValue.trim().toLowerCase();
  return (
    options.find((option) => option.value.toLowerCase() === normalized) ||
    options.find((option) => option.label.toLowerCase() === normalized) || {
      value: rawValue,
      label: rawValue,
    }
  );
}

function normalizeMarketInterest(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export default function Settings() {
  const t = useTranslations("signUp");
  const [open, setOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState<string | undefined>(undefined);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  // ...existing code...
  const { user, refreshAuth } = useAuth();

  const departmentOptions = (t.raw("options.departmentOptions") as Option[]) || [];
  const markets = (t.raw("options.markets") as string[]) || [];
  const countryOptions = useMemo(() => countryList().getData(), []);

  const schema = yup.object({
    first_name: yup.string().required(t("validations.firstNameRequired")),
    last_name: yup.string().required(t("validations.lastNameRequired")),
    company_name: yup.string().required(t("validations.companyNameRequired")),
    email: yup
      .string()
      .required(t("validations.emailRequired"))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("validations.emailInvalid")),
    country: yup.mixed<Option>().nullable().required(t("validations.countryRequired")),
    mobile_no: yup
      .string()
      .required(t("validations.phoneRequired"))
      .matches(/^[0-9]+$/, t("validations.phoneDigitsOnly"))
      .min(10, t("validations.phoneMin"))
      .max(15, t("validations.phoneMax")),
    department: yup.mixed<Option>().nullable().notRequired(),
    market_interest: yup.array().of(yup.string()),
    receive_updates: yup.boolean().oneOf([true, false]),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      company_name: "",
      email: "",
      country: null,
      mobile_no: "",
      department: null,
      market_interest: [],
      receive_updates: false,
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      company_name: user?.company_name || "",
      email: user?.email || "",
      country: findOption(countryOptions as Option[], user?.country || null),
      mobile_no: user?.mobile_no || "",
      department: findOption(departmentOptions, user?.department || null),
      market_interest: normalizeMarketInterest(user?.market_interest),
      receive_updates: Boolean(user?.receive_updates),
    });
  }, [countryOptions, departmentOptions, reset, user]);

  const onSubmit = async (values: any) => {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      company_name: values.company_name,
      email: values.email,
      mobile_no: values.mobile_no,
      department: values?.department?.label || values?.department?.value || null,
      country: values?.country?.label || values?.country?.value || null,
      market_interest: Array.isArray(values?.market_interest) ? values.market_interest : [],
      receive_updates: Boolean(values?.receive_updates),
    };

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to update profile.");
        return;
      }

      toast.success(data?.message || "Profile updated successfully.");
      refreshAuth();
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <section className="py-16 container-inner">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="font-extrabold text-primary text-2xl md:text-3xl">Profile</h1>
        <p className="mt-2 text-medium-dark text-sm md:text-base mb-8">
          Update your signup details here.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-gray-section p-6 md:p-8 rounded-md"
        >
          <div>
            <Label htmlFor="first_name" className="mb-2 w-max font-medium cursor-pointer">
              {t("fields.firstName")}
            </Label>
            <Input id="first_name" {...register("first_name")} className="bg-white border-white" />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
          </div>

          <div>
            <Label htmlFor="last_name" className="mb-2 w-max font-medium cursor-pointer">
              {t("fields.lastName")}
            </Label>
            <Input id="last_name" {...register("last_name")} className="bg-white border-white" />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
          </div>

          <div>
            <Label htmlFor="company_name" className="mb-2 w-max font-medium cursor-pointer">
              {t("fields.company.fields.companyName")}
            </Label>
            <Input id="company_name" {...register("company_name")} className="bg-white border-white" />
            {errors.company_name && (
              <p className="text-red-500 text-sm">{errors.company_name.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 w-max font-medium cursor-pointer" htmlFor="department">
              {t("fields.company.fields.department")}
            </Label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="department"
                  className="w-full"
                  placeholder=""
                  isClearable
                  options={departmentOptions}
                />
              )}
            />
            {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
          </div>

          <div>
            <Label className="mb-2 w-max font-medium cursor-pointer" htmlFor="country">
              {t("fields.businessInterest.fields.countryInterest")}
            </Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  id="country"
                  className="w-full"
                  placeholder=""
                  isClearable
                  options={countryOptions}
                />
              )}
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-off-black text-base">
              {t("fields.businessInterest.fields.marketInterest")}
            </h3>
            {markets.map((market) => (
              <Controller
                key={market}
                name="market_interest"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-medium-dark cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field?.value?.includes(market)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...(field.value || []), market]);
                          return;
                        }
                        field.onChange((field.value || []).filter((value: string) => value !== market));
                      }}
                    />
                    <span>{market}</span>
                  </label>
                )}
              />
            ))}
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 w-max font-medium cursor-pointer">
              {t("fields.contactDetails.Email")}
            </Label>
            <Input id="email" type="email" {...register("email")} className="bg-white border-white" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="mobile_no" className="mb-2 w-max font-medium cursor-pointer">
              {t("fields.contactDetails.mobileNo")}
            </Label>
            <Input id="mobile_no" {...register("mobile_no")} className="bg-white border-white" />
            {errors.mobile_no && <p className="text-red-500 text-sm">{errors.mobile_no.message}</p>}
          </div>

          <Button type="submit" variant="secondary" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
        {/* Security Settings Section moved below form */}
        <div className="bg-gray-section mt-8 p-6 md:p-8 rounded-md mb-8">
          <h2 className="font-extrabold text-primary text-xl md:text-2xl mb-4">Security Settings</h2>
          <Button
            variant="link"
            type="button"
            className="block p-0 w-max h-max font-bold text-off-black text-base"
            onClick={() => {
              setForgotEmail(user?.email || "");
              setOpen(true);
            }}
          >
            Change Password
          </Button>
          {/* Modal for password reset (same as login forgot password) */}
          <ForgotPasswordModal open={open} onOpenChange={setOpen} email={forgotEmail} titleOverride="Change Password" />
        </div>
      </div>
    </section>
  );
}
