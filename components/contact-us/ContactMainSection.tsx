"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import countryList from "react-select-country-list";
import { toast } from "sonner";
import * as yup from "yup";
import CustomSelect from "../custom-select/CustomSelect";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function ContactMainSection() {
  const t = useTranslations("contact_us");

  const schema = useMemo(
    () =>
      yup.object().shape({
        first_name: yup
          .string()
          .required(t("form.validation.first_name_required"))
          .trim(t("form.validation.first_name_required"))
          .min(3, t("form.validation.first_name_min")),
        last_name: yup
          .string()
          .required(t("form.validation.last_name_required"))
          .trim(t("form.validation.last_name_required"))
          .min(3, t("form.validation.last_name_min")),
        company: yup
          .string()
          .required(t("form.validation.company_required"))
          .trim(t("form.validation.company_required"))
          .min(3, t("form.validation.company_min")),
        country: yup.object().nullable().required(t("form.validation.country_required")),
        contact_method: yup.array().min(1, t("form.validation.contact_method_min")),
        phone_number: yup
          .string()
          .required(t("form.validation.phone_required"))
          .matches(/^[0-9]+$/, t("form.validation.phone_digits"))
          .min(10, t("form.validation.phone_min"))
          .max(15, t("form.validation.phone_max")),
        email_address: yup
          .string()
          .required(t("form.validation.email_required"))
          .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("form.validation.email_invalid")),
        departments: yup.array().min(1, t("form.validation.department_min")),
        message: yup
          .string()
          .required(t("form.validation.message_required"))
          .trim(t("form.validation.message_required")),
        agree: yup.boolean().oneOf([true], t("form.validation.agree_required")).required(),
        receive_updates: yup.boolean().oneOf([true, false]),
      }),
    [t]
  );

  const departmentOptions = useMemo(
    () => [
      {
        id: "product-technical",
        value: t("form.departments.product_technical"),
        label: t("form.departments.product_technical"),
      },
      {
        id: "sales-quotations",
        value: t("form.departments.sales_quotations"),
        label: t("form.departments.sales_quotations"),
      },
      {
        id: "quality-regulatory",
        value: t("form.departments.quality_regulatory"),
        label: t("form.departments.quality_regulatory"),
      },
      {
        id: "procurement-supply-chain",
        value: t("form.departments.procurement_supply_chain"),
        label: t("form.departments.procurement_supply_chain"),
      },
      {
        id: "human-resources",
        value: t("form.departments.human_resources"),
        label: t("form.departments.human_resources"),
      },
      {
        id: "hse",
        value: t("form.departments.hse"),
        label: t("form.departments.hse"),
      },
      {
        id: "sustainability",
        value: t("form.departments.sustainability"),
        label: t("form.departments.sustainability"),
      },
      {
        id: "media-public-relations",
        value: t("form.departments.media_public_relations"),
        label: t("form.departments.media_public_relations"),
      },
      {
        id: "general-inquiries",
        value: t("form.departments.general_inquiries"),
        label: t("form.departments.general_inquiries"),
      },
    ],
    [t]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      contact_method: [],
      departments: [],
      receive_updates: false,
      agree: false,
    },
  });

  const countryOptions = useMemo(() => countryList().getData(), []);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        company: values.company,
        country: values.country?.label,
        preferred_contact_method: values.contact_method,
        phone_number: values.phone_number,
        email: values.email_address,
        inquiry_type: values.departments?.map((item: any) => item.value),
        message: values.message,
        receive_updates: values.receive_updates,
        agree_to_privacy_policy: values.agree,
      };

      const res = await fetch("/api/contact-us", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.errorCode === "PRIVACY_POLICY_REQUIRED") {
          toast.error(t("form.validation.agree_required"));
          return;
        }
        toast.error(data?.message || "Something went wrong. Please try again.");
        return;
      }
      toast.success(data?.message || "Thank you for contacting us!");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section>
      <div className="gap-16 grid md:grid-cols-2 py-16 container-inner">
        {/* Top section */}
        <div>
          <div className="w-full">
            <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">
              {t("hero.title")}
            </h2>
            <div className="bg-light-dark my-3 w-12 h-px"></div>
            <p className="mt-2 font-medium text-medium-dark leading-relaxed">
              {t("hero.subtitle1")}
            </p>
            <p className="mt-4 font-medium text-medium-dark leading-relaxed">
              {t("hero.subtitle2")}
            </p>
          </div>
          <div className="space-y-16 py-16 w-full">
            <h2 className="font-extrabold text-primary text-2xl md:text-3xl">
              {t("global_locations.title")}
            </h2>
            <div>
              <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">INDIA</h2>
              <div className="bg-light-dark my-3 w-12 h-px"></div>
              <p className="mt-2 font-bold text-off-black leading-relaxed">Corporate Office</p>
              <p className="mt-2 font-medium text-medium-dark leading-relaxed">
                Avid Organics Private Limited <br />
                409/410 Sears Towers, Sevasi
                <br />
                Vadodara – 391 101, Gujarat, India
              </p>
              <div className="space-y-2 mt-5 text-off-black">
                <a
                  href={`tel:+91-265-2370829`}
                  className="flex items-center gap-2 font-medium hover:text-primary hover:underline transition"
                >
                  <Phone size={20} /> +91-265-2370829
                </a>

                {/* Email Button with email */}
                <a
                  href={`mailto:info@avidorganics.net`}
                  target="_blank"
                  className="flex items-center gap-2 font-medium hover:text-primary hover:underline transition"
                >
                  <Mail size={20} /> info@avidorganics.net
                </a>
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">NETHERLANDS</h2>
              <div className="bg-light-dark my-3 w-12 h-px"></div>
              <p className="mt-2 font-bold text-off-black leading-relaxed">Regional Sales Office</p>
              <p className="mt-2 font-medium text-medium-dark leading-relaxed">
                Avid Organics <br />
                Avenue Ceramique 221
                <br />
                6221 KX Maastricht <br />
                The Netherlands
              </p>
              <div className="space-y-2 mt-5 text-off-black">
                {/* Email Button with email */}
                <a
                  href={`mailto:info@avidorganics.net`}
                  target="_blank"
                  className="flex items-center gap-2 font-medium hover:text-primary hover:underline transition"
                >
                  <Mail size={20} /> info@avidorganics.net
                </a>
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">UNITED STATES</h2>
              <div className="bg-light-dark my-3 w-12 h-px"></div>
              <p className="mt-2 font-bold text-off-black leading-relaxed">Regional Sales Office</p>
              <p className="mt-2 font-medium text-medium-dark leading-relaxed">
                Avid Organics America Inc. <br />
                5021 Vernon Avenue S, #209
                <br />
                Edina, MN 55436-2102
                <br />
                United States
              </p>
              <div className="space-y-2 mt-5 text-off-black">
                {/* Email Button with email */}
                <a
                  href={`mailto:info@avidorganics.net`}
                  target="_blank"
                  className="flex items-center gap-2 font-medium hover:text-primary hover:underline transition"
                >
                  <Mail size={20} /> info@avidorganics.net
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-section p-6">
          <h2 className="mb-4 font-extrabold text-off-black text-2xl md:text-3xl">
            {t("form.title")}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full text-white">
            <div>
              <Label required htmlFor="first_name" className="mb-2 w-max font-bold cursor-pointer">
                {t("form.labels.first_name")}
              </Label>
              <Input
                {...register("first_name")}
                id="first_name"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.first_name && (
                <p className="text-red-400 text-sm">{errors.first_name?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label required htmlFor="last_name" className="mb-2 w-max font-bold cursor-pointer">
                {t("form.labels.last_name")}
              </Label>
              <Input
                {...register("last_name")}
                id="last_name"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.last_name && (
                <p className="text-red-400 text-sm">{errors.last_name?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label required htmlFor="company" className="mb-2 w-max font-bold cursor-pointer">
                {t("form.labels.company")}
              </Label>
              <Input
                {...register("company")}
                id="company"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.company && (
                <p className="text-red-400 text-sm">{errors.company?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label required className="mb-2 w-max font-bold cursor-pointer" htmlFor="country">
                {t("form.labels.country")}
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
              {errors.country && (
                <p className="text-red-400 text-sm">{errors.country?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label required className="w-max font-bold">
                {t("form.labels.contact_method")}
              </Label>
              <div className="flex gap-20 mt-4">
                {/* EMAIL */}
                <Controller
                  name="contact_method"
                  control={control}
                  render={({ field }) => {
                    const methods = field.value || [];
                    const isChecked = methods.includes("email");

                    return (
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="email"
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) field.onChange([...methods, "email"]);
                            else field.onChange(methods.filter((m) => m !== "email"));
                          }}
                        />
                        <Label htmlFor="email" className="text-medium-dark cursor-pointer">
                          {t("form.labels.email")}
                        </Label>
                      </div>
                    );
                  }}
                />

                {/* PHONE */}
                <Controller
                  name="contact_method"
                  control={control}
                  render={({ field }) => {
                    const methods = field.value || [];
                    const isChecked = methods.includes("phone");

                    return (
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="phone"
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) field.onChange([...methods, "phone"]);
                            else field.onChange(methods.filter((m) => m !== "phone"));
                          }}
                        />
                        <Label htmlFor="phone" className="text-medium-dark cursor-pointer">
                          {t("form.labels.phone")}
                        </Label>
                      </div>
                    );
                  }}
                />
              </div>

              {errors.contact_method && (
                <p className="text-red-400 text-sm">{errors.contact_method?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label
                required
                className="mb-2 w-max font-bold cursor-pointer"
                htmlFor="phone_number"
              >
                {t("form.labels.phone_number")}
              </Label>
              <Input
                {...register("phone_number")}
                id="phone_number"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.phone_number && (
                <p className="text-red-400 text-sm">{errors.phone_number?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label
                required
                className="mb-2 w-max font-bold cursor-pointer"
                htmlFor="email_address"
              >
                {t("form.labels.email_address")}
              </Label>
              <Input
                {...register("email_address")}
                id="email_address"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.email_address && (
                <p className="text-red-400 text-sm">{errors.email_address?.message || ""}</p>
              )}
            </div>
            <div className="space-y-4">
              <Label required className="w-max font-bold">
                {t("form.labels.department")}
              </Label>
              <Controller
                name="departments"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    className="col-span-full w-full"
                    placeholder=""
                    {...field}
                    isMulti
                    options={departmentOptions}
                  />
                )}
              />
              {errors.departments && (
                <p className="text-red-400 text-sm">{errors.departments?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label required htmlFor="message" className="mb-2 w-max font-bold cursor-pointer">
                {t("form.labels.message")}
              </Label>
              <Textarea
                placeholder={t("form.placeholders.message")}
                {...register("message")}
                id="message"
                className="bg-white backdrop-blur-xs border border-white h-30 placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.message && (
                <p className="text-red-400 text-sm">{errors.message?.message || ""}</p>
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
                    onCheckedChange={(val) => field.onChange(val)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="receive_updates"
                    className="text-medium-dark leading-snug cursor-pointer"
                  >
                    {t("form.labels.receive_updates")}
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
                      onCheckedChange={(val) => field.onChange(val === true)}
                      className="mt-1"
                    />
                    <Label
                      required
                      htmlFor="agree"
                      className="text-medium-dark leading-snug cursor-pointer"
                    >
                      <span>
                        {t("form.labels.agree")}{" "}
                        <Link
                          href="http://localhost:3000/en/privacy-policy"
                          target="_blank"
                          className="inline-block text-secondary underline"
                        >
                          {t("form.labels.privacy_policy")}
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
              {isSubmitting ? t("form.buttons.submitting") : t("form.buttons.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
