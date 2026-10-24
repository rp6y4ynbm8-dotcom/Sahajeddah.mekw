import React from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, Calendar, Clock, DollarSign, MapPin, Tag, Users, Check, X } from 'lucide-react';
import { EventCategory, JeddahDistrict } from '../types';

const CATEGORIES: { en: EventCategory; ar: string }[] = [
  { en: 'Arts & Culture', ar: 'الفنون والثقافة' },
  { en: 'Workshops', ar: 'ورش العمل' },
  { en: 'Educational Courses', ar: 'الدورات التعليمية' },
  { en: 'Seminars & Conferences', ar: 'المؤتمرات والندوات' },
  { en: 'Music & Concerts', ar: 'الموسيقى والحفلات' },
  { en: 'Festivals', ar: 'المهرجانات' },
  { en: 'Food & Dining Experiences', ar: 'تجارب المأكولات والمطاعم' },
  { en: 'Sports & Fitness', ar: 'الرياضة واللياقة' },
  { en: 'Outdoor Adventures', ar: 'مغامرات الهواء الطلق' },
  { en: 'Entertainment', ar: 'الترفيه' },
  { en: 'Family & Kids', ar: 'العائلة والأطفال' },
  { en: 'Business & Networking', ar: 'الأعمال والتشبيك' },
  { en: 'Technology', ar: 'التقنية والابتكار' },
  { en: 'Wellness', ar: 'الصحة والرفاهية' },
  { en: 'Community Activities', ar: 'الأنشطة المجتمعية' },
  { en: 'Exhibitions', ar: 'المعارض' },
  { en: 'Seasonal Events', ar: 'الفعاليات الموسمية' },
  { en: 'Other Experiences', ar: 'تجارب أخرى' },
];

const DISTRICTS: { en: string; ar: string }[] = [
  { en: 'Al Balad (Historic Jeddah)', ar: 'البلد (جدة التاريخية)' },
  { en: 'Al Shati & Corniche', ar: 'الشاطئ والكورنيش' },
  { en: 'Al Hamra', ar: 'الحمراء' },
  { en: 'Obhur Al Janoubiyah', ar: 'أبحر الجنوبية' },
  { en: 'Obhur Al Shamaliyah', ar: 'أبحر الشمالية' },
  { en: 'Al Rawdah', ar: 'الروضة' },
  { en: 'Al Zahra', ar: 'الزهراء' },
  { en: 'Al Salamah', ar: 'السلامة' },
  { en: 'Al Mohammadiyyah', ar: 'المحمدية' },
  { en: 'Jeddah Yacht Club & Marina', ar: 'نادي جدة لليخوت والمارينا' },
  { en: 'King Abdullah Sports City', ar: 'مدينة الملك عبدالله الرياضية' },
];

interface FilterSidebarProps {
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  const { language, t, filters, updateFilters, resetFilters, filteredEvents, events } = useApp();

  const datePresets = [
    { id: 'all', label: t('allDates') },
    { id: 'today', label: t('today') },
    { id: 'tomorrow', label: t('tomorrow') },
    { id: 'this_weekend', label: t('thisWeekend') },
    { id: 'this_week', label: t('thisWeek') },
    { id: 'this_month', label: t('thisMonth') },
  ];

  const timePresets = [
    { id: 'all', label: t('allTimes') },
    { id: 'morning', label: language === 'ar' ? 'صباحاً' : 'Morning' },
    { id: 'afternoon', label: language === 'ar' ? 'ظهراً' : 'Afternoon' },
    { id: 'evening', label: language === 'ar' ? 'مساءً' : 'Evening' },
    { id: 'night', label: language === 'ar' ? 'ليلاً' : 'Night' },
  ];

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-6' : 'p-5 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#E2E8F0] shadow-xs'}`}>
      
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
            {t('filters')}
          </h2>
          <span className="text-xs text-[#64748B]">
            {filteredEvents.length} {language === 'ar' ? 'فعالية مطابقة' : 'matching events'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:text-[#0369A1] cursor-pointer"
            title={t('resetFilters')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetFilters')}</span>
          </button>
          
          {isMobileDrawer && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Date Filter */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-[#334155]">
          <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>{t('date')}</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {datePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => updateFilters({ dateFilter: preset.id as any })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-colors cursor-pointer truncate ${
                filters.dateFilter === preset.id
                  ? 'bg-[#E0F2FE] text-[#0369A1] font-semibold border border-[#BAE6FD]'
                  : 'bg-white hover:bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Time of Day */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-[#334155]">
          <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>{t('timeOfDay')}</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {timePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => updateFilters({ timeFilter: preset.id as any })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filters.timeFilter === preset.id
                  ? 'bg-[#FEF08A] text-[#854D0E] font-semibold border border-[#FDE047]'
                  : 'bg-white hover:bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Filter */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-[#334155]">
          <Tag className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>{t('category')}</span>
        </label>
        <select
          value={filters.category}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="w-full text-xs p-2 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
        >
          <option value="all">{t('allCategories')}</option>
          {CATEGORIES.map((cat, i) => (
            <option key={i} value={cat.en}>
              {language === 'ar' ? cat.ar : cat.en}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Price Filter & Slider */}
      <div className="space-y-2.5">
        <label className="flex items-center justify-between text-xs font-bold text-[#334155]">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{t('price')}</span>
          </span>
          <span className="text-[11px] font-semibold text-[#0284C7]">
            {filters.priceFilter === 'free' ? t('freeOnly') : `≤ ${filters.maxPrice} ${t('sar')}`}
          </span>
        </label>

        <div className="grid grid-cols-3 gap-1.5">
          {(['all', 'free', 'paid'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => updateFilters({ priceFilter: mode })}
              className={`py-1.5 rounded-lg text-xs font-medium text-center transition-colors cursor-pointer ${
                filters.priceFilter === mode
                  ? 'bg-[#DCFCE7] text-[#15803D] font-semibold border border-[#BBF7D0]'
                  : 'bg-white hover:bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              {mode === 'all' ? t('allPrices') : mode === 'free' ? t('freeOnly') : t('paidOnly')}
            </button>
          ))}
        </div>

        {filters.priceFilter !== 'free' && (
          <div className="pt-2">
            <input
              type="range"
              min={0}
              max={1000}
              step={25}
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) })}
              className="w-full accent-[#0284C7] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#94A3B8]">
              <span>0 SAR</span>
              <span>500 SAR</span>
              <span>1000+ SAR</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. District in Jeddah */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-[#334155]">
          <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>{t('district')}</span>
        </label>
        <select
          value={filters.district}
          onChange={(e) => updateFilters({ district: e.target.value })}
          className="w-full text-xs p-2 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
        >
          <option value="all">{t('allDistricts')}</option>
          {DISTRICTS.map((d, i) => (
            <option key={i} value={d.en}>
              {language === 'ar' ? d.ar : d.en}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Venue & Audience & Accessibility Checkboxes */}
      <div className="space-y-3 pt-3 border-t border-[#F1F5F9]">
        
        {/* Venue Type */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">{t('venueType')}</span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
              { id: 'indoor', label: t('indoor') },
              { id: 'outdoor', label: t('outdoor') }
            ].map(v => (
              <button
                key={v.id}
                onClick={() => updateFilters({ venueType: v.id as any })}
                className={`text-[11px] py-1 px-1.5 rounded-md border text-center transition-colors cursor-pointer truncate ${
                  filters.venueType === v.id
                    ? 'bg-[#EDE9FE] border-[#DDD6FE] text-[#6B21A8] font-bold'
                    : 'bg-white border-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">{t('audience')}</span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
              { id: 'family', label: language === 'ar' ? 'عوائل' : 'Family' },
              { id: 'adults', label: language === 'ar' ? 'بالغين' : 'Adults' }
            ].map(a => (
              <button
                key={a.id}
                onClick={() => updateFilters({ audience: a.id as any })}
                className={`text-[11px] py-1 px-1.5 rounded-md border text-center transition-colors cursor-pointer truncate ${
                  filters.audience === a.id
                    ? 'bg-[#FED7AA] border-[#FDBA74] text-[#C2410C] font-bold'
                    : 'bg-white border-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wheelchair Accessible Toggle */}
        <label className="flex items-center gap-2 pt-1 text-xs text-[#334155] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.wheelchairOnly}
            onChange={(e) => updateFilters({ wheelchairOnly: e.target.checked })}
            className="rounded border-[#CBD5E1] text-[#0284C7] focus:ring-[#38BDF8]"
          />
          <span>{t('wheelchairAccessible')}</span>
        </label>

      </div>

    </div>
  );
};
