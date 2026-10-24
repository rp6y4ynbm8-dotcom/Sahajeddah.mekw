import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, Ticket, Calendar, Clock, MapPin, QrCode, ArrowRight, Download } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { isBookingModalOpen, setIsBookingModalOpen, bookingTargetEvent, language, t, showToast } = useApp();

  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);

  if (!isBookingModalOpen || !bookingTargetEvent) return null;

  const tickets = bookingTargetEvent.tickets && bookingTargetEvent.tickets.length > 0 
    ? bookingTargetEvent.tickets 
    : [{ id: 'default', name: 'General Admission', nameAr: 'دخول عام', price: bookingTargetEvent.priceStartingFrom, availableCapacity: 50 }];

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];
  const totalPrice = (activeTicket ? activeTicket.price : 0) * quantity;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast(language === 'ar' ? 'يرجى إدخال الاسم والبريد الإلكتروني' : 'Please provide name and email', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: bookingTargetEvent.id,
          ticketId: activeTicket.id,
          quantity,
          attendeeName: name,
          attendeeEmail: email,
          attendeePhone: phone,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setBookingConfirmation(data.booking);
        showToast(t('bookingConfirmed'), 'success');
      } else {
        showToast(data.error || 'Failed to complete booking', 'error');
      }
    } catch (err: any) {
      showToast('Booking service unavailable', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setBookingConfirmation(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#0284C7]" />
            <h2 className="text-base font-bold text-[#0F172A]">
              {bookingConfirmation ? t('bookingConfirmed') : t('confirmBooking')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {bookingConfirmation ? (
            /* Confirmation View with Digital Pass */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  {language === 'ar' ? 'تم تأكيد حجزك بنجاح!' : 'Your Booking is Confirmed!'}
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  {t('bookingNote')}
                </p>
              </div>

              {/* Digital Boarding Pass Ticket */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#CBD5E1] text-start space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]/60">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{t('bookingRef')}</span>
                    <p className="font-mono text-base font-bold text-[#0284C7]">{bookingConfirmation.bookingRef}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg p-1 border border-[#E2E8F0] flex items-center justify-center shadow-xs">
                    <QrCode className="w-10 h-10 text-[#0F172A]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#94A3B8]">Event</span>
                  <p className="font-bold text-sm text-[#0F172A]">
                    {language === 'ar' ? bookingConfirmation.eventTitleAr : bookingConfirmation.eventTitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Date & Time</span>
                    <span className="font-medium text-[#334155]">{bookingConfirmation.eventDate} · {bookingConfirmation.eventTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Attendee</span>
                    <span className="font-medium text-[#334155] truncate block">{bookingConfirmation.attendeeName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#CBD5E1]/60 text-xs font-bold text-[#0F172A]">
                  <span>Total Paid</span>
                  <span>{bookingConfirmation.totalAmount} SAR</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast(language === 'ar' ? 'تم حفظ التذكرة' : 'Ticket downloaded', 'success');
                    handleClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حفظ التذكرة الإلكترونية' : 'Save E-Ticket'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              
              {/* Event preview summary */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#F1E9DF] space-y-1">
                <span className="text-[10px] font-bold text-[#0284C7] uppercase">
                  {language === 'ar' ? bookingTargetEvent.categoryAr : bookingTargetEvent.category}
                </span>
                <h3 className="text-sm font-bold text-[#0F172A] line-clamp-1">
                  {language === 'ar' ? bookingTargetEvent.titleAr : bookingTargetEvent.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                  <span>{bookingTargetEvent.startDate}</span>
                  <span>·</span>
                  <span>{bookingTargetEvent.startTime}</span>
                </div>
              </div>

              {/* Ticket selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#334155]">
                  {t('selectTicket')}
                </label>
                <div className="space-y-2">
                  {tickets.map((tItem) => (
                    <label
                      key={tItem.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        activeTicket.id === tItem.id
                          ? 'border-[#0284C7] bg-[#F0F9FF]'
                          : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="ticketTier"
                          checked={activeTicket.id === tItem.id}
                          onChange={() => setSelectedTicketId(tItem.id)}
                          className="text-[#0284C7] focus:ring-[#38BDF8]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">
                            {language === 'ar' ? tItem.nameAr : tItem.name}
                          </p>
                          {tItem.description && (
                            <p className="text-[11px] text-[#64748B]">{tItem.description}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#0284C7]">
                        {tItem.price === 0 ? t('free') : `${tItem.price} ${t('sar')}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-bold text-[#334155]">
                  {t('quantity')}
                </label>
                <div className="flex items-center border border-[#CBD5E1] rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-xs font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-3 py-1 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="space-y-2.5 pt-2 border-t border-[#F1F5F9]">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Mohammed Al-Harbi"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">
                      {t('emailAddress')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@domain.sa"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">
                      {t('phoneOptional')}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="050 123 4567"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#38BDF8]"
                    />
                  </div>
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-3 border-t border-[#F1F5F9] space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-[#334155]">{t('total')}</span>
                  <span className="text-base text-[#0284C7] font-extrabold font-mono">
                    {totalPrice === 0 ? t('free') : `${totalPrice} ${t('sar')}`}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>{t('confirmReservation')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
