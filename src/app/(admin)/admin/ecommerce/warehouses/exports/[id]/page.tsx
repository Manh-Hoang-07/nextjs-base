"use client";

import ExportDetail from "@/components/Features/Ecommerce/Warehouses/Admin/Exports/ExportDetail";
import { useParams } from "next/navigation";

export default function ExportDetailPage() {
    const params = useParams();
    const id = params.id as string;
    return <ExportDetail id={id} />;
}
