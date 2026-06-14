"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { Collection } from "@/data/types";
import CollectionForm from "@/components/admin/CollectionForm";
import { PageTitle, Button } from "@/components/admin/ui";

export default function AdminCollectionEditPage() {
  const { handle } = useParams() as { handle: string };
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const isNew = handle === "new";

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    adminFetch<{ collection: Collection; products: any[] }>(`/collections/${handle}`, {
      auth: false,
    })
      .then((data) => setCollection(data.collection))
      .catch(() => router.push("/admin/collections"))
      .finally(() => setLoading(false));
  }, [handle, isNew, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle
          title={isNew ? "Add Collection" : "Edit Collection"}
          subtitle="Group products into organized categories."
        />
        <Button onClick={() => router.push("/admin/collections")} variant="outline">
          Back
        </Button>
      </div>

      <CollectionForm initial={collection || undefined} />
    </div>
  );
}
