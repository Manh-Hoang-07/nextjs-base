'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Global navigation progress bar
 * Shows a loading indicator when navigating between pages
 */
export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        // Start loading indicator
        setIsNavigating(true);

        // Small delay to prevent flash for fast navigations
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (!isNavigating) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="relative">
                <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-red-600 animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-6 w-6 rounded-full bg-red-600/20"></div>
                </div>
            </div>
        </div>
    );
}


