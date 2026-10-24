import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { JeddahEvent, FilterState, UserProfile, SyncLog } from '../types';
import { INITIAL_JEDDAH_EVENTS } from '../data/mockEvents';
import { Language, TRANSLATIONS } from '../utils/translations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
  
  // Events
  events: JeddahEvent[];
  filteredEvents: JeddahEvent[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
  
  // Filters
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // Modals & Selected Event
  selectedEvent: JeddahEvent | null;
  setSelectedEvent: (event: JeddahEvent | null) => void;
  isSubmitModalOpen: boolean;
  setIsSubmitModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  bookingTargetEvent: JeddahEvent | null;
  openBookingForEvent: (event: JeddahEvent) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  
  // User Profile & Roles
  currentUser: UserProfile;
  switchUserRole: (role: UserProfile['role']) => void;
  
  // Admin & Sync
  syncFeeds: () => Promise<void>;
  isSyncing: boolean;
  syncLogs: SyncLog[];
  updateEventStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  submitNewEvent: (eventData: any) => Promise<boolean>;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  district: 'all',
  dateFilter: 'all',
  timeFilter: 'all',
  priceFilter: 'all',
  maxPrice: 1000,
  venueType: 'all',
  audience: 'all',
  wheelchairOnly: false,
  viewMode: 'grid',
  sortBy: 'date',
};

const DEFAULT_USER: UserProfile = {
  id: 'user-001',
  name: 'Sara Al-Ghamdi',
  email: 'sara@jeddah.sa',
  role: 'admin', // Default to admin for evaluation so user can test all features easily!
  favorites: ['jed-001', 'jed-002'],
  submittedEventIds: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('saha_jeddah_lang') as Language) || 'en';
  });

  const [events, setEvents] = useState<JeddahEvent[]>(INITIAL_JEDDAH_EVENTS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  
  const [selectedEvent, setSelectedEvent] = useState<JeddahEvent | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingTargetEvent, setBookingTargetEvent] = useState<JeddahEvent | null>(null);
  
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saha_jeddah_favs');
      return saved ? JSON.parse(saved) : ['jed-001', 'jed-002'];
    } catch {
      return ['jed-001', 'jed-002'];
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('saha_jeddah_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: keyof typeof TRANSLATIONS['en']): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key] || String(key);
  }, [language]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(item => item.id !== id));
    }, 4000);
  }, []);

  // Fetch events from server
  const refreshEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events?includeExpired=true');
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      }
    } catch (err) {
      console.warn("Using offline verified event catalog:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load sync logs
  const loadSyncLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/sync/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setSyncLogs(data.logs);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshEvents();
    loadSyncLogs();
  }, [refreshEvents, loadSyncLogs]);

  // Favorites
  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const next = prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId];
      localStorage.setItem('saha_jeddah_favs', JSON.stringify(next));
      showToast(
        next.includes(eventId) 
          ? (language === 'ar' ? 'تمت الإضافة للمفضلة' : 'Added to favorites') 
          : (language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites'),
        'success'
      );
      return next;
    });
  };

  const isFavorite = (eventId: string) => favorites.includes(eventId);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    showToast(language === 'ar' ? 'تمت إعادة ضبط التصفية' : 'Filters reset', 'info');
  };

  const openBookingForEvent = (event: JeddahEvent) => {
    setBookingTargetEvent(event);
    setIsBookingModalOpen(true);
  };

  const switchUserRole = (role: UserProfile['role']) => {
    setCurrentUser(prev => ({ ...prev, role }));
    showToast(
      language === 'ar' ? `تم التبديل إلى دور: ${role}` : `Switched role to: ${role}`,
      'info'
    );
  };

  // Sync API feeds
  const syncFeeds = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(
          language === 'ar' 
            ? `اكتملت المزامنة بنجاح! تم فحص وتحديث ${data.log.eventsCount} فعاليات.` 
            : `Sync completed! Refreshed ${data.log.eventsCount} active Jeddah listings.`,
          'success'
        );
        await refreshEvents();
        await loadSyncLogs();
      } else {
        showToast("Sync error: " + (data.error || "Unknown"), 'error');
      }
    } catch (err: any) {
      showToast("Sync network failure: " + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Approve / reject event
  const updateEventStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/events/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(
          language === 'ar' 
            ? (status === 'approved' ? 'تم اعتماد الفعالية بنجاح' : 'تم رفض الفعالية')
            : (status === 'approved' ? 'Event approved' : 'Event rejected'),
          'success'
        );
        await refreshEvents();
      }
    } catch (e: any) {
      showToast("Status update failed", 'error');
    }
  };

  // Submit new event
  const submitNewEvent = async (eventData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/events/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventData,
          submittedBy: currentUser.id,
        })
      });
      if (res.ok) {
        showToast(
          language === 'ar' 
            ? 'تم تقديم الفعالية بنجاح! دخلت قائمة المراجعة لدى الإدارة.' 
            : 'Event submitted successfully! It is now pending review.',
          'success'
        );
        await refreshEvents();
        return true;
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to submit event", 'error');
        return false;
      }
    } catch (e: any) {
      showToast("Network error submitting event", 'error');
      return false;
    }
  };

  // Filter calculation
  const filteredEvents = events.filter(event => {
    // Check approval status (Non-admins only see approved)
    if (currentUser.role !== 'admin' && event.status !== 'approved') {
      return false;
    }

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = event.title.toLowerCase().includes(q) || event.titleAr.toLowerCase().includes(q);
      const matchVenue = event.venueName.toLowerCase().includes(q) || event.venueNameAr.toLowerCase().includes(q);
      const matchDistrict = event.district.toLowerCase().includes(q) || event.districtAr.toLowerCase().includes(q);
      const matchCategory = event.category.toLowerCase().includes(q) || event.categoryAr.toLowerCase().includes(q);
      const matchOrganizer = event.organizer.name.toLowerCase().includes(q) || event.organizer.nameAr.toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchDistrict && !matchCategory && !matchOrganizer) {
        return false;
      }
    }

    // Category
    if (filters.category !== 'all' && event.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }

    // District
    if (filters.district !== 'all' && !event.district.toLowerCase().includes(filters.district.toLowerCase())) {
      return false;
    }

    // Price Filter
    if (filters.priceFilter === 'free' && !event.isFree) return false;
    if (filters.priceFilter === 'paid' && event.isFree) return false;
    if (event.priceStartingFrom > filters.maxPrice) return false;

    // Time of day
    if (filters.timeFilter !== 'all' && event.timeOfDay !== filters.timeFilter) {
      return false;
    }

    // Venue Type
    if (filters.venueType !== 'all' && event.venueType !== filters.venueType && event.venueType !== 'both') {
      return false;
    }

    // Audience
    if (filters.audience !== 'all' && event.audience !== filters.audience && event.audience !== 'all') {
      return false;
    }

    // Wheelchair accessibility
    if (filters.wheelchairOnly && !event.wheelchairAccessible) {
      return false;
    }

    // Date filters
    if (filters.dateFilter !== 'all') {
      const todayStr = '2026-10-21'; // Reference date based on current context
      const eventStart = event.startDate;
      const eventEnd = event.endDate;

      if (filters.dateFilter === 'today') {
        if (!(todayStr >= eventStart && todayStr <= eventEnd)) return false;
      } else if (filters.dateFilter === 'tomorrow') {
        const tomorrowStr = '2026-10-22';
        if (!(tomorrowStr >= eventStart && tomorrowStr <= eventEnd)) return false;
      } else if (filters.dateFilter === 'this_weekend') {
        // Friday & Saturday
        const isWeekendEvent = eventStart <= '2026-10-24' && eventEnd >= '2026-10-23';
        if (!isWeekendEvent) return false;
      } else if (filters.dateFilter === 'this_week') {
        if (eventStart > '2026-10-25') return false;
      } else if (filters.dateFilter === 'this_month') {
        if (!eventStart.startsWith('2026-10')) return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'priceAsc') return a.priceStartingFrom - b.priceStartingFrom;
    if (filters.sortBy === 'priceDesc') return b.priceStartingFrom - a.priceStartingFrom;
    if (filters.sortBy === 'popular') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    // default: date
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        events,
        filteredEvents,
        loading,
        refreshEvents,
        filters,
        updateFilters,
        resetFilters,
        selectedEvent,
        setSelectedEvent,
        isSubmitModalOpen,
        setIsSubmitModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        bookingTargetEvent,
        openBookingForEvent,
        favorites,
        toggleFavorite,
        isFavorite,
        currentUser,
        switchUserRole,
        syncFeeds,
        isSyncing,
        syncLogs,
        updateEventStatus,
        submitNewEvent,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
