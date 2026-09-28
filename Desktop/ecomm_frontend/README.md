# Modular E-commerce Admin Dashboard (Next.js App Router)

A high-performance, modular Next.js frontend setup for an E-commerce Website & Admin Dashboard integrated with the `syntellite-headless-ecomm` backend.

---

## 🏗️ Architecture Overview

This codebase follows a **Feature-based Modular Architecture** designed for clean domain separation, high testability, and effortless maintainability.

```
src/
├── app/                           # Next.js App Router (Page views & layouts only)
│   ├── (auth)/                    # Auth Route Group
│   └── (dashboard)/               # Admin Dashboard Route Group
│
├── hooks/                         # ⚛️ GLOBAL CUSTOM HOOKS
│   ├── use-auth.ts                # Session state & authentication hook
│   ├── use-sidebar.ts             # Sidebar navigation collapse hook
│   ├── use-debounce.ts            # Search query debouncing
│   ├── use-pagination.ts          # Data table pagination control
│   └── use-toast.ts               # Toast notifications manager
│
├── lib/                           # Core utilities & API wrapper
│   ├── api-client.ts              # Modular REST client (Fetch wrapper with Bearer token)
│   └── utils.ts                   # Formatting & Classname helpers (cn, formatCurrency)
│
├── components/                    # Global Shared UI Components
│   ├── ui/                        # Reusable design primitives (Button, Card, Input, Modal, Badge)
│   └── layout/                    # Layout shells (Sidebar, Header, UserNav)
│
└── modules/                       # 📦 DOMAIN FEATURE MODULES
    ├── auth/                      # Login & Authentication Module
    │   ├── components/            # LoginForm
    │   ├── hooks/                 # useLogin
    │   ├── services/              # authService (login API)
    │   └── types/                 # auth.types.ts
    │
    ├── products/                  # Product & Variant Management Module
    │   ├── components/            # ProductTable, ProductModal, VariantModal
    │   ├── hooks/                 # useProducts, useVariants
    │   ├── services/              # productService (Product & Variant CRUD APIs)
    │   └── types/                 # product.types.ts (Product, ProductVariant, SKU)
    │
    ├── orders/                    # Orders Fulfillment Module
    │   ├── components/            # OrderTable
    │   ├── hooks/                 # useOrders
    │   ├── services/              # orderService
    │   └── types/                 # order.types.ts
    │
    ├── categories/                # Taxonomy & Category Module
    │   ├── components/            # CategoryList
    │   ├── hooks/                 # useCategories
    │   ├── services/              # categoryService
    │   └── types/                 # category.types.ts
    │
    └── analytics/                 # Dashboard Metrics & Charts Module
        ├── components/            # OverviewStats
        ├── hooks/                 # useAnalyticsData
        ├── services/              # analyticsService
        └── types/                 # analytics.types.ts
```

---

## ⚡ Key Highlights

1. **Modular Domain-Driven Structure**: Each domain feature (`auth`, `products`, `orders`, `categories`, `analytics`) encapsulates its own UI components, hooks, API services, and TypeScript types.
2. **Dedicated Separate Hooks**:
   - **Global Hooks**: `src/hooks/use-auth.ts`, `use-sidebar.ts`, `use-debounce.ts`, `use-pagination.ts`, `use-toast.ts`.
   - **Module Hooks**: `useLogin`, `useProducts`, `useVariants`, `useOrders`, `useCategories`, `useAnalyticsData`.
3. **Backend Integration Ready**:
   - Configured to talk to `syntellite-headless-ecomm` API via `src/lib/api-client.ts`.
   - Connected Login API and Product + Variant APIs with fallback offline modes.
4. **Product Variants Management**:
   - Full support for SKUs, price overrides, stock quantities, and attribute pairs (Color, Size, Switch Type).

---

## 🚀 How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
