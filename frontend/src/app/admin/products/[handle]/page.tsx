"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { Product } from "@/data/types";
import ProductForm from "@/components/admin/ProductForm";
import { PageTitle, Button } from "@/components/admin/ui";

export default function AdminProductEditPage() {
  const { handle } = useParams() as { handle: string };
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isNew = handle === "new";

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    adminFetch<Product>(`/products/${handle}`, { auth: false })
      .then((data) => {
        // Transform plain string images to UploadedImage format expected by ProductForm
        const formattedData = {
          ...data,
          images: data.images.map((url) => ({ url, publicId: "" })),
        };
        setProduct(formattedData);
      })
      .catch(() => {
        router.push("/admin/products");
      })
      .finally(() => setLoading(false));
  }, [handle, isNew, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle
          title={isNew ? "Add Product" : "Edit Product"}
          subtitle="Configure product details, images, and variants."
        />
        <Button onClick={() => router.push("/admin/products")} variant="outline">
          Back
        </Button>
      </div>

      <ProductForm initial={product} />
    </div>
  );
}
