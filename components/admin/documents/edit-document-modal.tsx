"use client";

import CustomSelect from "@/components/custom-select/CustomSelect";
import FileInput from "@/components/file-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const YEAR_OPTIONS = Array.from({ length: 20 }, (_, index) => {
  const year = new Date().getFullYear() - index;

  return { label: String(year), value: String(year) };
});

const editDocumentSchema = yup.object({
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
    .notRequired()
    .test("valid-file", "Invalid file", (value) => {
      if (!value) return true;
      return value.length >= 0;
    }),
});

type EditDocumentFormValues = yup.InferType<typeof editDocumentSchema>;

type EditDocumentModalProps = {
  open: boolean;
  onClose: () => void;
  documentData?: any;
  onSuccess?: () => void;
};

type ProductOption = {
  label: string;
  value: string;
  _id?: string;
  id?: string;
};

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const toTitleFromSlug = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const resolveDocType = (documentData: any) => {
  const docType = String(
    documentData?.document_type || documentData?.doc_type || documentData?.docType || ""
  )
    .toLowerCase()
    .trim();

  if (docType === "pds" || docType === "sds") {
    return docType;
  }

  const slug = String(documentData?.slug || "").toLowerCase();
  if (slug.endsWith("-pds")) return "pds";
  if (slug.endsWith("-sds")) return "sds";

  return "";
};

const resolveProductSlug = (documentData: any) => {
  const productSlug =
    documentData?.product_slug || documentData?.productSlug || documentData?.product?.value || "";

  if (productSlug) {
    return String(productSlug);
  }

  const slug = String(documentData?.slug || "").toLowerCase();
  if (slug.endsWith("-pds") || slug.endsWith("-sds")) {
    return slug.replace(/-(pds|sds)$/i, "");
  }

  return "";
};

export function EditDocumentModal({ open, onClose, documentData, onSuccess }: EditDocumentModalProps) {
  const [products, setProducts] = useState<ProductOption[]>([]);
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
  } = useForm<EditDocumentFormValues>({
    resolver: yupResolver(editDocumentSchema) as any,
    mode: "onChange",
    defaultValues: {
      category: undefined,
    },
  });

  const categoryValue = watch("category");
  const selectedProduct = watch("product");

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await PRODUCTS_SERVICES.getProducts();
        setProducts(data.products || []);
      } catch {
        // Fallback to empty array
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!open || !documentData) {
      return;
    }

    const resolvedCategory = documentData?.category || DOCUMENT_CATEGORY.CERTIFICATE;
    const productSlug = resolveProductSlug(documentData);
    const productOption = products.find((option) => option.value === productSlug);
    const productName = String(
      documentData?.product_name || documentData?.productName || (productSlug ? toTitleFromSlug(productSlug) : "")
    );
    const resolvedDocType = resolveDocType(documentData);
    const yearValue = String(
      documentData?.year || documentData?.document_year || documentData?.documentYear || ""
    );

    reset({
      name: documentData?.name || "",
      description: documentData?.description || "",
      category: {
        value: resolvedCategory,
        label: resolvedCategory === DOCUMENT_CATEGORY.PRODUCT ? "Product" : "Certificate",
      },
      product: resolvedCategory === DOCUMENT_CATEGORY.PRODUCT
        ? productOption ||
          (productSlug
            ? {
                value: productSlug,
                label: productName,
              }
            : null)
        : null,
      docType: resolvedCategory === DOCUMENT_CATEGORY.PRODUCT && resolvedDocType
        ? { value: resolvedDocType, label: resolvedDocType.toUpperCase() }
        : null,
      year: resolvedCategory === DOCUMENT_CATEGORY.CERTIFICATE && yearValue
        ? { value: yearValue, label: yearValue }
        : null,
    });
  }, [documentData, open, reset]);

  useEffect(() => {
    if (
      categoryValue?.value === DOCUMENT_CATEGORY.PRODUCT &&
      selectedProduct?.label
    ) {
      setValue("name", selectedProduct.label, { shouldValidate: true });
    }
  }, [categoryValue?.value, selectedProduct?.label, setValue]);

  const onSubmit = async (values: EditDocumentFormValues) => {
    const documentId = documentData?._id || documentData?.id;

    if (!documentId) {
      toast.error("Document not found");
      return;
    }

    const formData = new FormData();

    let slug = "";
    if (values.category?.value === DOCUMENT_CATEGORY.PRODUCT) {
      slug = `${values.product?.value}-${values.docType?.value}`;
    } else {
      slug = `${generateSlug(values.name)}-${values.year?.value}`;
    }

    let documentName = values.name;
    // For certificates, include year in name to ensure uniqueness
    if (values.category?.value === DOCUMENT_CATEGORY.PRODUCT) {
      const docTypeLabel = String(values.docType?.value || "").toUpperCase();
      const baseName = values.product?.label || values.name;
      const alreadySuffixed = new RegExp(`[-\\s]${docTypeLabel}$`, "i").test(baseName);
      documentName = alreadySuffixed ? baseName : `${baseName}-${docTypeLabel}`;
    } else {
      documentName = `${values.name}-${values.year?.value}`;
    }

    formData.append("name", documentName);
    formData.append("description", values.description || "");
    formData.append("category", values?.category?.value || "");
    formData.append("slug", slug);

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

    if (values.file?.[0]) {
      formData.append("file", values.file[0]);
    }

    try {
      await DOCUMENTS_SERVICES.updateDocument(documentId, formData, {
        documentUrl: documentData?.url || documentData?.file_url || documentData?.fileUrl,
        documentSlug: documentData?.slug,
      });
      toast.success("Document updated successfully");
      onSuccess?.();
      onClose();
      reset();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update document");
    }
  };

  const addLocalProductOption = (label: string, value: string) => {
    const normalizedValue = generateSlug(value || label);
    const existing = products.find((product) => product.value === normalizedValue);

    if (existing) {
      setValue("product", existing as any, { shouldValidate: true });
      return existing;
    }

    const nextProduct: ProductOption = {
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
          <DialogTitle className="font-bold">Edit Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <Label
              className="mb-2 w-max font-medium md:text-sm cursor-pointer"
              required
              htmlFor="edit_document_name"
            >
              Name
            </Label>
            <Input
              {...register("name")}
              id="edit_document_name"
              placeholder="Enter document name"
              className="bg-white backdrop-blur-xs border border-border placeholder:font-light text-black placeholder:text-light-dark"
            />
            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Label className="mb-2 w-max font-medium md:text-sm cursor-pointer" required htmlFor="category">
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
                      height: 36,
                      width: "100%",
                      border: "1px solid var(--border)",
                      "&:hover": {
                        border: state.isFocused ? "1px solid var(--ring)" : "1px solid var(--border)",
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
            {errors.category && <p className="mt-1 text-red-500 text-sm">{errors.category.message}</p>}
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
                        const selectedProduct = watch("product");
                        if (!selectedProduct?.value) return;
                        const matchedProduct = products.find(
                          (product) => product.value === selectedProduct.value
                        );
                        const productId = matchedProduct?._id || matchedProduct?.id;
                        if (productId) {
                          setDeleteConfirmId(productId);
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
                          border: state.isFocused ? "1px solid var(--ring)" : "1px solid var(--border)",
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
              {errors.product && <p className="mt-1 text-red-500 text-sm">{errors.product.message}</p>}
            </div>
          )}

          {categoryValue?.value === DOCUMENT_CATEGORY.PRODUCT && (
            <div>
              <Label className="mb-2 w-max font-medium md:text-sm cursor-pointer" required htmlFor="doc_type">
                Type
              </Label>
              <Controller
                name="docType"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    id="doc_type"
                    placeholder="Select type"
                    isClearable
                    customStyles={{
                      control: (_, state) => ({
                        height: 36,
                        width: "100%",
                        border: "1px solid var(--border)",
                        "&:hover": {
                          border: state.isFocused ? "1px solid var(--ring)" : "1px solid var(--border)",
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
              {errors.docType && <p className="mt-1 text-red-500 text-sm">{errors.docType.message}</p>}
            </div>
          )}

          {categoryValue?.value === DOCUMENT_CATEGORY.CERTIFICATE && (
            <div>
              <Label className="mb-2 w-max font-medium md:text-sm cursor-pointer" required htmlFor="year">
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
                          border: state.isFocused ? "1px solid var(--ring)" : "1px solid var(--border)",
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

          <div>
            <Label className="mb-2 w-max font-medium md:text-sm cursor-pointer" htmlFor="file">
              Replace File
            </Label>
            <FileInput {...register("file")} id="file" />
            <p className="mt-1 text-muted-foreground text-xs">Leave empty to keep existing file.</p>
          </div>

          <div>
            <Label className="mb-2 w-max font-medium md:text-sm cursor-pointer" htmlFor="description">
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
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Create Product Modal */}
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

                // Reload products
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

    {/* Delete Product Confirmation */}
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
                if (String(deleteConfirmId).startsWith("temp_")) {
                  setProducts((prev) =>
                    prev.filter((product) => (product._id || product.id) !== deleteConfirmId)
                  );
                  const selected = watch("product");
                  if (selected?.value) {
                    const selectedMatch = products.find((product) => product.value === selected.value);
                    const selectedId = selectedMatch?._id || selectedMatch?.id;
                    if (selectedId === deleteConfirmId) {
                      setValue("product", null as any, { shouldValidate: true });
                    }
                  }
                  setDeleteConfirmId(null);
                  return;
                }
                await PRODUCTS_SERVICES.deleteProduct(deleteConfirmId);
                toast.success("Product deleted successfully");
                
                // Reload products
                const data = await PRODUCTS_SERVICES.getProducts();
                setProducts(data.products || []);
                
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
