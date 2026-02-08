'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/UI/Loading/LoadingSpinner';

interface ContentWrapperProps {
    children: React.ReactNode;
}

/**
 * Wrapper component that shows loading overlay when pagination or filtering happens
 * Detects clicks on pagination buttons or filter links
 */
export function ContentWrapper({ children }: ContentWrapperProps) {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [previousParams, setPreviousParams] = useState(searchParams.toString());

    useEffect(() => {
        const currentParams = searchParams.toString();

        // Check if params changed (navigation happened)
        if (currentParams !== previousParams) {
            setIsLoading(false);
            setPreviousParams(currentParams);
        }
    }, [searchParams, previousParams]);

    // Listen for navigation start
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if clicked element is a pagination button or filter link
            if (target.closest('[data-pagination]') || target.closest('a[href*="page="]')) {
                setIsLoading(true);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="relative">
            {isLoading && <LoadingSpinner variant="local" />}
            {children}
        </div>
    );
}
