import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JeddahEvent } from '../types';
import { MapPin, Navigation, ExternalLink, Calendar, ArrowUpRight, Compass, Layers } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export const MapView: React.FC = () => {
  const { language, t, filteredEvents, setSelectedEvent, openBookingForEvent } = useApp();
  const [activePinEvent, setActivePinEvent] = useState<JeddahEvent | null>(filteredEvents[0] || null);
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');

  // Jeddah districts coordinate map bounding
  // Latitude: ~21.46 (South/Balad) to ~21.76 (North/Sports City & Obhur)
  // Longitude: ~39.09 (Coast/Yacht Club) to ~39.22 (East)
  const minLat = 21.46;
  const maxLat = 21.78;
  const minLng = 39.08;
  const maxLng = 39.22;

  // Transform geo-coordinates to SVG percentage (X, Y)
  const getSvgCoordinates = (lat: number, lng: number) => {
    // Note: Lat goes from South to North, SVG Y goes top to bottom (so invert Y)
    const yPct = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10;
    const xPct = ((lng - minLng) / (maxLng - minLng)) * 75 + 15;
    return { x: Math.max(10, Math.min(90, xPct)), y: Math.max(8, Math.min(92, yPct)) };
  };

  const displayedEvents = selectedDistrictFilter === 'all'
    ? filteredEvents
    : filteredEvents.filter(e => e.district.toLowerCase().includes(selectedDistrictFilter.toLowerCase()));

  const districtPills = [
    { id: 'all', label: language === 'ar' ? 'كامل جدة' : 'All Jeddah' },
    { id: 'Balad', label: language === 'ar' ? 'البلد التاريخية' : 'Al Balad' },
    { id: 'Corniche', label: language === 'ar' ? 'الكورنيش والشاطئ' : 'Corniche' },
    { id: 'Hamra', label: language === 'ar' ? 'الحمراء' : 'Al Hamra' },
    { id: 'Obhur', label: language === 'ar' ? 'أبحر' : 'Obhur' },
    { id: 'Rawdah', label: language === 'ar' ? 'الروضة' : 'Al Rawdah' },
    { id: 'Yacht', label: language === 'ar' ? 'نادي اليخوت' : 'Yacht Club' },
  ];

  return (
    <div className="space-y-6">
      
      {/* District quick filter bar above map */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-[#64748B] flex items-center gap-1 shrink-0">
          <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>{language === 'ar' ? 'المناطق:' : 'Districts:'}</span>
        </span>
        {districtPills.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedDistrictFilter(p.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedDistrictFilter === p.id
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white hover:bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Map + Card Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Map Visual Area */}
        <div className="lg:col-span-8 bg-[#F0FDF4] rounded-3xl border border-[#CBD5E1] p-4 sm:p-6 relative overflow-hidden shadow-sm min-h-[520px] flex flex-col justify-between">
          
          {/* Subtle coastline styling background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Red Sea waters on western side (Left) */}
            <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-[#BAE6FD]/40 to-transparent" />
            
            {/* Jeddah Coastline line */}
            <svg className="w-full h-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 28 0 Q 24 20 22 40 Q 26 60 20 75 Q 16 88 18 100"
                fill="none"
                stroke="#0284C7"
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              <path
                d="M 22 28 Q 38 29 42 26"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Map Top Bar overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs shadow-xs border border-[#E2E8F0] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0284C7]" />
              <span className="text-xs font-bold text-[#0F172A]">
                {language === 'ar' ? 'خريطة فعاليات جدة التفاعلية' : 'Interactive Map of Jeddah'}
              </span>
            </div>

            <div className="text-[11px] font-semibold text-[#0369A1] bg-[#E0F2FE] px-3 py-1 rounded-lg border border-[#BAE6FD]">
              {displayedEvents.length} {language === 'ar' ? 'مواقع معتمدة' : 'Verified Locations'}
            </div>
          </div>

          {/* Map Surface with Location Pins */}
          <div className="relative z-10 w-full h-96 sm:h-[420px] my-4">
            
            {/* Landmark text labels along the coast */}
            <div className="absolute top-[8%] left-[6%] text-[10px] font-bold text-[#0284C7] bg-white/70 px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
              {language === 'ar' ? 'شمال أبحر' : 'North Obhur'}
            </div>
            <div className="absolute top-[28%] left-[10%] text-[10px] font-bold text-[#0284C7] bg-white/70 px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
              {language === 'ar' ? 'نادي اليخوت والمارينا' : 'Jeddah Yacht Club'}
            </div>
            <div className="absolute top-[52%] left-[12%] text-[10px] font-bold text-[#0284C7] bg-white/70 px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
              {language === 'ar' ? 'واجهة جدة البحرية' : 'Jeddah Waterfront'}
            </div>
            <div className="absolute top-[70%] left-[8%] text-[10px] font-bold text-[#0284C7] bg-white/70 px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
              {language === 'ar' ? 'كورنيش الحمراء' : 'Al Hamra Corniche'}
            </div>
            <div className="absolute top-[84%] left-[16%] text-[10px] font-bold text-[#854D0E] bg-[#FEF08A]/80 px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
              {language === 'ar' ? 'منطقة البلد التاريخية' : 'Historic Al Balad'}
            </div>

            {/* Event Pins */}
            {displayedEvents.map((event) => {
              const { x, y } = getSvgCoordinates(event.coordinates.lat, event.coordinates.lng);
              const isSelected = activePinEvent?.id === event.id;

              return (
                <div
                  key={event.id}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-125 z-20"
                  onClick={() => setActivePinEvent(event)}
                >
                  <div
                    className={`relative flex items-center justify-center p-2 rounded-full shadow-md transition-all ${
                      isSelected
                        ? 'bg-[#0284C7] text-white ring-4 ring-[#38BDF8]/40 scale-120 z-30'
                        : 'bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#FEF08A]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    
                    {/* Small price tag on pin */}
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px] font-bold shadow-xs">
                      {event.isFree ? t('free') : `${event.priceStartingFrom} ${t('sar')}`}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Map Footer helper info */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#64748B] bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl border border-[#E2E8F0]">
            <span>{language === 'ar' ? 'انقر على أي نقطة لاستعراض الفعالية والمسار' : 'Click any map pin to preview event & directions'}</span>
            <span className="font-mono text-[11px] text-[#0284C7]">21.5433° N, 39.1728° E</span>
          </div>

        </div>

        {/* Selected Map Pin Event Preview Panel */}
        <div className="lg:col-span-4">
          {activePinEvent ? (
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-md p-5 space-y-4">
              
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={activePinEvent.images[0]}
                  alt={language === 'ar' ? activePinEvent.titleAr : activePinEvent.title}
                  category={activePinEvent.category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-white/95 text-xs font-bold text-[#0F172A] shadow-xs">
                    {language === 'ar' ? activePinEvent.categoryAr : activePinEvent.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span className="font-semibold text-[#0F172A]">
                    {language === 'ar' ? activePinEvent.venueNameAr : activePinEvent.venueName}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F172A] leading-tight">
                  {language === 'ar' ? activePinEvent.titleAr : activePinEvent.title}
                </h3>

                <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                  {language === 'ar' ? activePinEvent.descriptionAr : activePinEvent.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-[#475569] pt-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{activePinEvent.startDate}</span>
                  <span>·</span>
                  <span>{activePinEvent.startTime} - {activePinEvent.endTime}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#64748B] font-medium">{t('startingFrom')}</span>
                  <span className="text-base font-bold text-[#0F172A]">
                    {activePinEvent.isFree ? t('free') : `${activePinEvent.priceStartingFrom} ${t('sar')}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedEvent(activePinEvent)}
                    className="py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-semibold text-[#334155] cursor-pointer text-center"
                  >
                    {t('viewDetails')}
                  </button>

                  <button
                    onClick={() => openBookingForEvent(activePinEvent)}
                    className="py-2.5 px-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-xs font-semibold text-white shadow-xs cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <span>{t('bookNow')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Direct Google Maps Navigation Button */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activePinEvent.coordinates.lat},${activePinEvent.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t('openInGoogleMaps')}</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 text-center text-xs text-[#64748B]">
              {language === 'ar' ? 'حدد فعالية على الخريطة لعرض تفاصيلها' : 'Select an event on the map to view details'}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
