"use client";

import ImportDetail from "@/components/admin/ecommerce/warehouses/imports/ImportDetail";
import { useParams } from "next/navigation";

export default function ImportDetailPage() {
    const params = useParams();
    const id = params.id as string;
    return <ImportDetail id={id} />;
}
