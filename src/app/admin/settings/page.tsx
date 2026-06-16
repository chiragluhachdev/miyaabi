"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { SiteSettings } from "@/data/types";
import SettingsForm from "@/components/admin/SettingsForm";
import { PageTitle } from "@/components/admin/ui";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<SiteSettings>("/settings")
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <PageTitle
          title="Site Settings"
          subtitle="Manage brand, announcements, WhatsApp integration, and footer."
        />
      </div>

      {settings && <SettingsForm initial={settings} />}
    </div>
  );
}
