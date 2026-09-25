export const API = {
  base: process.env.NEXT_PUBLIC_API_URL || 'https://api.smartassetz.ng',
};

export const SITE = {
  name: "Smart Assetz",
  description: "Nigeria's Leading Real Estate & Property Marketplace.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://smartassetz.ng",
  email: "support@smartassetz.ng",
  phone: "+234 800 000 0000",
  whatsapp: "+2348000000000",
  address: "Lagos, Nigeria",
};

export const siteConfig = {
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/smartassetz",
    github: "https://github.com/smartassetz",
  },
};

