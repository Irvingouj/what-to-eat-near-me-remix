import { Photo } from "common/type/nearby";
import { clientGetImageUrl } from "src/utils/google";
import { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import required modules
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

// Custom Swiper styles
const swiperStyles = `
  .swiper-button-next,
  .swiper-button-prev {
    color: #dc2626; /* red-600 */
    transition: all 0.3s ease;
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    color: #b91c1c; /* red-700 */
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 24px;
    font-weight: bold;
  }

  .swiper-pagination-bullet-active {
    background: #dc2626; /* red-600 */
  }

  .swiper-thumb {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  .swiper-thumb-active {
    opacity: 1;
    border: 2px solid #dc2626;
  }
`;

interface PhotoGalleryProps {
  photos: Photo[];
  placeName: string;
}

export function PhotoGallery({ photos, placeName }: PhotoGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div className="mb-4 relative">
      <style>{swiperStyles}</style>
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper }}
        className="h-64 rounded-lg mb-2"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <button
              onClick={(e) => handleImageClick(e, index)}
              className="block w-full h-full"
            >
              <img
                src={clientGetImageUrl(photo)}
                alt={`View ${index + 1} of ${placeName}`}
                className="w-full h-full object-cover"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[FreeMode, Thumbs]}
        spaceBetween={10}
        slidesPerView="auto"
        freeMode={true}
        watchSlidesProgress={true}
        className="h-16"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index} className="!w-24">
            <div className="w-full h-full swiper-thumb">
              <img
                src={clientGetImageUrl(photo, { height: 100, width: 100 })}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl"
            >
              ×
            </button>

            {/* Navigation */}
            {currentImageIndex > 0 && (
              <button
                onClick={() => setCurrentImageIndex(prev => prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl"
              >
                ‹
              </button>
            )}
            {currentImageIndex < photos.length - 1 && (
              <button
                onClick={() => setCurrentImageIndex(prev => prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl"
              >
                ›
              </button>
            )}

            {/* Main Image */}
            <img
              src={clientGetImageUrl(photos[currentImageIndex], { height: 800, width: 1200 })}
              alt={`View ${currentImageIndex + 1} of ${placeName}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />

            {/* Image counter */}
            <div className="absolute -bottom-12 w-full text-center text-white">
              {currentImageIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 