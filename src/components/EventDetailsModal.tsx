import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, Calendar, Clock, MapPin, DollarSign, CheckCircle2, 
  Navigation, Share2, Heart, Shield, Globe, Mail, Phone, 
  AlertCircle, ArrowUpRight, Compass, Ticket, ExternalLink 
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { EventCard } from './EventCard';

export const EventDetailsModal: React.FC = () => {
  const { 
    selectedEvent, setSelectedEvent, language, t, 
    openBookingForEvent, toggleFavorite, isFavorite, 
    showToast, events 
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedEvent) return null;

  const favorited = isFavorite(selectedEvent.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#event-${selectedEvent.id}`);
      showToast(t('copiedLink'), 'success');
    }
  };

  const title = language === 'ar' ? selectedEvent.titleAr : selectedEvent.title;
  const description = language === 'ar' ? selectedEvent.descriptionAr : selectedEvent.description;
  const category = language === 'ar' ? selectedEvent.categoryAr : selectedEvent.category;
  const venue = language === 'ar' ? selectedEvent.venueNameAr : selectedEvent.venueName;
  const district = language === 'ar' ? selectedEvent.districtAr : selectedEvent.district;
  const organizer = language === 'ar' ? selectedEvent.organizer.nameAr : selectedEvent.organizer.name;

  // Related events (same district or category)
  const relatedEvents = events
    .filter(e => e.id !== selectedEvent.id && (e.category === selectedEvent.category || e.district === selectedEvent.district))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Floating Top Bar with Close, Favorite, Share */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#E0F2FE] text-[#0369A1] font-bold text-xs">
              {category}
            </span>
            <span className="text-xs text-[#64748B] hidden sm:inline">
              {district}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(selectedEvent.id)}
              className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#EF4444] transition-colors cursor-pointer"
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] transition-colors cursor-pointer"
              title="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedEvent(null)}
              className="p-2 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Gallery */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
              <ImageWithFallback
                src={selectedEvent.images[activeImageIndex] || selectedEvent.images[0]}
                alt={title}
                category={selectedEvent.category}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-xs font-semibold">
                  {selectedEvent.isFree ? t('free') : `${t('startingFrom')} ${selectedEvent.priceStartingFrom} ${t('sar')}`}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs font-mono">
                  {activeImageIndex + 1} / {selectedEvent.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {selectedEvent.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedEvent.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#0284C7] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback src={img} alt="Thumbnail" category={selectedEvent.category} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Event Title & Essential Info Strip */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap gap-4 text-xs text-[#475569] pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#0284C7]" />
                <span>{selectedEvent.startDate} {selectedEvent.endDate !== selectedEvent.startDate ? `— ${selectedEvent.endDate}` : ''}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-[#0284C7]" />
                <span>{selectedEvent.startTime} - {selectedEvent.endTime} (Asia/Riyadh)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#0284C7]" />
                <span>{venue}, {district}</span>
              </div>
            </div>
          </div>

          {/* Booking & Ticket Strip */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FEF9C3]/70 via-[#FFFDF9] to-[#E0F2FE]/60 border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#854D0E] block">
                {selectedEvent.isFree ? t('freeActivities') : t('ticketsAvailable')}
              </span>
              <div className="text-2xl font-extrabold text-[#0F172A]">
                {selectedEvent.isFree ? t('free') : `${selectedEvent.priceStartingFrom} ${t('sar')}`}
                {!selectedEvent.isFree && <span className="text-xs text-[#64748B] font-normal ml-1">/ person</span>}
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                {selectedEvent.bookingType === 'external' ? `Authorized provider: ${selectedEvent.externalProvider}` : 'Instant confirmed digital ticket'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {selectedEvent.bookingType === 'external' && selectedEvent.bookingUrl ? (
                <a
                  href={selectedEvent.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-sm transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('bookNow')} ({selectedEvent.externalProvider})</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button
                  onClick={() => openBookingForEvent(selectedEvent)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-sm transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{selectedEvent.isFree ? (language === 'ar' ? 'سجل مجاناً الآن' : 'Register Free Now') : t('bookNow')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2">
              {t('aboutEvent')}
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Ticket Tiers Details (if internal or listed) */}
          {selectedEvent.tickets && selectedEvent.tickets.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2">
                {t('ticketTiers')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedEvent.tickets.map((tier) => (
                  <div key={tier.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0F172A]">
                        {language === 'ar' ? tier.nameAr : tier.name}
                      </span>
                      <span className="font-extrabold text-xs text-[#0284C7]">
                        {tier.price === 0 ? t('free') : `${tier.price} ${t('sar')}`}
                      </span>
                    </div>
                    {tier.description && (
                      <p className="text-[11px] text-[#64748B] leading-normal">{tier.description}</p>
                    )}
                    <span className="text-[10px] text-[#15803D] font-medium block">
                      {tier.availableCapacity} seats left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location & Directions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <h2 className="text-base font-bold text-[#0F172A]">
                {t('locationVenue')}
              </h2>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEvent.coordinates.lat},${selectedEvent.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#0284C7] hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t('directions')}</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <p className="font-bold text-sm text-[#0F172A]">{venue}</p>
              <p className="text-xs text-[#64748B]">{selectedEvent.address}</p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#0284C7]">
                <span>Lat: {selectedEvent.coordinates.lat}</span>
                <span>Lng: {selectedEvent.coordinates.lng}</span>
              </div>
            </div>
          </div>

          {/* Organizer Info & Verification */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2">
              {t('organizer')}
            </h2>
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0F172A]">{organizer}</span>
                  {selectedEvent.organizer.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t('verifiedOrganizer')}</span>
                    </span>
                  )}
                </div>
                {selectedEvent.organizer.socialInstagram && (
                  <p className="text-xs text-[#64748B] font-mono">{selectedEvent.organizer.socialInstagram}</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs">
                {selectedEvent.organizer.website && (
                  <a
                    href={selectedEvent.organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#0284C7] hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </a>
                )}
                {selectedEvent.organizer.contactEmail && (
                  <a
                    href={`mailto:${selectedEvent.organizer.contactEmail}`}
                    className="flex items-center gap-1 text-[#475569] hover:text-[#0F172A]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Requirements, Accessibility & Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FFFDF9] space-y-2">
              <span className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
                {t('accessibility')} & {t('ageRequirement')}
              </span>
              <p className="text-xs text-[#475569]">
                {language === 'ar' ? selectedEvent.ageRestrictionAr || 'متاح للجميع' : selectedEvent.ageRestriction || 'All ages welcome'}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#15803D]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{selectedEvent.wheelchairAccessible ? 'Wheelchair accessible venue' : 'Limited wheelchair access'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FFFDF9] space-y-2">
              <span className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider">
                {t('sourceProvider')}
              </span>
              <p className="text-xs text-[#475569]">
                Source feed: <strong className="text-[#0F172A]">{selectedEvent.source}</strong>
              </p>
              <p className="text-[11px] text-[#94A3B8]">
                {t('lastUpdated')}: {new Date(selectedEvent.lastUpdated).toLocaleString('en-US', { timeZone: 'Asia/Riyadh' })}
              </p>
            </div>
          </div>

          {/* Related Activities */}
          {relatedEvents.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
              <h2 className="text-base font-bold text-[#0F172A]">
                {t('relatedEvents')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedEvents.map(re => (
                  <EventCard key={re.id} event={re} isCompact />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
