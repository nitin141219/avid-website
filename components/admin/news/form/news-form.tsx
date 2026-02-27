"use client";

import ImageUpload from "@/components/ImageUpload";
import { dataURLtoBlob } from "@/components/MultilineText";
import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMAGE_DIMENSION } from "@/constants";
import { NEWS_SERVICES } from "@/services/admin/news/news.services";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/components/AvidToast";
import * as yup from "yup";

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const DEFAULT_AUTHOR = "Avid Organics";

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const newsSchema = yup.object({
  slug: yup
    .string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and can contain only letters, numbers, and hyphens"
    ),
  title_en: yup.string().required("English title is required"),
  title_de: yup.string().optional().default(""),
  title_fr: yup.string().optional().default(""),
  title_es: yup.string().optional().default(""),
  sub_title_en: yup.string().required("English subtitle is required"),
  sub_title_de: yup.string().optional().default(""),
  sub_title_fr: yup.string().optional().default(""),
  sub_title_es: yup.string().optional().default(""),
  content_en: yup.string().required("English content is required"),
  content_de: yup.string().optional().default(""),
  content_fr: yup.string().optional().default(""),
  content_es: yup.string().optional().default(""),
  author: yup.string().required("Author is required"),
  is_active: yup.boolean().required(),
  image: yup
    .mixed<FileList | string>()
    .required("Image is required")
    .test("file-check", "Image is required", (value) => {
      return value.length > 0;
    })
    .test("fileType", "Unsupported file format (.jpg, .png, .webp only)", (value) => {
      if (value instanceof FileList) {
        return value && SUPPORTED_IMAGE_TYPES.includes(value?.[0]?.type);
      }
      return true;
    }),
  image_mobile: yup
    .mixed<FileList | string>()
    .nullable()
    .defined()
    .default("")
    .test("fileType", "Unsupported file format (.jpg, .png, .webp only)", (value) => {
      if (!value) return true;
      if (value instanceof FileList) {
        return value.length === 0 || SUPPORTED_IMAGE_TYPES.includes(value?.[0]?.type);
      }
      return true;
    }),
});

type NewsFormValues = yup.InferType<typeof newsSchema>;

type NewsFormProps = {
  newsId?: string;
  newsData?: any;
};

export function NewsForm({ newsId, newsData }: NewsFormProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: yupResolver(newsSchema),
    defaultValues: {
      is_active: true,
      image_mobile: "",
      author: DEFAULT_AUTHOR,
    },
    mode: "onChange",
  });
  const image = watch("image");
  const mobileImage = watch("image_mobile");
  const titleEn = watch("title_en");

  useEffect(() => {
    if (newsId || isSlugManuallyEdited) return;
    setValue("slug", generateSlug(titleEn || ""), { shouldValidate: true });
  }, [isSlugManuallyEdited, newsId, setValue, titleEn]);
  // 🟡 Edit mode → load data
  useEffect(() => {
    if (!newsId) return;

    reset({
      slug: newsData.slug,
      title_en: newsData.title_en || newsData.title || "",
      title_de: newsData.title_de || "",
      title_fr: newsData.title_fr || "",
      title_es: newsData.title_es || "",
      sub_title_en: newsData.sub_title_en || newsData.sub_title || "",
      sub_title_de: newsData.sub_title_de || "",
      sub_title_fr: newsData.sub_title_fr || "",
      sub_title_es: newsData.sub_title_es || "",
      content_en: newsData.content_en || newsData.content || "",
      content_de: newsData.content_de || "",
      content_fr: newsData.content_fr || "",
      content_es: newsData.content_es || "",
      author: newsData.author || DEFAULT_AUTHOR,
      image: newsData.image, // string
      image_mobile: newsData.image_mobile || newsData.imageMobile || newsData.mobileImage || "",
    });
    setIsSlugManuallyEdited(true);

    () => {
      reset();
    };
  }, [newsId, reset]);

  const slugField = register("slug");

  const onSubmit = async (values: NewsFormValues) => {
    const formData = new FormData();
    const titleDe = values.title_de || values.title_en;
    const titleFr = values.title_fr || values.title_en;
    const titleEs = values.title_es || values.title_en;
    const subTitleDe = values.sub_title_de || values.sub_title_en;
    const subTitleFr = values.sub_title_fr || values.sub_title_en;
    const subTitleEs = values.sub_title_es || values.sub_title_en;
    const contentDe = values.content_de || values.content_en;
    const contentFr = values.content_fr || values.content_en;
    const contentEs = values.content_es || values.content_en;

    formData.append("slug", values.slug);
    formData.append("title", values.title_en);
    formData.append("sub_title", values.sub_title_en);
    formData.append("content", values.content_en);
    formData.append("title_en", values.title_en);
    formData.append("title_de", titleDe);
    formData.append("title_fr", titleFr);
    formData.append("title_es", titleEs);
    formData.append("sub_title_en", values.sub_title_en);
    formData.append("sub_title_de", subTitleDe);
    formData.append("sub_title_fr", subTitleFr);
    formData.append("sub_title_es", subTitleEs);
    formData.append("content_en", values.content_en);
    formData.append("content_de", contentDe);
    formData.append("content_fr", contentFr);
    formData.append("content_es", contentEs);
    formData.append("author", values.author);
    formData.append("is_active", String(values.is_active));

    const appendImageField = (
      key: "image" | "image_mobile",
      value: FileList | string | null | undefined
    ) => {
      if (!value) return;
      if (value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0]);
        }
        return;
      }
      if (typeof value === "string" && value.startsWith("data:")) {
        const blob = dataURLtoBlob(value);
        formData.append(key, blob, `${key}.png`);
        return;
      }
      if (typeof value === "string") {
        formData.append(key, value);
      }
    };

    appendImageField("image", values.image);
    appendImageField("image_mobile", values.image_mobile);

    try {
      if (newsId) {
        await NEWS_SERVICES.updateNews(newsId, formData);
        toast.success("News updated successfully");
      } else {
        await NEWS_SERVICES.createNews(formData);
        toast.success("News created successfully");
        reset();
        setIsSlugManuallyEdited(false);
      }
      router.push("/admin/news");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h1 className="mb-5 font-bold text-off-black text-2xl">
        {newsId ? "Edit News" : "Add News"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="gap-5 space-y-5 grid grid-cols-3">
        {/* Slug */}
        <div>
          <Label required className="mb-2 font-medium md:text-sm" htmlFor="slug">
            Slug
          </Label>
          <Input
            {...slugField}
            id="slug"
            placeholder="news-slug"
            className="bg-white border border-border"
            onChange={(e) => {
              setIsSlugManuallyEdited(true);
              slugField.onChange(e);
            }}
          />
          {errors.slug && <p className="mt-1 text-red-500 text-sm">{errors.slug.message}</p>}
        </div>

        {/* Title */}
        <div>
          <Label required className="mb-2 font-medium md:text-sm">
            Title
          </Label>
          <Input
            {...register("title_en")}
            placeholder="Enter title"
            className="bg-white border border-border"
          />
          {errors.title_en && <p className="mt-1 text-red-500 text-sm">{errors.title_en.message}</p>}
        </div>

        {/* Sub Title */}
        <div>
          <Label required className="mb-2 font-medium md:text-sm">
            Sub Title
          </Label>
          <Input
            {...register("sub_title_en")}
            placeholder="Enter sub title"
            className="bg-white border border-border"
          />
          {errors.sub_title_en && <p className="mt-1 text-red-500 text-sm">{errors.sub_title_en.message}</p>}
        </div>

        {/* Author */}
        <div>
          <Label required className="mb-2 font-medium md:text-sm">
            Author
          </Label>
          <Input
            {...register("author")}
            placeholder="Author name"
            className="bg-white border border-border"
          />
          {errors.author && <p className="mt-1 text-red-500 text-sm">{errors.author.message}</p>}
        </div>
        <div>
          <ImageUpload
            width={IMAGE_DIMENSION.NEWS.width}
            height={IMAGE_DIMENSION.NEWS.height}
            maxSizeMB={10}
            label="Image"
            inputId="news-image"
            error={errors.image?.message}
            onUploadSuccess={(croppedImage) => {
              setValue("image", croppedImage);
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
            width={IMAGE_DIMENSION.NEWS.width}
            height={IMAGE_DIMENSION.NEWS.height}
            maxSizeMB={10}
            label="Mobile Image"
            inputId="news-image-mobile"
            required={false}
            error={errors.image_mobile?.message}
            onUploadSuccess={(croppedImage) => {
              setValue("image_mobile", croppedImage);
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
        {/* Active Status */}
        <div className="flex items-center gap-2">
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => {
              return (
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="status"
                    checked={field?.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                    }}
                  />
                  <Label htmlFor="status" className="w-max font-medium cursor-pointer">
                    Active
                  </Label>
                </div>
              );
            }}
          />
        </div>
        <div className="col-span-full">
          <Label required className="mb-2 font-medium md:text-sm">
            Content
          </Label>
          <Controller
            name="content_en"
            control={control}
            render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.content_en && <p className="mt-1 text-red-500 text-sm">{errors.content_en.message}</p>}
        </div>

        {/* File Upload (your exact pattern) */}
        <div className="flex justify-end col-span-full">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : newsId ? "Update News" : "Create News"}
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
            <Dialog.Title className="mb-4 font-semibold text-white text-xl"></Dialog.Title>
            <div className="relative">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Full View"
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
