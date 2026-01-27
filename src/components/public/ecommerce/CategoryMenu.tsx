"use client";

import Link from "next/link";
import { ProductCategory } from "@/hooks/useProductCategories";

interface CategoryMenuProps {
  categories: ProductCategory[];
  title?: string;
}

function renderTree(categories: ProductCategory[], level = 0) {
  return (
    <ul className={level === 0 ? "space-y-1" : "space-y-1 pl-3 border-l"}>
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            href={`/category/${cat.slug}`}
            className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-primary/5"
          >
            <span className="truncate">{cat.name}</span>
          </Link>
          {cat.children && cat.children.length > 0 && (
            <div className="mt-1">
              {renderTree(cat.children, level + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function CategoryMenu({ categories, title }: CategoryMenuProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <aside className="w-full rounded-lg bg-white p-4 shadow-sm">
      {title && (
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          {title}
        </h2>
      )}
      {renderTree(categories)}
    </aside>
  );
}


