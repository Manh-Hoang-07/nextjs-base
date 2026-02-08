'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchInput() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [term, setTerm] = useState(searchParams.get('search')?.toString() || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set('search', term);
                params.set('page', '1'); // Reset to page 1 when searching
            } else {
                params.delete('search');
            }
            replace(`${pathname}?${params.toString()}`);
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [term, pathname, replace, searchParams]);

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm shadow-sm transition-all duration-200 hover:shadow-md"
                placeholder="Tìm kiếm tên truyện..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
        </div>
    );
}
