"use client";

import ExportDetail from "@/components/admin/ecommerce/warehouse/export/exportDetail";
import { useParams } from "next/navigation";

export default function ExportDetailPage() {
    const params = useParams();
    const id = params.id as string;
    return <ExportDetail id={id} />;
}
