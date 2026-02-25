"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { ForgotPasswordModal } from "@/components/forgot-password/ForgotPassword";
import { PasswordInput } from "@/components/password-input/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { downloadFn } from "@/lib/downloadFn";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/AvidToast";
import * as yup from "yup";
import { useAuth } from "../auth-context";

function Login() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const schema = yup.object({
    email: yup
      .string()
      .required(t("emailRequired"))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("emailInvalid")),
    password: yup.string().required(t("passwordRequired")),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { refreshAuth } = useAuth();

  const onSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.errorCode === "AUTH_INVALID_CREDENTIALS") {
          toast.error(t("toast.invalidCredentials"));
          return;
        }
        if (data?.errorCode === "AUTH_LOGIN_FAILED") {
          toast.error(t("toast.loginFailed"));
          return;
        }
        toast.error(data?.message || t("toast.loginFailed"));
        return;
      }
      toast.success(data?.message || "Logged in successfully!");
      refreshAuth();

      const pendingDownloadSlug =
        typeof window !== "undefined" ? window.sessionStorage.getItem("pendingDownloadSlug") : null;
      const pendingDownloadMetaRaw =
        typeof window !== "undefined" ? window.sessionStorage.getItem("pendingDownloadMeta") : null;

      if (pendingDownloadSlug) {
        let pendingDownloadMeta: { title?: string; productTitle?: string; pagePath?: string } = {};
        if (pendingDownloadMetaRaw) {
          try {
            pendingDownloadMeta = JSON.parse(pendingDownloadMetaRaw);
          } catch {
            pendingDownloadMeta = {};
          }
        }

        downloadFn(pendingDownloadSlug, {
          userKey: String(values?.email || "").trim().toLowerCase(),
          title: pendingDownloadMeta.title,
          productTitle: pendingDownloadMeta.productTitle,
          pagePath: pendingDownloadMeta.pagePath,
        });
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem("pendingDownloadSlug");
          window.sessionStorage.removeItem("pendingDownloadMeta");
        }
      }

      const returnTo = searchParams?.get("returnTo");
      router.push(returnTo || "/media/downloads");
    } catch {
      toast.error(t("toast.networkError"));
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
            className="mr-1 transition-all duration-300"
            unoptimized
          />
          <h1 className="font-normal text-medium-dark text-3xl md:text-4xl leading-none">
            {t("mainTitle")}
          </h1>
        </div>
        <h2 className="mb-4 font-extrabold text-primary text-2xl md:text-3xl">{t("loginTitle")}</h2>
        <div className="gap-10 grid grid-cols-1 lg:grid-cols-2 bg-gray-section p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5 w-full text-white">
            <div className="">
              <Label required htmlFor="email" className="mb-2 w-max font-bold cursor-pointer">
                {t("fields.email.label")}
              </Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                className="bg-white backdrop-blur-xs border border-white placeholder:font-light text-black placeholder:text-light-dark"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email?.message || ""}</p>
              )}
            </div>
            <div className="">
              <Label required htmlFor="password" className="mb-2 w-max font-bold cursor-pointer">
                {t("fields.password.label")}
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

            {/* Submit */}
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              className="mt-2 w-full text-base"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
            <Button
              variant="link"
              type="button"
              className="block mt-2 p-0 w-max h-max md:h-max font-bold text-off-black text-base"
              onClick={() => {
                setOpen(true);
              }}
            >
              {t("buttons.forgotPassword")}
            </Button>
            <Link
              href="/signup"
              className="block w-max font-bold text-off-black hover:underline underline-offset-4"
            >
              {t("buttons.signUp")}
            </Link>
          </form>
          <div className="hidden lg:block relative">
            <Image
              src="/images/log-in.jpg"
              alt="Login background"
              fill
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <DotsOverlay className="bg-black/20">
              <div className="z-10 relative flex flex-col justify-center p-10 h-full text-white">
                <h2 className="mb-4 font-semibold text-2xl">{t("information.title")}</h2>

                <p className="mb-6 max-w-md text-gray-200 text-sm">
                  {t("information.description")}
                </p>

                <p className="mb-3 font-medium text-sm">{t("information.benefits.title")}</p>

                <ul className="space-y-2 text-sm">
                  {t.raw("information.benefits.items")?.map((item: string, i: number) => (
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
      <ForgotPasswordModal
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      />
    </section>
  );
}

export default Login;
// grid md:grid-cols-2 gap-16
