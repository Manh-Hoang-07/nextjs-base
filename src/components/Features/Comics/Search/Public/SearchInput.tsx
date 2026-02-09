'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchInput({ className = "" }: { className?: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [term, setTerm] = useState(searchParams.get('search')?.toString() || '');

    useEffect(() => {
        // Skip if search term in URL matches current state
        const currentSearch = searchParams.get('search') || '';
        if (term === currentSearch) return;

        // Debounce logic
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            // If term is cleared, just remove it from params
            if (!term) {
                params.delete('search');
                // Only replace if we are already on the comics page to clear the filter
                if (pathname.startsWith('/comics')) {
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                }
                return;
            }

            // If term exists
            params.set('search', term);
            params.set('page', '1'); // Reset to page 1

            const targetPath = '/comics';

            // Navigate
            router.replace(`${targetPath}?${params.toString()}`, { scroll: false });

        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [term, router, searchParams, pathname]); // pathname removed from deps to avoid loop if we change path logic

    // Update term if URL changes externally (e.g. back button)
    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch !== term && urlSearch !== null) {
            setTerm(urlSearch);
        } else if (urlSearch === null && term !== '') {
            setTerm('');
        }
    }, [searchParams]);


    return (
        <div className={`relative w-full flex items-center rounded-full border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 transition-all duration-200 ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 sm:text-sm leading-5"
                placeholder="Tìm kiếm truyện..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
        </div>
    );
}
