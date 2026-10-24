import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterSidebar } from './components/FilterSidebar';
import { EventCard } from './components/EventCard';
import { CalendarView } from './components/CalendarView';
import { MapView } from './components/MapView';
import { EventDetailsModal } from './components/EventDetailsModal';
import { BookingModal } from './components/BookingModal';
import { SubmitEventModal } from './components/SubmitEventModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { 
  Grid, List, Calendar as CalendarIcon, Map, Filter, 
  ArrowUpDown, Compass, CheckCircle2, Heart, Sparkles, X, ChevronDown 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    filteredEvents, filters, updateFilters, resetFilters, 
    language, t, toasts, favorites, events 
  } = useApp();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');

  // Quick categories for the subnav bar
  const quickCategories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All Events' },
    { id: 'Arts & Culture', label: language === 'ar' ? 'فنون وثقافة' : 'Arts & Culture' },
    { id: 'Workshops', label: language === 'ar' ? 'ورش عمل' : 'Workshops' },
    { id: 'Music & Concerts', label: language === 'ar' ? 'موسيقى' : 'Music' },
    { id: 'Food & Dining Experiences', label: language === 'ar' ? 'طعام ومطاعم' : 'Food & Dining' },
    { id: 'Outdoor Adventures', label: language === 'ar' ? 'مغامرات خارجية' : 'Outdoor' },
    { id: 'Family & Kids', label: language === 'ar' ? 'عائلة وأطفال' : 'Family & Kids' },
    { id: 'Wellness', label: language === 'ar' ? 'صحة ورفاهية' : 'Wellness' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col text-[#0F172A] selection:bg-[#FDE047]">
      
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Exploration Body */}
      <main id="events-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Category Horizontal Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-[#F1E9DF] mb-6">
          {quickCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCategoryTab(c.id);
                updateFilters({ category: c.id });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filters.category === c.id
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* View Switcher, Results Count & Mobile Filter Trigger Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] shadow-xs cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>{t('filters')}</span>
              {filteredEvents.length > 0 && (
                <span className="text-[10px] bg-[#E0F2FE] text-[#0369A1] px-1.5 py-0.2 rounded-full font-mono">
                  {filteredEvents.length}
                </span>
              )}
            </button>

            <div>
              <p className="text-sm font-extrabold text-[#0F172A]">
                {filteredEvents.length} {language === 'ar' ? 'فعالية وتجربة في جدة' : 'Events & Activities Found'}
              </p>
              <p className="text-[11px] text-[#64748B]">
                {language === 'ar' ? 'محدثة مباشرة حسب توقيت مكة المكرمة' : 'Verified live listings across Jeddah'}
              </p>
            </div>
          </div>

          {/* Right Action Group: View Mode Switcher + Sort Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="hidden md:inline font-medium">{t('sortBy')}:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                className="text-xs py-1.5 px-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
              >
                <option value="date">{t('sortNearestDate')}</option>
                <option value="priceAsc">{t('sortPriceAsc')}</option>
                <option value="priceDesc">{t('sortPriceDesc')}</option>
                <option value="popular">{t('sortPopular')}</option>
              </select>
            </div>

            {/* View Mode Segmented Control (Grid, List, Calendar, Map) */}
            <div className="flex items-center p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]">
              <button
                onClick={() => updateFilters({ viewMode: 'grid' })}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.viewMode === 'grid'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title={t('viewGrid')}
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => updateFilters({ viewMode: 'list' })}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.viewMode === 'list'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title={t('viewList')}
              >
                <List className="w-4 h-4" />
              </button>

              <button
                onClick={() => updateFilters({ viewMode: 'calendar' })}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.viewMode === 'calendar'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title={t('viewCalendar')}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => updateFilters({ viewMode: 'map' })}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.viewMode === 'map'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title={t('viewMap')}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Content Layout: Sidebar + Main Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <FilterSidebar />
          </div>

          {/* Main Display Area (Grid / List / Calendar / Map) */}
          <div className="lg:col-span-9">
            
            {/* 1. CALENDAR VIEW */}
            {filters.viewMode === 'calendar' && (
              <CalendarView />
            )}

            {/* 2. MAP VIEW */}
            {filters.viewMode === 'map' && (
              <MapView />
            )}

            {/* 3. GRID & LIST VIEWS */}
            {(filters.viewMode === 'grid' || filters.viewMode === 'list') && (
              <>
                {filteredEvents.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#CBD5E1] space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] text-[#854D0E] flex items-center justify-center mx-auto">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {language === 'ar' ? 'لم يتم العثور على فعاليات تطابق عوامل التصفية' : 'No matching events found'}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                        {language === 'ar' ? 'جرب تعديل أو إعادة ضبط معايير البحث والتصفية لاستكشاف أنشطة أخرى في جدة.' : 'Try broadening your search or resetting filters to explore other Jeddah activities.'}
                      </p>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      {t('resetFilters')}
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-5 ${filters.viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {filteredEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </main>

      {/* Quiet, Clean Footer */}
      <footer className="mt-20 border-t border-[#F1E9DF] bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-base font-extrabold text-[#0F172A] tracking-tight">
                {language === 'ar' ? 'ساحة جدة' : 'Saha Jeddah'}
              </span>
              <p className="text-xs text-[#64748B]">
                {t('brandTagline')} · Asia/Riyadh (UTC+3)
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-xs font-medium text-[#475569]">
              <span>Al Balad</span>
              <span>·</span>
              <span>Jeddah Waterfront</span>
              <span>·</span>
              <span>Obhur Creek</span>
              <span>·</span>
              <span>Al Hamra</span>
              <span>·</span>
              <span>Al Rawdah</span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
            <p>© 2026 Saha Jeddah. Curated daily for residents, tourists & creators.</p>
            <p className="text-[11px] font-mono">
              Authorized Sync Gateway · 1ef9ce1f...5c877
            </p>
          </div>

        </div>
      </footer>

      {/* Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div 
            className="w-full max-w-sm bg-white h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <FilterSidebar isMobileDrawer onCloseMobile={() => setMobileFilterOpen(false)} />
          </div>
        </div>
      )}

      {/* Modals */}
      <EventDetailsModal />
      <BookingModal />
      <SubmitEventModal />
      <AdminDashboardModal />

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`p-3.5 rounded-2xl shadow-lg border text-xs font-semibold pointer-events-auto flex items-center gap-2 animate-slideUp ${
                toast.type === 'success' ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' :
                toast.type === 'error' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' :
                'bg-slate-900 text-white border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
