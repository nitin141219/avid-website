"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type ForgotPasswordModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
  titleOverride?: string;
};

export function ForgotPasswordModal({ open, onOpenChange, email, titleOverride }: ForgotPasswordModalProps) {
  const t = useTranslations("forgot_password");
  const [isSuccess, setIsSuccess] = useState(false);
  const schema = yup.object({
    email: yup
      .string()
      .required(t("emailRequired"))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("emailInvalid")),
  });

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    reset();
    if (email) {
      setValue("email", email);
    }
  }, [open, email, reset, setValue]);

  useEffect(() => {
    reset();
  }, [open]);

  const onSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        toast.success(data?.message || "Reset link sent successfully");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      reset();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(data) => {
        onOpenChange(data);
        setIsSuccess(false);
      }}
    >
      {/* Custom overlay style for lighter background */}
      <style>{`.dialog-overlay[data-slot="dialog-overlay"] { background: rgba(255,255,255,0.7) !important; }`}</style>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="sm-max-w-md bg-white shadow-lg"
        style={{ padding: 0 }}
        overlayClassName="bg-white bg-opacity-80 !bg-black/0"
      >
        {isSubmitSuccessful && isSuccess ? (
          <div className="relative flex flex-col items-center gap-3 px-4 py-10 rounded-lg">
            <div className="flex justify-center items-center bg-green-100 rounded-full size-20">
              <Check className="size-12 text-green-600" />
            </div>

            {/* Text */}
            <p className="font-medium text-green-700 text-base">{t("success")}</p>
          </div>
        ) : (
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="font-bold"> {titleOverride || t("title")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-4 mb-6">
                <Label
                  required
                  htmlFor="email-add"
                  className="mb-2 w-max font-medium cursor-pointer"
                >
                  {t("emailLabel")}
                </Label>
                <Input
                  {...register("email")}
                  id="email-add"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="bg-white backdrop-blur-xs border border-border placeholder:font-light text-black placeholder:text-light-dark"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email?.message || ""}</p>
                )}
              </div>

              <Button
                type="submit"
                variant={"secondary"}
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("buttonLoading") : t("button")}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
