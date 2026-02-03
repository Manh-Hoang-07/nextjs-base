"use client";

import ImportDetail from "@/components/admin/ecommerce/warehouse/import/importDetail";
import { useParams } from "next/navigation";

export default function ImportDetailPage() {
    const params = useParams();
    const id = params.id as string;
    return <ImportDetail id={id} />;
}
