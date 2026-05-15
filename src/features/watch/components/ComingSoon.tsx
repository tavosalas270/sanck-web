"use client"

import Image from 'next/image';

export const ComingSoon = () => {
    return (
        <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center bg-snak-purple-dark overflow-hidden animate-in fade-in duration-700">
            <div className="relative w-full h-full max-w-[1920px]">
                <Image 
                    src="/ComingSoonWeb.png" 
                    alt="Coming Soon" 
                    fill 
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
};
