"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRODUCTS_SERVICES } from "@/services/admin/products/products.services";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";

interface Product {
  _id?: string;
  id?: string;
  label: string;
  value: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ label: "", value: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await PRODUCTS_SERVICES.getProducts();
      setProducts(data.products || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ label: product.label, value: product.value });
    } else {
      setEditingProduct(null);
      setFormData({ label: "", value: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ label: "", value: "" });
  };

  const handleSave = async () => {
    if (!formData.label.trim() || !formData.value.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingProduct) {
        const productId = editingProduct._id || editingProduct.id;
        if (!productId) throw new Error("Product ID missing");
        await PRODUCTS_SERVICES.updateProduct(productId, formData);
        toast.success("Product updated successfully");
      } else {
        await PRODUCTS_SERVICES.createProduct(formData);
        toast.success("Product created successfully");
      }
      handleCloseModal();
      fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save product");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await PRODUCTS_SERVICES.deleteProduct(productId);
      toast.success("Product deleted successfully");
      fetchProducts();
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product");
    }
  };

  return (
    <div className="container-inner py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Products</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No products found. Create one to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold">Label</th>
                <th className="px-4 py-3 text-left font-semibold">Value</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id || product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{product.label}</td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{product.value}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(product._id || product.id || "")}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="label" className="text-sm font-medium">
                Label (Display Name) *
              </Label>
              <Input
                id="label"
                placeholder="e.g., Aviga HP"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="value" className="text-sm font-medium">
                Value (Internal ID) *
              </Label>
              <Input
                id="value"
                placeholder="e.g., aviga-hp"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use lowercase with hyphens (e.g., aviga-hp)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingProduct ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Product"
        message="Are you sure you want to delete this product? Documents using this product will not be affected."
        onConfirm={() =>
          deleteConfirmId && handleDelete(deleteConfirmId)
        }
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
