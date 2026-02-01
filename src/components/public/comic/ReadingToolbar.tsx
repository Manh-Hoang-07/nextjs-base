"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ListBulletIcon,
    XMarkIcon,
    CheckIcon
} from "@heroicons/react/24/outline";

interface ReadingToolbarProps {
    nextChapter: { id: string } | null;
    prevChapter: { id: string } | null;
    chapters: any[];
    currentChapterId: string;
}

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
    nextChapter,
    prevChapter,
    chapters = [],
    currentChapterId
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                const currentScrollY = window.scrollY;
                if (Math.abs(currentScrollY - lastScrollY) > 30) {
                    if (currentScrollY > lastScrollY && currentScrollY > 150) {
                        setIsVisible(false);
                    } else {
                        setIsVisible(true);
                    }
                    setLastScrollY(currentScrollY);
                }
            }
        };

        window.addEventListener("scroll", controlNavbar, { passive: true });
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [lastScrollY]);

    return (
        <>
            {/* Minimalist Bottom Navigation Bar */}
            <div className={`fixed bottom-8 inset-x-0 z-[100] px-4 flex justify-center transition-all duration-500 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}>
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-1.5">
                    {/* Previous Icon Button */}
                    {prevChapter ? (
                        <Link
                            href={`/home/chapters/${prevChapter.id}`}
                            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/15 rounded-xl text-white transition-all active:scale-90"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </Link>
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center text-gray-800 rounded-xl">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </div>
                    )}

                    {/* Chapter Selector Pill */}
                    <button
                        onClick={() => setShowSelector(true)}
                        className="h-12 flex items-center gap-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase tracking-tighter transition-all active:scale-95 shadow-lg shadow-red-900/20"
                    >
                        <ListBulletIcon className="w-5 h-5" />
                        <span>CHƯƠNG</span>
                    </button>

                    {/* Next Icon Button */}
                    {nextChapter ? (
                        <Link
                            href={`/home/chapters/${nextChapter.id}`}
                            className="w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all active:scale-90 shadow-lg shadow-red-900/20"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </Link>
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center text-gray-800 rounded-xl">
                            <ChevronRightIcon className="w-6 h-6" />
                        </div>
                    )}
                </div>
            </div>

            {/* Chapter Selection Modal/Drawer */}
            <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-300 ${showSelector ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowSelector(false)} />

                {/* Modal Content */}
                <div className={`relative w-full max-w-md bg-[#121212] border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform ${showSelector ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h3 className="text-white font-black text-lg tracking-tight">Danh Sách Chương</h3>
                            <p className="text-gray-500 text-xs mt-0.5">{chapters.length} chương đã tải</p>
                        </div>
                        <button
                            onClick={() => setShowSelector(false)}
                            className="text-gray-400 hover:text-white hover:bg-white/5 p-2 rounded-xl transition-all"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
                        {chapters.map((chapter) => (
                            <Link
                                key={chapter.id}
                                href={`/home/chapters/${chapter.id}`}
                                onClick={() => setShowSelector(false)}
                                className={`group flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${chapter.id == currentChapterId ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <div className="flex flex-col">
                                    <span className="opacity-60 text-[10px] uppercase tracking-widest mb-1">{chapter.chapter_label}</span>
                                    <span className="line-clamp-1">{chapter.title}</span>
                                </div>
                                {chapter.id == currentChapterId && <CheckIcon className="w-5 h-5" />}
                            </Link>
                        ))}
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/5">
                        <button
                            onClick={() => setShowSelector(false)}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
