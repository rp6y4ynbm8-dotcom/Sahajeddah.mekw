import React, { useState } from 'react';
import { Calendar, Compass, Sparkles } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  category?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  category = "Culture"
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Soft pastel gradients matching category aesthetics
  const getPastelFallbackGradient = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('art') || c.includes('culture')) return 'from-[#EDE9FE] via-[#FCE7F3] to-[#FEF08A] text-[#6B21A8]';
    if (c.includes('music') || c.includes('concert')) return 'from-[#DDD6FE] via-[#BAE6FD] to-[#FED7AA] text-[#4338CA]';
    if (c.includes('food') || c.includes('dining')) return 'from-[#FED7AA] via-[#FEF08A] to-[#DCFCE7] text-[#C2410C]';
    if (c.includes('sport') || c.includes('fitness') || c.includes('outdoor')) return 'from-[#DCFCE7] via-[#BAE6FD] to-[#FEF08A] text-[#15803D]';
    if (c.includes('tech') || c.includes('business')) return 'from-[#E0F2FE] via-[#EDE9FE] to-[#F1F5F9] text-[#0369A1]';
    if (c.includes('family') || c.includes('kids')) return 'from-[#FCE7F3] via-[#FEF08A] to-[#BAE6FD] text-[#BE185D]';
    return 'from-[#E0F2FE] via-[#FEF9C3] to-[#FCE7F3] text-[#475569]';
  };

  if (!src || hasError) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-gradient-to-br ${getPastelFallbackGradient(category)} select-none ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-xs flex items-center justify-center shadow-xs mb-2">
          <Compass className="w-6 h-6 stroke-[1.5]" />
        </div>
        <p className="text-xs font-semibold tracking-wide text-center line-clamp-2 max-w-[80%] opacity-90">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br ${getPastelFallbackGradient(category)} animate-pulse flex items-center justify-center`}>
          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 opacity-70" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
