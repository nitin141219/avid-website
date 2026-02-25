"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { PasswordInput } from "@/components/password-input/password-input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/AvidToast";
import * as yup from "yup";

type ResetPasswordProps = {
  token: string;
};

export default function ResetPassword({ token }: ResetPasswordProps) {
  const router = useRouter();
  const t = useTranslations("forgot_password");
  const tLogin = useTranslations("login");

  const schema = useMemo(
    () =>
      yup.object({
        password: yup.string().required(t("validation.passwordRequired")),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password")], t("validation.passwordsMatch"))
          .required(t("validation.confirmPasswordRequired")),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ ...values, token }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || t("toast.invalidToken"));
        return;
      }

      toast.success(data?.message || t("toast.successReset"));
      router.push("/login");
    } catch {
      toast.error(t("toast.error"));
    }
  };

  return (
    <section>
      <div className="py-16 container-inner">
        <div className="flex items-end mb-12">
          <Image
            src="/A.png"
            alt="Logo"
            width={60}
            height={60}
            preload
            className="mr-1 mb-1 transition-all duration-300"
            unoptimized
          />
          <h1 className="font-normal text-medium-dark text-3xl md:text-4xl leading-none">
            {tLogin("mainTitle")}
          </h1>
        </div>
        <h2 className="mb-4 font-extrabold text-primary text-2xl md:text-3xl">{t("resetTitle")}</h2>
        <div className="gap-10 grid grid-cols-1 md:grid-cols-2 bg-gray-section p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5 w-full text-white">
            <div className="">
              <Label required htmlFor="password" className="mb-2 w-max font-bold cursor-pointer">
                {t("newPasswordLabel")}
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
            <div className="">
              <Label
                required
                htmlFor="confirmPassword"
                className="mb-2 w-max font-bold cursor-pointer"
              >
                {t("confirmPasswordLabel")}
              </Label>
              <PasswordInput
                {...register("confirmPassword")}
                id="confirmPassword"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword?.message || ""}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              className="mt-2 w-full text-base"
            >
              {isSubmitting ? t("resettingButton") : t("resetButton")}
            </Button>
          </form>
          <div className="hidden md:block relative">
            <Image
              src="/images/log-in.jpg"
              alt="Login background"
              fill
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <DotsOverlay className="bg-black/20">
              <div className="z-10 relative flex flex-col justify-center p-10 h-full text-white">
                <h2 className="mb-4 font-semibold text-2xl">{tLogin("information.title")}</h2>

                <p className="mb-6 max-w-md text-gray-200 text-sm">{t("secureAccount")}</p>

                <p className="mb-3 font-medium text-sm">{tLogin("information.benefits.title")}</p>

                <ul className="space-y-2 text-sm">
                  {(tLogin.raw("information.benefits.items") as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex justify-center items-center bg-white mt-1 border border-white rounded-sm size-4 text-secondary text-xs">
                        <Check size={16} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </DotsOverlay>
          </div>
        </div>
      </div>
    </section>
  );
}
