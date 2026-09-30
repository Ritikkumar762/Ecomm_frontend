/** Mirrors syntellite-headless-ecomm's categories module (`src/modules/categories/dto.ts`). */
export interface Category {
  id: string;
  name: string;
  /** Derived server-side from `name` on create; never client-supplied. */
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** `POST /admin/categories` — `name` required; `slug` is never sent, the backend derives it. */
export interface CreateCategoryInput {
  name: string;
  isActive?: boolean;
}

/** `PATCH /admin/categories/:id` — at least one field required (enforced server-side too). */
export interface UpdateCategoryInput {
  name?: string;
  isActive?: boolean;
}
