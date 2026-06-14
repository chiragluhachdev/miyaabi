"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { Banner } from "@/data/types";
import BannerForm from "@/components/admin/BannerForm";
import { PageTitle, Button } from "@/components/admin/ui";

export default function AdminBannerEditPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const isNew = id === "new";

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    // We fetch all banners and find the one with the matching ID
    adminFetch<Banner[]>("/banners?all=true", { auth: false })
      .then((data) => {
        const found = data.find((b) => b._id === id);
        if (found) setBanner(found);
        else router.push("/admin/banners");
      })
      .catch(() => router.push("/admin/banners"))
      .finally(() => setLoading(false));
  }, [id, isNew, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle
          title={isNew ? "Add Banner" : "Edit Banner"}
          subtitle="Configure the large hero images on the storefront."
        />
        <Button onClick={() => router.push("/admin/banners")} variant="outline">
          Back
        </Button>
      </div>

      <BannerForm initial={banner || undefined} />
    </div>
  );
}
