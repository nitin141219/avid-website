"use client";

import CustomSelect from "@/components/custom-select/CustomSelect";
import FileInput from "@/components/file-input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DOCUMENT_CATEGORY } from "@/constants";
import { DOCUMENTS_SERVICES } from "@/services/admin/documents/documents.services";
import { PRODUCTS_SERVICES } from "@/services/admin/products/products.services";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/components/AvidToast";
import * as yup from "yup";

type CreateDocumentModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // refresh list after create
};

const YEAR_OPTIONS = Array.from({ length: 20 }, (_, index) => {
  const year = new Date().getFullYear() - index;

  return { label: String(year), value: String(year) };
});

const createDocumentSchema = yup.object({
  name: yup.string().required("Document name is required"),
  category: yup
    .object({
      label: yup.string().required("Category is required"),
      value: yup.string().required("Category is required"),
    })
    .nullable()
    .default(null)
    .required("Category is required"),

  product: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .default(null)
    .when("category", {
      is: (cat: any) => cat?.value === DOCUMENT_CATEGORY.PRODUCT,
      then: (schema) => schema.required("Product is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  docType: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .default(null)
    .when("category", {
      is: (cat: any) => cat?.value === DOCUMENT_CATEGORY.PRODUCT,
      then: (schema) => schema.required("Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  year: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .nullable()
    .default(null)
    .when("category", {
      is: (cat: any) => cat?.value === DOCUMENT_CATEGORY.CERTIFICATE,
      then: (schema) => schema.required("Year is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  description: yup.string().optional(),
  file: yup
    .mixed<FileList>()
    .required("File is required")
    .test("file-exists", "File is required", (value) => {
      return value.length > 0;
    }),
});

export type CreateDocumentFormValues = yup.InferType<typeof createDocumentSchema>;

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export function CreateDocumentModal({ open, onClose, onSuccess }: CreateDocumentModalProps) {
  const [products, setProducts] = useState<{ label: string; value: string; _id?: string; id?: string }[]>([]);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({ label: "", value: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateDocumentFormValues>({
    resolver: yupResolver(createDocumentSchema) as any,
    mode: "onChange",
    defaultValues: {
      category: undefined,
    },
  });
  const categoryValue = watch("category");
  const selectedProduct = watch("product");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await PRODUCTS_SERVICES.getProducts();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (
      categoryValue?.value === DOCUMENT_CATEGORY.PRODUCT &&
      selectedProduct?.label
    ) {
      setValue("name", selectedProduct.label, { shouldValidate: true });
    }
  }, [categoryValue?.value, selectedProduct?.label, setValue]);

  const onSubmit = async (values: CreateDocumentFormValues) => {
    let slug = "";
    let documentName = values.name;

    if (values.category?.value === DOCUMENT_CATEGORY.PRODUCT) {
      slug = `${values.product?.value}-${values?.docType?.value}`;
      const docTypeLabel = String(values.docType?.value || "").toUpperCase();
      const baseName = values.product?.label || values.name;
      const alreadySuffixed = new RegExp(`[-\\s]${docTypeLabel}$`, "i").test(baseName);
      documentName = alreadySuffixed ? baseName : `${baseName}-${docTypeLabel}`;
    } else {
      // For certificates, include year in name to ensure uniqueness
      slug = `${generateSlug(values.name)}-${values.year?.value}`;
      documentName = `${values.name}-${values.year?.value}`;
    }
    const formData = new FormData();
    formData.append("name", documentName);
    formData.append("description", values.description || "");
    formData.append("category", values?.category?.value || "");
    formData.append("slug", slug); // 👈 hidden slug
    if (values.category?.value === DOCUMENT_CATEGORY.PRODUCT) {
      formData.append("product_slug", values.product?.value || "");
      formData.append("product_name", values.product?.label || "");
      formData.append("document_type", (values.docType?.value || "").toUpperCase());
      formData.append("year", "");
    }
    if (values.category?.value === DOCUMENT_CATEGORY.CERTIFICATE) {
      formData.append("year", values.year?.value || "");
      formData.append("product_slug", "");
      formData.append("product_name", "");
      formData.append("document_type", "");
    }
    formData.append("file", values.file[0]);

    try {
      await DOCUMENTS_SERVICES.uploadDocument(formData);
      toast.success("Document created successfully");

      onSuccess?.();
      onClose();
      reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to create document");
    }
  };

  const addLocalProductOption = (label: string, value: string) => {
    const normalizedValue = generateSlug(value || label);
    const existing = products.find((product) => product.value === normalizedValue);

    if (existing) {
      setValue("product", existing as any, { shouldValidate: true });
      return existing;
    }

    const nextProduct = {
      _id: `temp_${Date.now()}`,
      label: label.trim(),
      value: normalizedValue,
    };

    setProducts((prev) => [...prev, nextProduct]);
    setValue("product", nextProduct as any, { shouldValidate: true });
    return nextProduct;
  };

  return (
    <>
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold">Create Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Name */}
          <div>
            <Label
              className="mb-2 w-max font-medium md:text-sm cursor-pointer"
              required
              htmlFor="document_name"
            >
              Name
            </Label>
            <Input
              {...register("name")}
              id="document_name"
              placeholder="Enter document name"
              className="bg-white backdrop-blur-xs border border-border placeholder:font-light text-black placeholder:text-light-dark"
            />
            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          {/* Name */}
          <div>
            <Label
              className="mb-2 w-max font-medium md:text-sm cursor-pointer"
              required
              htmlFor="category"
            >
              Category
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  className="col-span-full w-full"
                  placeholder="(Choose a category...)"
                  {...field}
                  id="category"
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  customStyles={{
                    control: (_, state) => ({
                      // backgroundColor: "var(--gray-section)",
                      height: 36,
                      width: "100%",
                      border: "1px solid var(--border)",
                      "&:hover": {
                        border: state.isFocused
                          ? "1px solid var(--ring)"
                          : "1px solid var(--border)",
                      },
                    }),
                    clearIndicator: () => ({
                      padding: "0 8px",
                    }),
                    placeholder: () => ({
                      fontWeight: 300,
                      color: "var(--light-dark)",
                    }),
                  }}
                  isClearable
                  options={[
                    { value: DOCUMENT_CATEGORY.PRODUCT, label: "Product" },
                    { value: DOCUMENT_CATEGORY.CERTIFICATE, label: "Certificate" },
                  ]}
                />
              )}
            />
            {errors.category && (
              <p className="mt-1 text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {categoryValue?.value === DOCUMENT_CATEGORY.PRODUCT && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="w-max font-medium md:text-sm cursor-pointer" required htmlFor="product">
                  Product
                </Label>
                <div className="flex gap-1">
                  {watch("product") && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const selectedProduct = watch("product") as any;
                        if (selectedProduct?._id || selectedProduct?.id) {
                          setDeleteConfirmId(selectedProduct._id || selectedProduct.id);
                        }
                      }}
                      className="gap-1 h-7 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateProduct(true)}
                    className="gap-1 h-7"
                  >
                    <Plus className="w-3 h-3" />
                    New
                  </Button>
                </div>
              </div>
              <Controller
                name="product"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="product"
                    placeholder="Select product"
                    isClearable
                    customStyles={{
                      control: (_, state) => ({
                        height: 36,
                        width: "100%",
                        border: "1px solid var(--border)",
                        "&:hover": {
                          border: state.isFocused
                            ? "1px solid var(--ring)"
                            : "1px solid var(--border)",
                        },
                      }),
                      clearIndicator: () => ({
                        padding: "0 8px",
                      }),
                      placeholder: () => ({
                        fontWeight: 300,
                        color: "var(--light-dark)",
                      }),
                    }}
                    options={products}
                  />
                )}
              />
              {errors.product && (
                <p className="mt-1 text-red-500 text-sm">{errors.product.message}</p>
              )}
            </div>
          )}

          {categoryValue?.value === DOCUMENT_CATEGORY.CERTIFICATE && (
            <div>
              <Label
                className="mb-2 w-max font-medium md:text-sm cursor-pointer"
                required
                htmlFor="year"
              >
                Year
              </Label>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="year"
                    placeholder="Select year"
                    isClearable
                    customStyles={{
                      control: (_, state) => ({
                        height: 36,
                        width: "100%",
                        border: "1px solid var(--border)",
                        "&:hover": {
                          border: state.isFocused
                            ? "1px solid var(--ring)"
                            : "1px solid var(--border)",
                        },
                      }),
                      clearIndicator: () => ({
                        padding: "0 8px",
                      }),
                      placeholder: () => ({
                        fontWeight: 300,
                        color: "var(--light-dark)",
                      }),
                    }}
                    options={YEAR_OPTIONS}
                  />
                )}
              />
              {errors.year && <p className="mt-1 text-red-500 text-sm">{errors.year.message}</p>}
            </div>
          )}
          {categoryValue?.value === DOCUMENT_CATEGORY.PRODUCT && (
            <div>
              <Label
                className="mb-2 w-max font-medium md:text-sm cursor-pointer"
                required
                htmlFor="category"
              >
                Type
              </Label>
              <Controller
                name="docType"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    placeholder="Select type"
                    isClearable
                    customStyles={{
                      control: (_, state) => ({
                        // backgroundColor: "var(--gray-section)",
                        height: 36,
                        width: "100%",
                        border: "1px solid var(--border)",
                        "&:hover": {
                          border: state.isFocused
                            ? "1px solid var(--ring)"
                            : "1px solid var(--border)",
                        },
                      }),
                      clearIndicator: () => ({
                        padding: "0 8px",
                      }),
                      placeholder: () => ({
                        fontWeight: 300,
                        color: "var(--light-dark)",
                      }),
                    }}
                    options={[
                      { label: "SDS", value: "sds" },
                      { label: "PDS", value: "pds" },
                    ]}
                  />
                )}
              />
              {errors.docType && (
                <p className="mt-1 text-red-500 text-sm">{errors.docType.message}</p>
              )}
            </div>
          )}

          <div>
            <Label
              required
              className="mb-2 w-max font-medium md:text-sm cursor-pointer"
              htmlFor="file"
            >
              Upload File
            </Label>
            <FileInput {...register("file")} id="file" />
            {errors.file && <p className="mt-1 text-red-500 text-sm">{errors.file.message}</p>}
          </div>
          {/* Description */}
          <div>
            <Label
              className="mb-2 w-max font-medium md:text-sm cursor-pointer"
              htmlFor="description"
            >
              Description
            </Label>
            <Textarea
              {...register("description")}
              id="description"
              placeholder="Optional description"
              className="bg-white backdrop-blur-xs border border-border placeholder:font-light text-black placeholder:text-light-dark"
            />
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={showCreateProduct} onOpenChange={setShowCreateProduct}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="new-product-label" className="text-sm font-medium">
              Display Name *
            </Label>
            <Input
              id="new-product-label"
              placeholder="e.g., Aviga HP70"
              value={newProductForm.label}
              onChange={(e) =>
                setNewProductForm({
                  label: e.target.value,
                  value: generateSlug(e.target.value),
                })
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="new-product-value" className="text-sm font-medium">
              Internal Value *
            </Label>
            <Input
              id="new-product-value"
              placeholder="e.g., aviga-hp70"
              value={newProductForm.value}
              onChange={(e) => setNewProductForm({ ...newProductForm, value: e.target.value })}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Use lowercase with hyphens</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowCreateProduct(false);
              setNewProductForm({ label: "", value: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!newProductForm.label.trim() || !newProductForm.value.trim()) {
                toast.error("Please fill in all fields");
                return;
              }

              try {
                await PRODUCTS_SERVICES.createProduct(newProductForm);
                toast.success("Product created successfully");

                const data = await PRODUCTS_SERVICES.getProducts();
                setProducts(data.products || []);

                setShowCreateProduct(false);
                setNewProductForm({ label: "", value: "" });
              } catch (error: any) {
                addLocalProductOption(newProductForm.label, newProductForm.value);
                toast.success("Product added. Save the document to persist it.");
                setShowCreateProduct(false);
                setNewProductForm({ label: "", value: "" });
              }
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product? You can add it back anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              if (!deleteConfirmId) return;

              try {
                const selectedProduct = watch("product") as any;
                if (String(deleteConfirmId).startsWith("temp_")) {
                  setProducts((prev) =>
                    prev.filter((product) => (product._id || product.id) !== deleteConfirmId)
                  );
                  if (selectedProduct?._id === deleteConfirmId || selectedProduct?.id === deleteConfirmId) {
                    setValue("product", null as any, { shouldValidate: true });
                  }
                  setDeleteConfirmId(null);
                  return;
                }
                await PRODUCTS_SERVICES.deleteProduct(deleteConfirmId);
                toast.success("Product deleted successfully");

                const data = await PRODUCTS_SERVICES.getProducts();
                setProducts(data.products || []);

                if (selectedProduct?._id === deleteConfirmId || selectedProduct?.id === deleteConfirmId) {
                  setValue("product", null as any, { shouldValidate: true });
                }

                setDeleteConfirmId(null);
              } catch (error: any) {
                toast.error(error?.message || "Failed to delete product");
              }
            }}
            className="bg-destructive hover:bg-destructive/70"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
