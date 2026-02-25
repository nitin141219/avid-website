"use client";

import FileInput from "@/components/file-input";
import ImageUpload from "@/components/ImageUpload";
import { dataURLtoBlob } from "@/components/MultilineText";
import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMAGE_DIMENSION } from "@/constants";
import { EVENTS_SERVICES } from "@/services/admin/events/events.services";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/components/AvidToast";
import * as yup from "yup";

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const eventSchema = yup.object({
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
  sub_title_en: yup.string().optional().default(""),
  sub_title_de: yup.string().optional().default(""),
  sub_title_fr: yup.string().optional().default(""),
  sub_title_es: yup.string().optional().default(""),
  content_en: yup.string().required("English content is required"),
  content_de: yup.string().optional().default(""),
  content_fr: yup.string().optional().default(""),
  content_es: yup.string().optional().default(""),
  author: yup.string().required("Author is required"),
  category: yup.string().required("Category is required"),
  start_date: yup.string().required("Start date is required"),
  location: yup.string().required("Location is required"),
  hyper_link: yup.string().optional().default(""),
  delete_ics: yup.boolean().optional().default(false),
  end_date: yup
    .string()
    .required("End date is required")
    .test("is-after-start-date", "End date must be after the start date", function (value) {
      const { start_date } = this.parent;
      if (!start_date || !value) return true;
      return new Date(value) >= new Date(start_date);
    }),

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
  upload_ics: yup
    .mixed<FileList | string>()
    .optional()
    .nullable()
    .default(null)
    .test("file-check", "Invalid file", (value) => {
      if (!value) return true; // optional → no file selected
      if (value instanceof FileList) {
        return value.length > 0;
      }
      return true;
    })
    .test("fileType", "Unsupported file format (.ics only)", (value) => {
      if (!value) return true; // optional
      if (value instanceof FileList) {
        return ["text/calendar"].includes(value?.[0]?.type);
      }
      return true;
    }),
});

type EventFormValues = yup.InferType<typeof eventSchema>;

type EventFormProps = {
  eventId?: string;
  eventData?: any;
};

export function EventForm({ eventId, eventData }: EventFormProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      is_active: true,
       image_mobile: "",
    },
    mode: "onChange",
  });

  // 🟡 Edit mode → load data
  useEffect(() => {
    if (!eventId) return;

    reset({
      slug: eventData.slug,
      title_en: eventData.title_en || eventData.title || "",
      title_de: eventData.title_de || "",
      title_fr: eventData.title_fr || "",
      title_es: eventData.title_es || "",
      sub_title_en: eventData.sub_title_en || eventData?.sub_title || "",
      sub_title_de: eventData.sub_title_de || "",
      sub_title_fr: eventData.sub_title_fr || "",
      sub_title_es: eventData.sub_title_es || "",
      content_en: eventData.content_en || eventData.content || "",
      content_de: eventData.content_de || "",
      content_fr: eventData.content_fr || "",
      content_es: eventData.content_es || "",
      author: eventData.author,
      location: eventData.location,
      category: eventData.category,
      hyper_link: eventData.hyper_link,
      start_date: eventData.start_date
        ? DateTime.fromISO(eventData.start_date).toFormat("yyyy-MM-dd")
        : "",
      end_date: eventData.end_date
        ? DateTime.fromISO(eventData.end_date).toFormat("yyyy-MM-dd")
        : "",
      is_active: !!eventData.is_active,
      image: eventData.image, // string
      image_mobile: eventData.image_mobile || eventData.imageMobile || eventData.mobileImage || "",
      upload_ics: eventData?.ics || null, // string
      ...(eventData?.ics && { delete_ics: false }),
    });

    () => {
      reset();
    };
  }, [eventId, reset]);

  const onSubmit = async (values: EventFormValues) => {
    const formData = new FormData();
    const titleDe = values.title_de || values.title_en;
    const titleFr = values.title_fr || values.title_en;
    const titleEs = values.title_es || values.title_en;
    const subTitleDe = values.sub_title_de || values.sub_title_en || "";
    const subTitleFr = values.sub_title_fr || values.sub_title_en || "";
    const subTitleEs = values.sub_title_es || values.sub_title_en || "";
    const contentDe = values.content_de || values.content_en;
    const contentFr = values.content_fr || values.content_en;
    const contentEs = values.content_es || values.content_en;

    formData.append("slug", values.slug);
    formData.append("title", values.title_en);
    formData.append("sub_title", values.sub_title_en || "");
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
    formData.append("category", values.category);
    formData.append("start_date", values.start_date);
    formData.append("end_date", values.end_date);
    formData.append("location", values.location);
    formData.append("hyper_link", values.hyper_link || "");
    formData.append("is_active", String(values.is_active));

    if (values.delete_ics) {
      formData.append("delete_ics", String(values.delete_ics));
    }

    if (values.upload_ics instanceof FileList) {
      formData.append("ics", values.upload_ics[0]);
    }

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
      if (eventId) {
        await EVENTS_SERVICES.updateEvent(eventId, formData);
        toast.success("Event updated successfully");
      } else {
        await EVENTS_SERVICES.createEvent(formData);
        toast.success("Event created successfully");
        reset();
      }
      router.push("/admin/events");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };
  const image = watch("image");
  const mobileImage = watch("image_mobile");
  const uploadIcs = watch("upload_ics");
  const watchedStartDate = watch("start_date");
  const watchedEndDate = watch("end_date");

  // 2. Define today's date as the absolute minimum for new entries
  const today = new Date().toISOString().split("T")[0];

  const handleOnClick = (icsUrl: string) => {
    const link = document.createElement("a");
    link.href = icsUrl;

    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <div>
      <h1 className="mb-5 font-bold text-off-black text-2xl">
        {eventId ? "Edit Event" : "Add Event"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="gap-5 space-y-5 grid grid-cols-3">
        {/* Slug */}
        <div>
          <Label required className="mb-2 font-medium md:text-sm" htmlFor="slug">
            Slug
          </Label>
          <Input
            {...register("slug")}
            id="slug"
            placeholder="event-slug"
            className="bg-white border border-border"
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
          <Label className="mb-2 font-medium md:text-sm">Sub Title</Label>
          <Input
            {...register("sub_title_en")}
            placeholder="Enter sub title"
            className="bg-white border border-border"
          />
          {errors.sub_title_en && <p className="mt-1 text-red-500 text-sm">{errors.sub_title_en.message}</p>}
        </div>

        {/* Category Title */}
        <div>
          <Label required className="mb-2 font-medium md:text-sm">
            Category
          </Label>
          <Input
            {...register("category")}
            placeholder="Enter category"
            className="bg-white border border-border"
          />
          {errors.category && (
            <p className="mt-1 text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* Start & End Date */}
        <div className="flex justify-between items-center gap-5">
          <div className="relative w-full">
            <Label required className="mb-2 font-medium md:text-sm">
              Start Date
            </Label>
            <div className="relative">
              <Input
                {...register("start_date")}
                type="date"
                min={today}
                max={watchedEndDate || undefined}
                className="bg-white border border-border"
              />
              {watch("start_date") && (
                <button
                  type="button"
                  className="top-1/2 right-10 absolute -translate-y-1/2 cursor-pointer"
                  onClick={() => setValue("start_date", "")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {errors.start_date && (
              <p className="mt-1 text-red-500 text-sm">{errors.start_date.message}</p>
            )}
          </div>

          {/* End Date */}
          <div className="w-full">
            <Label required className="mb-2 font-medium md:text-sm">
              End Date
            </Label>
            <div className="relative">
              <Input
                {...register("end_date")}
                type="date"
                min={watchedStartDate || today}
                className="bg-white border border-border"
              />
              {watch("end_date") && (
                <button
                  type="button"
                  className="top-1/2 right-10 absolute -translate-y-1/2 cursor-pointer"
                  onClick={() => setValue("end_date", "")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {errors.end_date && (
              <p className="mt-1 text-red-500 text-sm">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <Label required className="mb-2 font-medium md:text-sm">
            Location
          </Label>
          <Input
            {...register("location")}
            placeholder="Enter location"
            className="bg-white border border-border"
          />
          {errors.location && (
            <p className="mt-1 text-red-500 text-sm">{errors.location.message}</p>
          )}
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

        {/* Image */}
        <div>
          <ImageUpload
            width={IMAGE_DIMENSION.EVENT.width}
            height={IMAGE_DIMENSION.EVENT.height}
            maxSizeMB={10}
            label="Image"
            inputId="event-image"
            error={errors.image?.message}
            onUploadSuccess={(croppedImage) => {
              setValue("image", croppedImage);
            }}
            onClear={() => {
              if (eventData?.image) {
                setValue("image", eventData?.image);
              }
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
            width={IMAGE_DIMENSION.EVENT.width}
            height={IMAGE_DIMENSION.EVENT.height}
            maxSizeMB={10}
            label="Mobile Image"
            inputId="event-image-mobile"
            required={false}
            error={errors.image_mobile?.message}
            onUploadSuccess={(croppedImage) => {
              setValue("image_mobile", croppedImage);
            }}
            onClear={() => {
              if (eventData?.image_mobile || eventData?.imageMobile || eventData?.mobileImage) {
                setValue(
                  "image_mobile",
                  eventData?.image_mobile || eventData?.imageMobile || eventData?.mobileImage
                );
              }
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

        {/* ICS */}
        <div>
          <Label className="mb-2 w-max font-medium md:text-sm cursor-pointer" htmlFor="file">
            Upload ICS
          </Label>
          <FileInput
            id="file"
            accept=".ics"
            className="hidden"
            onChange={(e) => {
              const file = e?.target.files;
              if (!file?.length) return;
              setValue("upload_ics", file);
            }}
            onClear={() => {
              if (eventData?.ics) {
                setValue("delete_ics", true);
                setValue("upload_ics", eventData?.ics);
              }
            }}
          />
          {errors.upload_ics && (
            <p className="mt-1 text-red-500 text-xs">{errors.upload_ics.message}</p>
          )}
          {typeof uploadIcs === "string" && uploadIcs ? (
            <div className="flex justify-end items-center gap-2">
              <div className="mt-2">
                <Button
                  type="button"
                  onClick={() => handleOnClick(uploadIcs)}
                  className="flex bg-secondary mt-2 ml-auto px-2 py-1 w-fit h-auto font-normal text-white text-sm"
                >
                  Download
                </Button>
              </div>
              <div className="mt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setValue("upload_ics", null);
                    setValue("delete_ics", true);
                  }}
                  className="flex bg-secondary mt-2 ml-auto px-2 py-1 w-fit h-auto font-normal text-white text-sm"
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Hyper Link */}
        <div>
          <Label required className="mb-2 font-medium md:text-sm">
            Hyper Link
          </Label>
          <Input
            {...register("hyper_link")}
            placeholder="Enter hyper link"
            className="bg-white border border-border"
          />
          {errors.hyper_link && (
            <p className="mt-1 text-red-500 text-sm">{errors.hyper_link.message}</p>
          )}
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

        {/* Content */}
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
            {isSubmitting ? "Saving..." : eventId ? "Update Event" : "Create Event"}
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
              <img src={previewImage || ""} alt="Full View" className="shadow-2xl rounded-lg w-full h-auto" />
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
