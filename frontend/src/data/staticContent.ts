export interface FaqItem {
  q: string;
  a: string;
}

export interface PageContent {
  title: string;
  intro: string;
  body?: string[];
  faqs?: FaqItem[];
  contact?: boolean;
}

export const PAGE_CONTENT: Record<string, PageContent> = {
  "bulk-enquiry": {
    title: "Bulk Enquiry",
    intro:
      "Kitting out a team, club, school or company? We offer custom branding, team names, numbers and volume pricing on the full miyaabi range.",
    body: [
      "Tell us what you need — the products, quantities, sizes and any custom branding — and our team will get back to you with a quote within 1–2 business days.",
      "Minimum order quantities and lead times vary by product and customisation. Reach out and we'll walk you through the options.",
    ],
    contact: true,
  },
  contact: {
    title: "Contact Us",
    intro:
      "We're here to help with sizing, orders, returns or anything else. Our team typically replies within a few hours.",
    contact: true,
  },
  "track-order": {
    title: "Track Your Order",
    intro:
      "Once your order ships, you'll receive an email and SMS with a tracking link. You can also reach out to us with your order number and we'll share the latest status.",
    contact: true,
  },
  faq: {
    title: "Frequently Asked Questions",
    intro: "Quick answers to the things customers ask us most.",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Orders are dispatched within 2–4 business days. Domestic delivery typically takes 3–7 days; international delivery varies by destination.",
      },
      {
        q: "What is your return policy?",
        a: "Unworn items with tags intact can be returned within 7 days of delivery for a refund or exchange. See our Refund Policy for details.",
      },
      {
        q: "How do I choose the right size?",
        a: "Each product page lists available sizes. If you're between sizes or unsure, message us on WhatsApp and we'll help you pick.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes — we ship worldwide. Shipping costs and timelines are shown at checkout based on your location.",
      },
      {
        q: "Can I customise products for my team?",
        a: "Absolutely. Visit our Bulk Enquiry page to request custom branding, names and numbers with volume pricing.",
      },
    ],
  },
};

export const POLICY_CONTENT: Record<string, PageContent> = {
  shipping: {
    title: "Shipping Policy",
    intro:
      "We aim to get your miyaabi gear to you quickly and safely, wherever you are.",
    body: [
      "Orders are processed and dispatched within 2–4 business days. You'll receive a confirmation email with tracking once your order is on its way.",
      "Domestic delivery typically takes 3–7 business days. International delivery times vary by destination and customs processing.",
      "Free standard shipping is available on domestic orders over ₹1,499. Shipping charges, where applicable, are calculated at checkout.",
    ],
  },
  refund: {
    title: "Refund & Returns Policy",
    intro: "Not the right fit? We make returns simple.",
    body: [
      "You may return unworn items with original tags intact within 7 days of delivery for a refund or exchange.",
      "To start a return, contact us with your order number. Once we receive and inspect the item, your refund is processed to the original payment method within 5–7 business days.",
      "Certain items (such as innerwear and customised products) are not eligible for return for hygiene and personalisation reasons.",
    ],
  },
  terms: {
    title: "Terms of Service",
    intro:
      "These terms govern your use of the miyaabi website and your purchases.",
    body: [
      "By placing an order you confirm that the information you provide is accurate and that you are authorised to use the chosen payment method.",
      "Prices, product availability and promotions are subject to change without notice. We reserve the right to cancel or refuse any order at our discretion.",
      "All brand assets, imagery and content on this site are the property of miyaabi and may not be used without permission.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "Your privacy matters. Here's how we handle your information.",
    body: [
      "We collect only the information needed to process your orders and improve your experience — such as your name, contact details and shipping address.",
      "We never sell your personal data. Payment information is handled securely by our payment partners and is not stored on our servers.",
      "You can request access to, or deletion of, your personal data at any time by contacting us.",
    ],
  },
};
