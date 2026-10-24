export type EventCategory =
  | 'Arts & Culture'
  | 'Workshops'
  | 'Educational Courses'
  | 'Seminars & Conferences'
  | 'Music & Concerts'
  | 'Festivals'
  | 'Food & Dining Experiences'
  | 'Sports & Fitness'
  | 'Outdoor Adventures'
  | 'Entertainment'
  | 'Family & Kids'
  | 'Business & Networking'
  | 'Technology'
  | 'Wellness'
  | 'Community Activities'
  | 'Exhibitions'
  | 'Seasonal Events'
  | 'Other Experiences';

export type JeddahDistrict =
  | 'Al Balad (Historic Jeddah)'
  | 'Al Shati & Corniche'
  | 'Al Hamra'
  | 'Obhur Al Janoubiyah'
  | 'Obhur Al Shamaliyah'
  | 'Al Rawdah'
  | 'Al Zahra'
  | 'Al Salamah'
  | 'Al Mohammadiyyah'
  | 'Jeddah Yacht Club & Marina'
  | 'King Abdullah Sports City'
  | 'Al Andalus';

export type EventStatus = 'approved' | 'pending' | 'rejected' | 'archived' | 'cancelled';

export interface TicketTier {
  id: string;
  name: string;
  nameAr: string;
  price: number; // in SAR (0 for free)
  description?: string;
  descriptionAr?: string;
  availableCapacity: number;
}

export interface OrganizerInfo {
  name: string;
  nameAr: string;
  verified: boolean;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  socialInstagram?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface JeddahEvent {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: EventCategory;
  categoryAr: string;
  status: EventStatus;
  
  // Highlighting flags
  isFeatured?: boolean;
  isTrending?: boolean;
  isHiddenGem?: boolean;
  
  // Date and Time (Asia/Riyadh timezone)
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  
  // Venue and Location
  venueName: string;
  venueNameAr: string;
  district: string;
  districtAr: string;
  address: string;
  coordinates: Coordinates;
  venueType: 'indoor' | 'outdoor' | 'both';
  
  // Pricing and Ticketing
  isFree: boolean;
  priceStartingFrom: number; // in SAR
  tickets: TicketTier[];
  bookingType: 'internal' | 'external';
  bookingUrl?: string;
  externalProvider?: 'webook' | 'Ticket Tailor' | 'Platinumlist' | 'Eventbrite' | 'Official Tourism' | 'Community';
  externalId?: string;
  
  // Audience and Accessibility
  audience: 'all' | 'family' | 'adults';
  wheelchairAccessible: boolean;
  accessibleParking: boolean;
  ageRestriction?: string;
  ageRestrictionAr?: string;
  requirements?: string[];
  cancellationPolicy?: string;
  
  // Media & Metadata
  images: string[];
  organizer: OrganizerInfo;
  source: string;
  lastUpdated: string;
  createdAt: string;
  submittedBy?: string; // user id
  adminNotes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'attendee' | 'organizer' | 'admin';
  favorites: string[];
  submittedEventIds: string[];
}

export interface SyncLog {
  id: string;
  timestamp: string;
  provider: string;
  status: 'success' | 'warning' | 'error';
  eventsCount: number;
  message: string;
  durationMs: number;
}

export interface FilterState {
  searchQuery: string;
  category: string; // 'all' or EventCategory
  district: string; // 'all' or district string
  dateFilter: 'all' | 'today' | 'tomorrow' | 'this_weekend' | 'this_week' | 'next_week' | 'this_month' | 'custom';
  customDateStart?: string;
  customDateEnd?: string;
  timeFilter: 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
  priceFilter: 'all' | 'free' | 'paid';
  maxPrice: number;
  venueType: 'all' | 'indoor' | 'outdoor';
  audience: 'all' | 'family' | 'adults';
  wheelchairOnly: boolean;
  viewMode: 'grid' | 'list' | 'calendar' | 'map';
  sortBy: 'date' | 'priceAsc' | 'priceDesc' | 'popular';
}
