import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles, Calendar, Clock, MapPin, ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export const HeroSection: React.FC = () => {
  const { language, t, filters, updateFilters, events, setSelectedEvent, openBookingForEvent } = useApp();
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  const featuredEvents = events.filter(e => e.isFeatured && e.status === 'approved');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchQuery: searchInput });
    const target = document.getElementById('events-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const quickFilterTags = [
    { label: t('happeningToday'), filter: { dateFilter: 'today' as const } },
    { label: t('thisWeekend'), filter: { dateFilter: 'this_weekend' as const } },
    { label: t('freeActivities'), filter: { priceFilter: 'free' as const } },
    { label: t('trendingInJeddah'), filter: { sortBy: 'popular' as const } },
    { label: t('workshopsCourses'), filter: { category: 'Workshops' } },
    { label: t('familyFriendly'), filter: { audience: 'family' as const } },
  ];

  const currentFeatured = featuredEvents[activeCarouselIndex] || featuredEvents[0];

  const nextSlide = () => {
    setActiveCarouselIndex((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setActiveCarouselIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 pastel-bg-glow border-b border-[#F1E9DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Value Prop, Search & Quick Pills */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Playful regional badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#FDE047] shadow-xs text-xs font-semibold text-[#854D0E]">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              <span>{language === 'ar' ? 'عروس البحر الأحمر · دليل الفعاليات اليومي' : 'Bride of the Red Sea · Daily City Discovery'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] text-balance">
              {t('heroHeadline')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl">
              {t('heroSubtitle')}
            </p>

            {/* Prominent Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="flex items-center p-1.5 rounded-2xl bg-white border border-[#CBD5E1] shadow-md focus-within:ring-2 focus-within:ring-[#38BDF8] focus-within:border-transparent transition-all">
                <div className="pl-3 pr-2 text-[#94A3B8]">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-transparent px-2 py-2 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  {t('searchButton')}
                </button>
              </div>
            </form>

            {/* Quick Discovery Tags (Interactive Filter Buttons) */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                {language === 'ar' ? 'اكتشاف سريع' : 'Quick Discovery'}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickFilterTags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      updateFilters(tag.filter);
                      const target = document.getElementById('events-section');
                      if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#94A3B8] text-xs font-medium text-[#334155] cursor-pointer shadow-xs transition-all whitespace-nowrap"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Featured Activity Carousel Card */}
          {currentFeatured && (
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E2E8F0] shadow-xl transition-all duration-300 hover:shadow-2xl">
                
                {/* Carousel Image */}
                <div className="relative h-64 sm:h-72 w-full">
                  <ImageWithFallback
                    src={currentFeatured.images[0]}
                    alt={language === 'ar' ? currentFeatured.titleAr : currentFeatured.title}
                    category={currentFeatured.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Category & Status Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-bold text-[#0F172A] shadow-xs">
                      {language === 'ar' ? currentFeatured.categoryAr : currentFeatured.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FEF08A] text-[#854D0E] text-[11px] font-bold shadow-xs">
                      {language === 'ar' ? 'فعالية مختارة' : 'Featured Event'}
                    </span>
                  </div>

                  {/* Date & Title on image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 text-xs font-medium text-white/90 mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{currentFeatured.startDate}</span>
                      <span>·</span>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? currentFeatured.districtAr : currentFeatured.district}</span>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2 leading-tight">
                      {language === 'ar' ? currentFeatured.titleAr : currentFeatured.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Action Bar */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                    {language === 'ar' ? currentFeatured.descriptionAr : currentFeatured.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                    <div>
                      <span className="text-[11px] text-[#64748B] block font-medium">
                        {currentFeatured.isFree ? t('free') : t('startingFrom')}
                      </span>
                      <span className="text-base font-extrabold text-[#0F172A]">
                        {currentFeatured.isFree ? t('free') : `${currentFeatured.priceStartingFrom} ${t('sar')}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEvent(currentFeatured)}
                        className="px-3 py-2 text-xs font-semibold text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl cursor-pointer transition-colors"
                      >
                        {t('viewDetails')}
                      </button>
                      <button
                        onClick={() => openBookingForEvent(currentFeatured)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl cursor-pointer transition-colors shadow-xs flex items-center gap-1"
                      >
                        <span>{t('bookNow')}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                {featuredEvents.length > 1 && (
                  <div className="absolute top-1/3 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none">
                    <button
                      onClick={prevSlide}
                      className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#0F172A] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      aria-label="Previous Featured Event"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#0F172A] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      aria-label="Next Featured Event"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
