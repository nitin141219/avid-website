"use client";

import CustomSelect from "@/components/custom-select/CustomSelect";
import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { PasswordInput } from "@/components/password-input/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import countryList from "react-select-country-list";
import { toast } from "@/components/AvidToast";
import * as yup from "yup";

function SignUp() {
  const t = useTranslations("signUp");

  const schema = yup.object({
    first_name: yup.string().required(t("validations.firstNameRequired")),
    last_name: yup.string().required(t("validations.lastNameRequired")),
    company_name: yup.string().required(t("validations.companyNameRequired")),
    email: yup
      .string()
      .required(t("validations.emailRequired"))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("validations.emailInvalid")),
    country: yup.object().nullable().required(t("validations.countryRequired")),
    mobile_no: yup
      .string()
      .required(t("validations.phoneRequired"))
      .matches(/^[0-9]+$/, t("validations.phoneDigitsOnly"))
      .min(10, t("validations.phoneMin"))
      .max(15, t("validations.phoneMax")),
    department: yup.object({ value: yup.string(), label: yup.string() }).nullable().notRequired(),
    market_interest: yup.array().of(yup.string()),
    password: yup.string().required(t("validations.passwordRequired")),
    confirmEmail: yup
      .string()
      .oneOf([yup.ref("email")], t("validations.confirmEmailMatch"))
      .required(t("validations.confirmEmailRequired"))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("validations.emailInvalid")),
    confirmPassword: yup
      .string()
      .required(t("validations.confirmPasswordRequired"))
      .oneOf([yup.ref("password")], t("validations.confirmPasswordMatch")),
    agree: yup.boolean().oneOf([true], t("validations.agreeRequired")).required(),
    receive_updates: yup.boolean().oneOf([true, false]),
  });

  const countryOptions = useMemo(() => countryList().getData(), []);
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      market_interest: [],
      agree: false,
      receive_updates: false,
    },
  });

  const onSubmit = async (values: any) => {
    const { confirmPassword, confirmEmail, ...payload } = values;
    const formData = {
      ...payload,
      department: payload?.department?.label || null,
      country: payload?.country?.label || null,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errorCode === "PRIVACY_POLICY_REQUIRED") {
          toast.error(t("validations.agreeRequired"));
          return;
        }
        if (data?.errorCode === "AUTH_EMAIL_EXISTS") {
          toast.error(t("toast.emailExists"));
          return;
        }
        if (data?.errorCode === "AUTH_REGISTER_FAILED") {
          toast.error(t("toast.registrationFailed"));
          return;
        }
        toast.error(data?.message || t("toast.registrationFailed"));
        return;
      }
      reset();
      toast.success(data?.message || "User has been registered successfully!");
      router.push("/login");
    } catch {
      toast.error(t("toast.networkError"));
    }
  };

  useEffect(() => {
    reset();
  }, []);

  const departmentOptions = t.raw("options.departmentOptions");
  const markets = t.raw("options.markets");

  return (
    <section>
      <div className="py-16 container-inner">
        <div className="flex items-end mb-12">
          <Image
            src="/A.png"
            alt="Logo"
            width={60}
            height={60}
            priority
            className="mr-1 transition-all duration-300"
          />
          <h1 className="font-normal text-medium-dark text-3xl md:text-4xl leading-none">
            {t("mainTitle")}
          </h1>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 bg-gray-section p-6 px-8 w-full text-white"
          >
            <h2 className="mb-6 font-extrabold text-off-black text-2xl md:text-3xl">
              {t("title")}
            </h2>
            <div className="">
              <Label
                required
                className="mb-2 w-max font-medium cursor-pointer"
                htmlFor="first_name"
              >
                {t("fields.firstName")}
              </Label>
              <Input
                id="first_name"
                {...register("first_name")}
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">{errors.first_name.message}</p>
              )}
            </div>
            <div className="">
              <Label required className="mb-2 w-max font-medium cursor-pointer" htmlFor="last_name">
                {t("fields.lastName")}
              </Label>
              <Input
                id="last_name"
                {...register("last_name")}
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">{errors.last_name.message}</p>
              )}
            </div>
            <h6 className="font-extrabold text-off-black text-base">{t("fields.company.title")}</h6>
            <div className="">
              <Label
                className="mb-2 w-max font-medium cursor-pointer"
                required
                htmlFor="company_name"
              >
                {t("fields.company.fields.companyName")}
              </Label>
              <Input
                id="company_name"
                {...register("company_name")}
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm">{errors.company_name.message}</p>
              )}
            </div>
            <div className="">
              <Label className="mb-2 w-max font-medium cursor-pointer" htmlFor="department">
                {t("fields.company.fields.department")}
              </Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    className="col-span-full w-full"
                    placeholder=""
                    {...field}
                    id="department"
                    onChange={(value: any) => {
                      field.onChange(value);
                    }}
                    isClearable
                    options={departmentOptions}
                  />
                )}
              />
              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department.message}</p>
              )}
            </div>
            <h6 className="font-extrabold text-off-black text-base">
              {t("fields.businessInterest.title")}
            </h6>
            <div className="">
              <Label className="mb-2 w-max font-medium cursor-pointer" required htmlFor="country">
                {t("fields.businessInterest.fields.countryInterest")}
              </Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    className="col-span-full w-full"
                    placeholder=""
                    {...field}
                    isClearable
                    options={countryOptions}
                  />
                )}
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
            </div>
            <h6 className="font-extrabold text-off-black text-base">
              {t("fields.businessInterest.fields.marketInterest")}
            </h6>
            <div className="space-y-2">
              {markets?.map((market: any) => (
                <Controller
                  name="market_interest"
                  key={market}
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={market}
                          // Check if the current option's value is in the form state array
                          checked={field?.value?.includes(market)}
                          onCheckedChange={(checked) => {
                            // Update the form state array based on whether it's checked
                            if (checked) {
                              field.onChange(field.value ? [...field.value, market] : [market]);
                            } else {
                              field.onChange(field?.value?.filter((val) => val !== market));
                            }
                          }}
                        />
                        <Label htmlFor={market} className="w-max font-medium cursor-pointer">
                          {market}
                        </Label>
                      </div>
                    );
                  }}
                />
              ))}
              {errors.market_interest && (
                <p className="text-red-500 text-sm">{errors.market_interest.message}</p>
              )}
            </div>
            <h6 className="font-extrabold text-off-black text-base">
              {t("fields.contactDetails.title")}
            </h6>
            <div className="">
              <Label required htmlFor="email" className="mb-2 w-max font-medium cursor-pointer">
                {t("fields.contactDetails.Email")}
              </Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder=""
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label
                required
                htmlFor="confirmEmail"
                className="mb-2 w-max font-medium cursor-pointer"
              >
                {t("fields.contactDetails.confirmEmail")}
              </Label>
              <Input
                {...register("confirmEmail")}
                id="confirmEmail"
                placeholder=""
                type="email"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.confirmEmail && (
                <p className="text-red-400 text-sm">{errors.confirmEmail?.message || ""}</p>
              )}
            </div>
            <div>
              <Label required className="mb-2 w-max font-medium cursor-pointer" htmlFor="mobile_no">
                {t("fields.contactDetails.mobileNo")}
              </Label>
              <Input
                {...register("mobile_no")}
                placeholder=""
                id="mobile_no"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.mobile_no && (
                <p className="text-red-400 text-sm">{errors.mobile_no?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label required htmlFor="password" className="mb-2 w-max font-medium cursor-pointer">
                {t("fields.contactDetails.password")}
              </Label>
              <PasswordInput
                {...register("password")}
                id="password"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password?.message || ""}</p>
              )}
            </div>
            <div>
              <Label
                required
                className="mb-2 w-max font-medium cursor-pointer"
                htmlFor="confirmPassword"
              >
                {t("fields.contactDetails.confirmPassword")}
              </Label>
              <PasswordInput
                {...register("confirmPassword")}
                id="confirmPassword"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Controller
              name="receive_updates"
              control={control}
              defaultValue={false}
              render={({ field, fieldState: { error } }) => (
                <div className="flex gap-3">
                  <Checkbox
                    id="receive_updates"
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(Boolean(val))}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="receive_updates"
                    className="text-medium-dark leading-snug cursor-pointer"
                  >
                    {t("fields.termsAndConditions")}
                  </Label>
                  {error && <p className="text-red-400 text-sm">{error.message}</p>}
                </div>
              )}
            />
            <Controller
              name="agree"
              control={control}
              defaultValue={false}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-2 mt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agree"
                      checked={field.value}
                      onCheckedChange={(val) => {
                        const isChecked = val === true;
                        field.onChange(isChecked);
                        if (isChecked) {
                          clearErrors("agree");
                        }
                        void trigger("agree");
                      }}
                      className="mt-1"
                    />
                    <Label
                      required
                      htmlFor="agree"
                      className="text-medium-dark leading-snug cursor-pointer"
                    >
                      <span>
                        {t("fields.privacyPolicy.text")}{" "}
                        <Link
                          href="/privacy-policy"
                          target="_blank"
                          className="inline-block text-secondary underline"
                        >
                          {t("fields.privacyPolicy.linkText")}
                        </Link>
                      </span>
                    </Label>
                  </div>
                  {error && <p className="text-red-400 text-sm">{error.message}</p>}
                </div>
              )}
            />
            {/* Submit */}
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              // className="bg-white hover:bg-gray-100 px-8 py-2 rounded-full font-semibold text-black"
            >
              {isSubmitting ? t("fields.buttons.loadingText") : t("fields.buttons.text")}
            </Button>
          </form>
          <div className="top-10 sticky flex flex-col justify-between md:h-[90vh]">
            <div className="hidden md:block relative w-full h-max">
              <Image
                src="/images/sign-in.jpg"
                alt="Login background"
                fill
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay */}
              <DotsOverlay className="bg-black/20">
                <div className="z-10 relative flex flex-col justify-center p-10 h-full text-white">
                  <h2 className="mb-4 font-bold text-2xl">{t("information.title")}</h2>

                  <p className="mb-6 font-medium text-white text-sm md:text-base">
                    {t("information.description.0")}
                  </p>

                  <p className="mb-6 font-medium text-white text-sm md:text-base">
                    {t("information.description.1")}
                  </p>
                  <p className="mb-1 font-medium text-white text-sm md:text-base">
                    {t("information.description.2")}
                  </p>
                  <p className="mb-6 font-medium text-white text-sm md:text-base">
                    {t("information.description.3")}
                  </p>
                  <Link
                    href="/login"
                    className="hover:bg-white p-1 px-2 border border-gray-300 w-max font-medium hover:text-secondary text-base transition"
                  >
                    {t("information.buttons.text")}
                  </Link>
                </div>
              </DotsOverlay>
            </div>{" "}
            <div className={"w-full h-35  max-sm:hidden"}>
              <DotsOverlay opacity={0.7} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
// grid md:grid-cols-2 gap-16
