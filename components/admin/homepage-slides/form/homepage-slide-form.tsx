"use client";

import { toast } from "@/components/AvidToast";
import ImageUpload from "@/components/ImageUpload";
import { dataURLtoBlob } from "@/components/MultilineText";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMAGE_DIMENSION } from "@/constants";
import { HOMEPAGE_SLIDES_SERVICES } from "@/services/admin/homepage-slides/homepage-slides.services";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const homepageSlideSchema = yup.object({
  title_en: yup.string().required("English title is required"),
  title_de: yup.string().optional().default(""),
  title_fr: yup.string().optional().default(""),
  title_es: yup.string().optional().default(""),
  cta_text_en: yup.string().required("English CTA text is required"),
  cta_text_de: yup.string().optional().default(""),
  cta_text_fr: yup.string().optional().default(""),
  cta_text_es: yup.string().optional().default(""),
  cta_link: yup.string().required("CTA link is required"),
  position: yup
    .number()
    .typeError("Position must be a number")
    .required("Position is required")
    .min(1, "Position must be at least 1"),
  align: yup.string().oneOf(["left", "right"]).required("Alignment is required"),
  is_active: yup.boolean().required(),
  image: yup
    .mixed<FileList | string>()
    .required("Image is required")
    .test("file-check", "Image is required", (value: any) => {
      if (typeof value === "string") return value.length > 0;
      return !!value;
    }),
  image_mobile: yup.mixed<FileList | string>().nullable().defined().default(""),
});

type HomepageSlideFormValues = yup.InferType<typeof homepageSlideSchema>;

type HomepageSlideFormProps = {
  slideId?: string;
};

export function HomepageSlideForm({ slideId }: HomepageSlideFormProps) {
  const router = useRouter();
  const [loadingSlide, setLoadingSlide] = useState(!!slideId);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HomepageSlideFormValues>({
    resolver: yupResolver(homepageSlideSchema),
    defaultValues: {
      align: "left",
      image: "",
      is_active: true,
      position: 1,
      image_mobile: "",
      title_en: "",
      title_de: "",
      title_fr: "",
      title_es: "",
      cta_text_en: "",
      cta_text_de: "",
      cta_text_fr: "",
      cta_text_es: "",
    },
    mode: "onChange",
  });

  const image = watch("image");
  const mobileImage = watch("image_mobile");

  useEffect(() => {
    if (!slideId) return;

    const loadSlide = async () => {
      setLoadingSlide(true);
      try {
        const slide = await HOMEPAGE_SLIDES_SERVICES.getSlide(slideId);
        reset({
          title_en: slide?.title_en || slide?.title || "",
          title_de: slide?.title_de || "",
          title_fr: slide?.title_fr || "",
          title_es: slide?.title_es || "",
          cta_text_en: slide?.cta_text_en || slide?.cta_text || "",
          cta_text_de: slide?.cta_text_de || "",
          cta_text_fr: slide?.cta_text_fr || "",
          cta_text_es: slide?.cta_text_es || "",
          cta_link: slide?.cta_link || "",
          position: slide?.position || 1,
          align: slide?.align || "left",
          is_active: slide?.is_active ?? true,
          image: slide?.image || "",
          image_mobile: slide?.image_mobile || slide?.imageMobile || slide?.mobileImage || "",
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to load homepage slide");
        router.push("/admin/homepage-slides");
      } finally {
        setLoadingSlide(false);
      }
    };

    loadSlide();
  }, [reset, router, slideId]);

  const onSubmit = async (values: HomepageSlideFormValues) => {
    const formData = new FormData();
    const titleDe = values.title_de || values.title_en;
    const titleFr = values.title_fr || values.title_en;
    const titleEs = values.title_es || values.title_en;
    const ctaTextDe = values.cta_text_de || values.cta_text_en;
    const ctaTextFr = values.cta_text_fr || values.cta_text_en;
    const ctaTextEs = values.cta_text_es || values.cta_text_en;

    formData.append("title", values.title_en);
    formData.append("title_en", values.title_en);
    formData.append("title_de", titleDe);
    formData.append("title_fr", titleFr);
    formData.append("title_es", titleEs);
    formData.append("cta_text", values.cta_text_en);
    formData.append("cta_text_en", values.cta_text_en);
    formData.append("cta_text_de", ctaTextDe);
    formData.append("cta_text_fr", ctaTextFr);
    formData.append("cta_text_es", ctaTextEs);
    formData.append("cta_link", values.cta_link);
    formData.append("position", String(values.position));
    formData.append("align", values.align);
    formData.append("is_active", String(values.is_active));

    if (values.image instanceof FileList && values.image.length > 0) {
      formData.append("image", values.image[0]);
    } else if (typeof values.image === "string" && values.image.startsWith("data:")) {
      formData.append("image", dataURLtoBlob(values.image), "image.png");
    }

    if (values.image_mobile instanceof FileList && values.image_mobile.length > 0) {
      formData.append("image_mobile", values.image_mobile[0]);
    } else if (
      typeof values.image_mobile === "string" &&
      values.image_mobile.startsWith("data:")
    ) {
      formData.append("image_mobile", dataURLtoBlob(values.image_mobile), "image_mobile.png");
    }

    try {
      if (slideId) {
        await HOMEPAGE_SLIDES_SERVICES.updateSlide(slideId, formData);
        toast.success("Homepage slide updated successfully");
      } else {
        await HOMEPAGE_SLIDES_SERVICES.createSlide(formData);
        toast.success("Homepage slide created successfully");
        reset({
          title_en: "",
          title_de: "",
          title_fr: "",
          title_es: "",
          cta_text_en: "",
          cta_text_de: "",
          cta_text_fr: "",
          cta_text_es: "",
          cta_link: "",
          position: 1,
          align: "left",
          image: "",
          is_active: true,
          image_mobile: "",
        });
      }

      router.push("/admin/homepage-slides");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (loadingSlide) {
    return <div className="text-sm">Loading slide...</div>;
  }

  return (
    <div>
      <h1 className="mb-5 font-bold text-off-black text-2xl">
        {slideId ? "Edit Homepage Slide" : "Add Homepage Slide"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-off-black text-lg">English</h2>
            <p className="text-light-dark text-sm">Primary content for the slide.</p>
          </div>

          <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
            <div>
              <Label required className="mb-2 font-medium md:text-sm">
                Title
              </Label>
              <Input
                {...register("title_en")}
                placeholder="Enter slide title"
                className="bg-white border border-border"
              />
              {errors.title_en && (
                <p className="mt-1 text-red-500 text-sm">{errors.title_en.message}</p>
              )}
            </div>

            <div>
              <Label required className="mb-2 font-medium md:text-sm">
                CTA Text
              </Label>
              <Input
                {...register("cta_text_en")}
                placeholder="Enter CTA text"
                className="bg-white border border-border"
              />
              {errors.cta_text_en && (
                <p className="mt-1 text-red-500 text-sm">{errors.cta_text_en.message}</p>
              )}
            </div>

            <div>
              <Label required className="mb-2 font-medium md:text-sm">
                CTA Link
              </Label>
              <Input
                {...register("cta_link")}
                placeholder="/contact-us"
                className="bg-white border border-border"
              />
              {errors.cta_link && (
                <p className="mt-1 text-red-500 text-sm">{errors.cta_link.message}</p>
              )}
            </div>

            <div>
              <Label required className="mb-2 font-medium md:text-sm">
                Position
              </Label>
              <Input
                {...register("position")}
                type="number"
                min={1}
                className="bg-white border border-border"
              />
              {errors.position && (
                <p className="mt-1 text-red-500 text-sm">{errors.position.message}</p>
              )}
            </div>

            <div>
              <Label required className="mb-2 font-medium md:text-sm">
                Text Alignment
              </Label>
              <select
                {...register("align")}
                className="bg-white px-3 border border-border rounded-md w-full h-10"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              {errors.align && (
                <p className="mt-1 text-red-500 text-sm">{errors.align.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-8">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="slide-status"
                      checked={field?.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                    <Label htmlFor="slide-status" className="w-max font-medium cursor-pointer">
                      Active
                    </Label>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="gap-5 grid grid-cols-1 lg:grid-cols-3">
          <div className="space-y-4 bg-gray-section/30 p-5 border border-border rounded-xl">
            <div>
              <h3 className="font-semibold text-off-black text-base">German</h3>
              <p className="text-light-dark text-sm">Leave blank to fall back to English.</p>
            </div>

            <div>
              <Label className="mb-2 font-medium md:text-sm">Title</Label>
              <Input
                {...register("title_de")}
                placeholder="Falls back to English if empty"
                className="bg-white border border-border"
              />
              {errors.title_de && (
                <p className="mt-1 text-red-500 text-sm">{errors.title_de.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 font-medium md:text-sm">CTA Text</Label>
              <Input
                {...register("cta_text_de")}
                placeholder="Falls back to English if empty"
                className="bg-white border border-border"
              />
              {errors.cta_text_de && (
                <p className="mt-1 text-red-500 text-sm">{errors.cta_text_de.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-gray-section/30 p-5 border border-border rounded-xl">
            <div>
              <h3 className="font-semibold text-off-black text-base">French</h3>
              <p className="text-light-dark text-sm">Leave blank to fall back to English.</p>
            </div>

            <div>
              <Label className="mb-2 font-medium md:text-sm">Title</Label>
              <Input
                {...register("title_fr")}
                placeholder="Falls back to English if empty"
                className="bg-white border border-border"
              />
              {errors.title_fr && (
                <p className="mt-1 text-red-500 text-sm">{errors.title_fr.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 font-medium md:text-sm">CTA Text</Label>
              <Input
                {...register("cta_text_fr")}
                placeholder="Falls back to English if empty"
                className="bg-white border border-border"
              />
              {errors.cta_text_fr && (
                <p className="mt-1 text-red-500 text-sm">{errors.cta_text_fr.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-gray-section/30 p-5 border border-border rounded-xl">
            <div>
              <h3 className="font-semibold text-off-black text-base">Spanish</h3>
              <p className="text-light-dark text-sm">Leave blank to fall back to English.</p>
            </div>

            <div>
              <Label className="mb-2 font-medium md:text-sm">Title</Label>
              <Input
                {...register("title_es")}
                placeholder="Falls back to English if empty"
                className="bg-white border border-border"
              />
              {errors.title_es && (
                <p className="mt-1 text-red-500 text-sm">{errors.title_es.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 font-medium md:text-sm">CTA Text</Label>
              <Input
                {...register("cta_text_es")}
                placeholder="Falls back to English if empty"
                className="bg-white border border-border"
              />
              {errors.cta_text_es && (
                <p className="mt-1 text-red-500 text-sm">{errors.cta_text_es.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
          <div>
            <ImageUpload
              width={IMAGE_DIMENSION.HOMEPAGE_SLIDE.width}
              height={IMAGE_DIMENSION.HOMEPAGE_SLIDE.height}
              maxSizeMB={10}
              label="Desktop Image"
              inputId="homepage-slide-image"
              error={errors.image?.message as string | undefined}
              onUploadSuccess={(croppedImage) => {
                setValue("image", croppedImage as any, { shouldValidate: true });
              }}
            />
            {typeof image === "string" && image ? (
              <div className="mt-2">
                <Button
                  type="button"
                  onClick={() => setPreviewImage(image)}
                  className="flex bg-secondary mt-2 ml-auto px-2 py-1 w-fit h-auto font-normal text-white text-sm"
                >
                  View Image
                </Button>
              </div>
            ) : null}
          </div>

          <div>
            <ImageUpload
              width={IMAGE_DIMENSION.HOMEPAGE_SLIDE_MOBILE.width}
              height={IMAGE_DIMENSION.HOMEPAGE_SLIDE_MOBILE.height}
              maxSizeMB={10}
              label="Mobile Image"
              inputId="homepage-slide-image-mobile"
              required={false}
              error={errors.image_mobile?.message as string | undefined}
              onUploadSuccess={(croppedImage) => {
                setValue("image_mobile", croppedImage as any, { shouldValidate: true });
              }}
            />
            {typeof mobileImage === "string" && mobileImage ? (
              <div className="mt-2">
                <Button
                  type="button"
                  onClick={() => setPreviewImage(mobileImage)}
                  className="flex bg-secondary mt-2 ml-auto px-2 py-1 w-fit h-auto font-normal text-white text-sm"
                >
                  View Mobile Image
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : slideId ? "Update Slide" : "Create Slide"}
          </Button>
        </div>
      </form>

      <Dialog.Root
        open={!!previewImage}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewImage(null);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="z-200 fixed inset-0 bg-black/90 backdrop-blur-sm" />
          <Dialog.Content className="top-1/2 left-1/2 z-201 fixed w-[90vw] max-w-5xl -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Slide Preview"
                  width={1600}
                  height={900}
                  sizes="90vw"
                  className="shadow-2xl rounded-lg w-full h-auto"
                />
              ) : null}
              <button
                onClick={() => setPreviewImage(null)}
                className="-top-12 right-0 absolute flex items-center gap-2 text-white hover:text-slate-300 transition"
              >
                <X className="w-6 h-6" /> Close Preview
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
