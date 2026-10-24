import React from 'react';
import { JeddahEvent } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Heart, ArrowUpRight, Sun, Moon, CheckCircle2, Share2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface EventCardProps {
  event: JeddahEvent;
  isCompact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isCompact = false }) => {
  const { language, t, setSelectedEvent, openBookingForEvent, toggleFavorite, isFavorite, showToast } = useApp();
  const favorited = isFavorite(event.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#event-${event.id}`);
      showToast(t('copiedLink'), 'success');
    }
  };

  const title = language === 'ar' ? event.titleAr : event.title;
  const description = language === 'ar' ? event.descriptionAr : event.description;
  const category = language === 'ar' ? event.categoryAr : event.category;
  const venue = language === 'ar' ? event.venueNameAr : event.venueName;
  const district = language === 'ar' ? event.districtAr : event.district;
  const organizer = language === 'ar' ? event.organizer.nameAr : event.organizer.name;

  return (
    <div 
      onClick={() => setSelectedEvent(event)}
      className="group relative rounded-2xl bg-white border border-[#F1E9DF] hover:border-[#CBD5E1] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Card Media Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <ImageWithFallback
          src={event.images[0]}
          alt={title}
          category={event.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Soft measured contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Badge */}
          <span className="pointer-events-auto px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#0F172A] shadow-xs">
            {category}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Daytime / Nighttime indicator */}
            <span 
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold backdrop-blur-xs ${
                event.timeOfDay === 'night' || event.timeOfDay === 'evening'
                  ? 'bg-slate-900/80 text-[#FEF08A]'
                  : 'bg-white/90 text-[#D97706]'
              }`}
            >
              {event.timeOfDay === 'night' || event.timeOfDay === 'evening' ? (
                <>
                  <Moon className="w-3 h-3" />
                  <span>{t('nighttime')}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3" />
                  <span>{t('daytime')}</span>
                </>
              )}
            </span>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(event.id);
              }}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#64748B] hover:text-[#EF4444] shadow-xs transition-colors cursor-pointer"
              aria-label="Save to favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Price Tag over bottom corner of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur-xs text-[11px] font-medium">
            <Calendar className="w-3 h-3 text-[#38BDF8]" />
            <span>{event.startDate}</span>
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-[#FEF08A] text-[#854D0E] font-bold text-xs shadow-xs">
            {event.isFree ? t('free') : `${event.priceStartingFrom} ${t('sar')}`}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Location & Time text metadata with separators */}
          <div className="flex items-center gap-2 text-[11px] text-[#64748B] flex-wrap">
            <span className="flex items-center gap-1 font-medium text-[#334155]">
              <MapPin className="w-3 h-3 text-[#0284C7] shrink-0" />
              <span className="truncate max-w-[150px]">{district}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{event.startTime}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#0284C7] transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Organizer & Action footer */}
        <div className="pt-3 border-t border-[#F1F5F9] space-y-2.5">
          
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[#475569] truncate">
              <span className="truncate font-medium">{organizer}</span>
              {event.organizer.verified && (
                <span title="Verified Organizer" className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event);
              }}
              className="w-full py-2 px-2 text-center text-xs font-semibold rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] transition-colors cursor-pointer truncate"
            >
              {t('viewDetails')}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openBookingForEvent(event);
              }}
              className="w-full py-2 px-2 text-center text-xs font-semibold rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              <span>{event.isFree ? (language === 'ar' ? 'سجل مجاناً' : 'Register Free') : t('bookNow')}</span>
              <ArrowUpRight className="w-3 h-3 shrink-0" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
