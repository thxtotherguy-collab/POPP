# POPP Pump & Tank Co — PRD

## Problem Statement
Redesign the POPP website (popp.co.za) using its clean style and branding, with updated layout/functionality matching AfriPumps (afripumps.co.za). Features: product catalogue, categories, search/filters, shopping cart (quote-request flow), JWT auth, interactive tools (Pump Finder, Tank Sizing).

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI (port 3000)
- **Backend**: FastAPI + Motor (async MongoDB) (port 8001)
- **Database**: MongoDB (local)
- **Auth**: JWT (bcrypt + pyjwt)

## User Personas
1. **Homeowner**: Needs pressure boosting or backup water. Uses Pump Finder / Tank Sizing tools.
2. **Farmer/Irrigator**: Needs borehole or irrigation pumps, larger tanks.
3. **Business/Installer**: Browses catalogue for commercial projects, requests bulk quotes.

## Core Requirements
- Fixed nav with search, categories dropdown, cart icon
- Homepage: hero, trust signals, categories, featured products, tools
- Product catalogue with filters (category, brand, sort)
- Product detail pages with lightbox, specs, related products
- Pump Finder & Tank Sizing interactive calculators
- Quote-request cart/checkout flow (no payment)
- JWT auth (register/login)
- Contact & About pages
- Footer with newsletter, links
- Fully responsive

## What's Been Implemented (Feb 2026)
- [x] Full backend API: auth, products, categories, brands, quotes, seed data
- [x] 19 mock products (6 categories, 6 brands, ZAR pricing)
- [x] Homepage with hero, trust signals, categories, featured products, tools teaser, CTA
- [x] Shop page with sidebar filters (category, brand), sort, search
- [x] Product detail page with lightbox, specs table, related products
- [x] Pump Finder calculator (flow rate + head matching)
- [x] Tank Sizing calculator (people x days x usage = recommendations)
- [x] Cart/quote request flow (add items, fill form, submit)
- [x] JWT auth (register/login tabs)
- [x] Contact page with form
- [x] About page
- [x] Footer with newsletter, categories, quick links
- [x] Mobile responsive (sheet nav on mobile)
- [x] Sonner toasts for all actions
- [x] Design: Manrope + DM Sans typography, #0052CC primary, clean industrial aesthetic

## Test Results
- Backend: 97% pass | Frontend: 95% pass | Overall: 96% pass

## Prioritized Backlog
### P0 (Critical)
- None remaining

### P1 (Important)
- Admin CMS for product management
- Real product images (currently using Unsplash placeholders)
- Order history / user dashboard
- WhatsApp integration for quotes
- Product image gallery (multiple images per product)

### P2 (Nice to Have)
- Product reviews/ratings
- Wishlist functionality
- Price range slider filter
- Google Analytics / tracking
- SEO meta tags per page
- Sitemap generation
- Email notifications for quote requests
