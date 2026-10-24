import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Calendar as CalendarIcon, MapPin, PlusCircle, Heart, Shield, Globe, Menu, X, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, currentUser, switchUserRole, favorites, setIsSubmitModalOpen, setIsAdminModalOpen, updateFilters, filters } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navLinks = [
    {
      label: t('explore'),
      action: () => updateFilters({ viewMode: 'grid' }),
      active: filters.viewMode === 'grid' || filters.viewMode === 'list',
    },
    {
      label: t('calendar'),
      action: () => updateFilters({ viewMode: 'calendar' }),
      active: filters.viewMode === 'calendar',
    },
    {
      label: t('map'),
      action: () => updateFilters({ viewMode: 'map' }),
      active: filters.viewMode === 'map',
    },
    {
      label: `${t('savedFavorites')} (${favorites.length})`,
      action: () => {
        // Filter to only favorites
        const el = document.getElementById('events-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      active: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F1E9DF] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FED7AA] via-[#FDE047] to-[#BAE6FD] flex items-center justify-center shadow-xs text-[#0F172A] group-hover:rotate-6 transition-transform">
            <Compass className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-extrabold bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#475569] bg-clip-text text-transparent">
            {language === 'ar' ? 'ساحة جدة' : 'Saha Jeddah'}
          </span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={link.action}
              className={`hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
                link.active ? 'text-[#0F172A] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0F172A] after:rounded-full' : ''
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-[#0369A1] font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('submitEvent')}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action & language switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white/80 hover:bg-[#F8FAFC] text-xs font-semibold text-[#334155] shadow-xs cursor-pointer transition-all whitespace-nowrap shrink-0"
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* User Role / Admin Access */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-medium text-[#1E293B] cursor-pointer transition-all whitespace-nowrap shrink-0"
            >
              <User className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="hidden sm:inline capitalize">{currentUser.role}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E2E8F0] font-mono uppercase">{currentUser.role.slice(0, 3)}</span>
            </button>

            {userDropdownOpen && (
              <div 
                className={`absolute top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-50 text-xs ${
                  language === 'ar' ? 'left-0' : 'right-0'
                }`}
              >
                <div className="px-3 py-2 border-b border-[#F1F5F9]">
                  <p className="font-bold text-[#0F172A] truncate">{currentUser.name}</p>
                  <p className="text-[#64748B] truncate text-[11px]">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <p className="px-3 py-1 text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                    {language === 'ar' ? 'تبديل الدور للاختبار' : 'Switch Persona'}
                  </p>
                  {(['admin', 'organizer', 'attendee', 'visitor'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        switchUserRole(role);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 hover:bg-[#F8FAFC] flex items-center justify-between capitalize cursor-pointer ${
                        currentUser.role === role ? 'font-bold text-[#0284C7] bg-[#F0F9FF]' : 'text-[#334155]'
                      }`}
                    >
                      <span>{role}</span>
                      {currentUser.role === role && <span className="text-[10px] text-[#0284C7]">Active</span>}
                    </button>
                  ))}
                </div>

                <div className="border-t border-[#F1F5F9] pt-1">
                  <button
                    onClick={() => {
                      setIsAdminModalOpen(true);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-start px-3 py-2 hover:bg-[#EFF6FF] text-[#0369A1] font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{t('adminDashboard')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0F172A] bg-[#FEF08A] hover:bg-[#FDE047] rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer border border-[#FACC15]/60"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t('adminDashboard')}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-2.5">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                link.action();
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-3 py-2 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setIsSubmitModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-start px-3 py-2 rounded-lg text-sm font-semibold text-[#0369A1] bg-[#E0F2FE]/50 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('submitEvent')}</span>
          </button>
          <button
            onClick={() => {
              setIsAdminModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-start px-3 py-2 rounded-lg text-sm font-semibold text-[#854D0E] bg-[#FEF9C3] flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>{t('adminDashboard')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
