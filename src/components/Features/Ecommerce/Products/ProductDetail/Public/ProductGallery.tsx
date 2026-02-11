
"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images = [] }) => {
    const [selectedImage, setSelectedImage] = useState(images[0] || '/placeholder-product.jpg');

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[500px] scrollbar-hide py-2 lg:py-0">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 shrink-0 border-2 rounded-lg overflow-hidden transition-all ${selectedImage === img ? 'border-black opacity-100 ring-2 ring-offset-2 ring-black' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-square lg:aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden group cursor-zoom-in">
                <Image
                    src={selectedImage}
                    alt="Product Main Image"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />

                {/* Zoom hinting or overlay */}
                <div className="absolute inset-0 bg-transparent" />
            </div>
        </div>
    );
};
