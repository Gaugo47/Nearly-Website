import type { Metadata } from "next";
import { absoluteUrl, siteUrl } from "./site";
import { legal } from "./legal";

// Language-neutral identifiers: both language versions describe the same publisher and site.
export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;
const shareImage = `${siteUrl}/og.png`;

export const organization = {
  "@type": "Organization",
  "@id": organizationId,
  name: "Nearly",
  url: `${siteUrl}/`,
  logo: { "@type": "ImageObject", url: `${siteUrl}/media/nearly-icon.png` },
  email: legal.contactEmail,
};

/**
 * Share metadata of one page. Next replaces the layout's openGraph instead of merging it,
 * so a page without its own block would be shared with the home page's URL and title.
 */
export function socialMetadata({ title, description, url, locale }: { title: string; description: string; url: string; locale: string }): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: { type: "website", siteName: "Nearly", url, locale, title, description, images: [{ url: shareImage, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage] },
  };
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.path.startsWith("http") ? item.path : absoluteUrl(item.path) })),
  };
}

export function faqPage(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

/** A free browser tool of the site, published by Nearly. */
export function webApplication({ name, description, url, language }: { name: string; description: string; url: string; language: string }) {
  return {
    "@type": "WebApplication", "@id": `${url}#tool`, name, description, url, inLanguage: language,
    applicationCategory: "LifestyleApplication", operatingSystem: "Web", isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@id": organizationId },
  };
}

/** The RSS feed that sits beside a blog index: /feed.xml for /blog/, /en/feed.xml for /en/blog/. */
export const feedAlternate = (blogUrl: string) => ({ "application/rss+xml": `${blogUrl.slice(0, -"blog/".length)}feed.xml` });

export const jsonLd =(data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
