# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BNI Vietnam Member Shop — a static HTML/CSS website for selling BNI membership packages. No build tools, no JavaScript framework, no package manager. Just open HTML files directly in a browser.

## Architecture

**Page types:**
- **Shop page** (`member-shop.html`): Product listing grid (4 columns) linking to detail pages. Uses `css/shared.css` + `css/shop.css`.
- **Detail pages** (`goi-*.html`): Individual product pages with image, pricing, tabbed content (benefits/description/policy), and related products. Uses `css/shared.css` + `css/detail.css`.

**CSS structure:**
- `css/shared.css` — Reset, base typography (Roboto), header, footer, `.product-card` base styles, and shared responsive breakpoints.
- `css/shop.css` — Shop grid layout (`.member-shop` 4-col grid), product card sizing for shop, `.btn-cart`.
- `css/detail.css` — Product detail layout, price block, tabs system, benefits grid, policy/refund table, related products section (`.member-shop` 3-col grid), `.btn-cart-sm`.

**Key conventions:**
- Brand color: `#CF2030` (BNI red), used consistently across headers, buttons, accents.
- Language: Vietnamese (`lang="vi"`). All content is in Vietnamese.
- Prices include hidden `<input type="hidden" class="price-raw">` fields with `data-product-id` attributes (e.g., `member-new-1year`, `member-renew-2year`) for potential payment integration.
- Product images are hosted externally on `bni.vn`.
- Tab switching on detail pages uses inline `onclick="switchTab()"` with vanilla JS.
- Header and footer markup is duplicated across all HTML files (no templating).

## Products

| ID | Page | Price (VND) |
|---|---|---|
| `member-new-1year` | `goi-thanh-vien-moi-01-nam.html` | 17,027,280 |
| `member-new-2year` | `goi-thanh-vien-moi-02-nam.html` | 29,239,056 |
| `member-renew-1year` | `goi-gia-han-01-nam.html` | 14,867,280 |
| `member-renew-2year` | `goi-gia-han-02-nam.html` | 27,079,056 |

## Responsive Breakpoints

- `900px`: Nav collapses to mobile menu; detail grid switches to 2-col related products
- `768px`: Product detail splits to single column; footer to 2-col
- `600px`: Shop/related grids to single column; benefits grid to single column
- `480px`: Footer to single column
