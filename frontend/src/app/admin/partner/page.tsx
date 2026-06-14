"use client";

import PartnerForm from "@/components/admin/PartnerForm";
import { PageTitle } from "@/components/admin/ui";

export default function AdminPartnerPage() {
  return (
    <div>
      <PageTitle
        title="Partner Portal"
        subtitle="Edit the passcode-gated /partner factory showcase shown to business partners."
      />
      <PartnerForm />
    </div>
  );
}
