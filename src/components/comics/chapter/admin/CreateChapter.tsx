"use client";

import ChapterForm from "./ChapterForm";
import Modal from "@/components/shared/ui/feedback/Modal";

interface CreateChapterProps {
    show: boolean;
    comicId?: number | string | null;
    apiErrors?: any;
    onClose: () => void;
    onCreated: (data: any) => Promise<any>;
}

export default function CreateChapter({
    show,
    comicId,
    apiErrors,
    onClose,
    onCreated,
}: CreateChapterProps) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Tạo chương mới"
            size="xl"
        >
            <ChapterForm
                comicId={comicId}
                apiErrors={apiErrors}
                onCancel={onClose}
                onSuccess={onCreated}
            />
        </Modal>
    );
}
