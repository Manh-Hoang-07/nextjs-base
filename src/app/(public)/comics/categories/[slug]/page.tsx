"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useProductCategories, ProductCategory } from "@/hooks/useProductCategories";
import CategoryMenu from "@/components/Features/Ecommerce/Products/Categories/Public/CategoryMenu";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  slug?: string;
  price?: number;
  sale_price?: number | null;
  thumbnail?: string | null;
  [key: string]: any;
}

export default function PublicCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;

  const {
    isLoading,
    fetchTree,
    fetchCategoryBySlug,
    fetchCategoryProducts,
  } = useProductCategories();

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [sidebarCategories, setSidebarCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(() => {
    const p = searchParams.get("page");
    return p ? Number(p) || 1 : 1;
  });
  const [limit] = useState<number>(() => {
    const l = searchParams.get("limit");
    return l ? Number(l) || 12 : 12;
  });
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const p = searchParams.get("page");
    if (p) {
      setPage(Number(p) || 1);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      const [tree, cat] = await Promise.all([
        fetchTree({ status: "active" }),
        fetchCategoryBySlug(slug, {
          include_products: "true",
          include_children: "true",
        }),
      ]);

      if (tree?.items) {
        setSidebarCategories(tree.items);
      }

      if (cat) {
        setCategory(cat);
        if ((cat as any).products?.items) {
          setProducts((cat as any).products.items);
          setTotalPages((cat as any).products.meta?.totalPages || 1);
        } else if ((cat as any).products && Array.isArray((cat as any).products)) {
          setProducts((cat as any).products);
        }
      }
    }

    loadData();
  }, [slug, fetchTree, fetchCategoryBySlug]);

  useEffect(() => {
    async function loadProductsById() {
      if (!category?.id) return;

      const res = await fetchCategoryProducts<Product>(category.id, {
        page,
        limit,
      });
      if (res) {
        setProducts(res.items);
        setTotalPages(res.meta.totalPages);
      }
    }

    if (category?.id) {
      loadProductsById();
    }
  }, [category?.id, page, limit, fetchCategoryProducts]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/category/${slug}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
        <div className="hidden w-64 md:block">
          <CategoryMenu
            categories={sidebarCategories}
            title="Danh mục sản phẩm"
          />
        </div>

        <main className="flex-1">
          <header className="mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {category?.name || "Danh mục sản phẩm"}
            </h1>
            {category?.description && (
              <p className="mt-2 text-sm text-gray-600">
                {category.description}
              </p>
            )}
          </header>

          {isLoading && products.length === 0 ? (
            <div className="py-12 text-center text-gray-500">Đang tải...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              Chưa có sản phẩm trong danh mục này.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm"
                  >
                    {product.thumbnail && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <div className="mt-2 text-sm font-semibold text-primary">
                        {product.sale_price ?? product.price
                          ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            Number((product.sale_price ?? product.price) || 0)
                          )
                          : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span className="text-sm text-gray-600">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}


