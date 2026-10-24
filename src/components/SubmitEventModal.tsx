import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, PlusCircle, Calendar, Clock, MapPin, Tag, DollarSign, Image, Check, AlertCircle } from 'lucide-react';
import { EventCategory, JeddahDistrict } from '../types';

export const SubmitEventModal: React.FC = () => {
  const { isSubmitModalOpen, setIsSubmitModalOpen, language, t, submitNewEvent, showToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [category, setCategory] = useState<EventCategory>('Workshops');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  
  // Date & Time
  const [startDate, setStartDate] = useState('2026-10-25');
  const [endDate, setEndDate] = useState('2026-10-25');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('21:00');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('evening');
  
  // Venue
  const [venueName, setVenueName] = useState('');
  const [venueNameAr, setVenueNameAr] = useState('');
  const [district, setDistrict] = useState<JeddahDistrict>('Al Shati & Corniche');
  const [address, setAddress] = useState('');
  const [venueType, setVenueType] = useState<'indoor' | 'outdoor' | 'both'>('indoor');
  
  // Pricing
  const [isFree, setIsFree] = useState(true);
  const [priceStartingFrom, setPriceStartingFrom] = useState(0);
  const [capacity, setCapacity] = useState(50);
  const [bookingUrl, setBookingUrl] = useState('');

  // Organizer & Accessibility
  const [organizerName, setOrganizerName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [wheelchairAccessible, setWheelchairAccessible] = useState(true);
  const [accessibleParking, setAccessibleParking] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  if (!isSubmitModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !startDate || !venueName.trim()) {
      showToast(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await submitNewEvent({
      title,
      titleAr: titleAr || title,
      category,
      description,
      descriptionAr: descriptionAr || description,
      startDate,
      endDate: endDate || startDate,
      startTime,
      endTime,
      timeOfDay,
      venueName,
      venueNameAr: venueNameAr || venueName,
      district,
      address: address || `${venueName}, ${district}, Jeddah`,
      venueType,
      isFree,
      priceStartingFrom: isFree ? 0 : Number(priceStartingFrom),
      capacity: Number(capacity),
      bookingUrl: bookingUrl.trim() || undefined,
      organizerName: organizerName || "Jeddah Community Organizer",
      contactEmail,
      contactPhone,
      wheelchairAccessible,
      accessibleParking,
      images: imageUrl.trim() ? [imageUrl.trim()] : undefined,
    });

    setIsSubmitting(false);
    if (success) {
      setIsSubmitModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden my-8 max-h-[92vh] flex flex-col animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#0284C7]" />
              <span>{language === 'ar' ? 'تقديم فعالية جديدة في جدة' : 'Submit a New Event in Jeddah'}</span>
            </h2>
            <p className="text-xs text-[#64748B]">
              {language === 'ar' ? 'جميع الفعاليات تخضع للمراجعة قبل النشر في المنصة' : 'Submissions are reviewed by our team before going live'}
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(false)}
            className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          
          {/* Step 1: Basic Information & Timing */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              {language === 'ar' ? '١. تفاصيل الفعالية والتوقيت' : '1. Event Details & Timing'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Event Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Al Balad Artisan Calligraphy Night"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  عنوان الفعالية (بالعربية)
                </label>
                <input
                  type="text"
                  value={titleAr}
                  onChange={e => setTitleAr(e.target.value)}
                  placeholder="مثال: ليلة الخط العربي الحرفية في البلد"
                  dir="rtl"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  {t('category')} *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                >
                  <option value="Workshops">Workshops / ورش عمل</option>
                  <option value="Arts & Culture">Arts & Culture / فنون وثقافة</option>
                  <option value="Music & Concerts">Music & Concerts / موسيقى وحفلات</option>
                  <option value="Food & Dining Experiences">Food & Dining / مأكولات ومطاعم</option>
                  <option value="Sports & Fitness">Sports & Fitness / رياضة ولياقة</option>
                  <option value="Outdoor Adventures">Outdoor Adventures / مغامرات خارجية</option>
                  <option value="Family & Kids">Family & Kids / عائلة وأطفال</option>
                  <option value="Technology">Technology / تقنية</option>
                  <option value="Wellness">Wellness / صحة ورفاهية</option>
                  <option value="Community Activities">Community / أنشطة مجتمعية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  {t('timeOfDay')}
                </label>
                <select
                  value={timeOfDay}
                  onChange={e => setTimeOfDay(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                >
                  <option value="evening">Evening (17:00 - 21:00)</option>
                  <option value="morning">Morning (06:00 - 12:00)</option>
                  <option value="afternoon">Afternoon (12:00 - 17:00)</option>
                  <option value="night">Night (21:00 - Late)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#CBD5E1]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#CBD5E1]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#CBD5E1]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[#CBD5E1]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Description (English)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What can attendees look forward to at this Jeddah event?"
                className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
              />
            </div>
          </div>

          {/* Step 2: Location, Pricing & Organizer */}
          <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
            <h3 className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              {language === 'ar' ? '٢. الموقع، التذاكر والجهة المنظمة' : '2. Venue, Tickets & Organizer'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={e => setVenueName(e.target.value)}
                  placeholder="e.g. Historic Jeddah Courtyard"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Jeddah District *
                </label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                >
                  <option value="Al Balad (Historic Jeddah)">Al Balad (Historic Jeddah)</option>
                  <option value="Al Shati & Corniche">Al Shati & Corniche</option>
                  <option value="Al Hamra">Al Hamra</option>
                  <option value="Obhur Al Janoubiyah">Obhur Al Janoubiyah</option>
                  <option value="Obhur Al Shamaliyah">Obhur Al Shamaliyah</option>
                  <option value="Al Rawdah">Al Rawdah</option>
                  <option value="Al Zahra">Al Zahra</option>
                  <option value="Al Salamah">Al Salamah</option>
                  <option value="Jeddah Yacht Club & Marina">Jeddah Yacht Club & Marina</option>
                  <option value="King Abdullah Sports City">King Abdullah Sports City</option>
                </select>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#CBD5E1] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">Admission Type</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFree(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      isFree ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]' : 'bg-white border text-[#64748B]'
                    }`}
                  >
                    Free / مجاني
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFree(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      !isFree ? 'bg-[#FEF08A] text-[#854D0E] border border-[#FACC15]' : 'bg-white border text-[#64748B]'
                    }`}
                  >
                    Paid Tickets
                  </button>
                </div>
              </div>

              {!isFree && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Ticket Price (SAR) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={priceStartingFrom}
                      onChange={e => setPriceStartingFrom(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-xl border border-[#CBD5E1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      External Booking Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={bookingUrl}
                      onChange={e => setBookingUrl(e.target.value)}
                      placeholder="https://webook.com/..."
                      className="w-full text-xs p-2 rounded-xl border border-[#CBD5E1]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Organizer Info & Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Organizer / Company Name
                </label>
                <input
                  type="text"
                  value={organizerName}
                  onChange={e => setOrganizerName(e.target.value)}
                  placeholder="e.g. Red Sea Creators Studio"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="organizer@jeddah.sa"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">
                Event Cover Image URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1]"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={wheelchairAccessible}
                  onChange={e => setWheelchairAccessible(e.target.checked)}
                  className="rounded text-[#0284C7]"
                />
                <span>Wheelchair Accessible</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibleParking}
                  onChange={e => setAccessibleParking(e.target.checked)}
                  className="rounded text-[#0284C7]"
                />
                <span>Accessible Parking</span>
              </label>
            </div>
          </div>

          {/* Submission Action */}
          <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : (language === 'ar' ? 'إرسال للمراجعة والاعتماد' : 'Submit for Review')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
