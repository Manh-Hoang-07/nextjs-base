export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
                </div>
                <div className="text-red-600 font-bold text-lg animate-pulse tracking-wide">
                    Đang tải...
                </div>
            </div>
        </div>
    );
}


