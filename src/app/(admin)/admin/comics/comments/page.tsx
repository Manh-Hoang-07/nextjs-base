import AdminComicComments from "@/components/admin/comics/comments/AdminComicComments";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quáº£n lÃ½ bÃ¬nh luáº­n truyá»‡n | Admin",
    description: "Quáº£n lÃ½ bÃ¬nh luáº­n cá»§a ngÆ°á»i dÃ¹ng trÃªn cÃ¡c bá»™ truyá»‡n",
};

export default function AdminComicCommentsPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <AdminComicComments />
        </div>
    );
}

