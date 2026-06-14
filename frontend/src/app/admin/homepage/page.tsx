"use client";

import HomeSectionsForm from "@/components/admin/HomeSectionsForm";
import { PageTitle } from "@/components/admin/ui";

export default function AdminHomepagePage() {
  return (
    <div>
      <PageTitle
        title="Homepage Builder"
        subtitle="Add, reorder, and edit every section customers see on the home page."
      />
      <HomeSectionsForm />
    </div>
  );
}
