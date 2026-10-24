import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, Shield, CheckCircle, XCircle, RefreshCw, Key, 
  Calendar, Layers, Database, Activity, FileText, Check, AlertTriangle 
} from 'lucide-react';
import { JeddahEvent, SyncLog } from '../types';

export const AdminDashboardModal: React.FC = () => {
  const { 
    isAdminModalOpen, setIsAdminModalOpen, events, 
    updateEventStatus, syncFeeds, isSyncing, syncLogs, 
    language, t, refreshEvents 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'moderation' | 'events' | 'sync' | 'stats'>('moderation');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isAdminModalOpen) {
      fetch('/api/stats')
        .then(r => r.json())
        .then(d => { if (d.success) setStats(d); })
        .catch(() => {});
    }
  }, [isAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const archivedEvents = events.filter(e => e.status === 'archived');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden my-6 max-h-[92vh] flex flex-col animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FEF08A] text-[#854D0E] flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                {language === 'ar' ? 'لوحة إدارة ساحة جدة' : 'Saha Jeddah Admin Operations'}
              </h2>
              <p className="text-xs text-[#64748B]">
                {language === 'ar' ? 'إدارة الفعاليات، المزامنة الآلية، ومفتاح الربط' : 'Event moderation, automated synchronization & API feeds'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#E2E8F0] bg-white flex gap-6 text-xs font-bold overflow-x-auto">
          {[
            { id: 'moderation', label: `${t('moderationQueue')} (${pendingEvents.length})` },
            { id: 'events', label: `${t('activeListings')} (${approvedEvents.length})` },
            { id: 'sync', label: t('apiSync') },
            { id: 'stats', label: t('analytics') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'border-[#0284C7] text-[#0284C7]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          
          {/* TAB 1: Moderation Queue */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {language === 'ar' ? 'الفعاليات بانتظار الاعتماد' : 'Events Awaiting Approval'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {language === 'ar' ? 'مراجعة بيانات الفعالية، التذاكر، والموقع قبل النشر' : 'Review submitted event information, tickets, and coordinates before publishing'}
                  </p>
                </div>
              </div>

              {pendingEvents.length === 0 ? (
                <div className="p-8 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
                  <CheckCircle className="w-8 h-8 text-[#15803D] mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-semibold text-[#0F172A]">
                    {language === 'ar' ? 'لا توجد طلبات معلقة حالياً' : 'All submissions have been reviewed!'}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    {language === 'ar' ? 'أي فعالية يقدمها منظم جديد ستظهر هنا فوراً' : 'New community submissions will appear here for review'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingEvents.map(event => (
                    <div 
                      key={event.id}
                      className="p-4 rounded-2xl border border-[#CBD5E1] bg-[#FFFDF9] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF08A] text-[#854D0E]">
                              {event.category}
                            </span>
                            <span className="text-xs font-semibold text-[#64748B]">
                              {event.startDate} · {event.startTime}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#0F172A] mt-1">{event.title}</h4>
                          <p className="text-xs text-[#64748B]">Venue: {event.venueName} ({event.district})</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateEventStatus(event.id, 'approved')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t('approve')}</span>
                          </button>
                          <button
                            onClick={() => updateEventStatus(event.id, 'rejected')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{t('reject')}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#334155] bg-white p-2.5 rounded-xl border border-[#E2E8F0]">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Active & Archived Event Catalog */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {language === 'ar' ? 'سجل الفعاليات المنشورة والمؤرشفة' : 'Published & Archived Listings'}
                </h3>
              </div>

              <div className="overflow-x-auto border border-[#E2E8F0] rounded-2xl">
                <table className="w-full text-xs text-start">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold text-[#64748B]">
                    <tr>
                      <th className="p-3 text-start">Event Title</th>
                      <th className="p-3 text-start">Category</th>
                      <th className="p-3 text-start">District</th>
                      <th className="p-3 text-start">Date Range</th>
                      <th className="p-3 text-start">Price</th>
                      <th className="p-3 text-start">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {events.map(e => (
                      <tr key={e.id} className="hover:bg-[#F8FAFC]">
                        <td className="p-3 font-semibold text-[#0F172A] max-w-[200px] truncate">{e.title}</td>
                        <td className="p-3 text-[#475569]">{e.category}</td>
                        <td className="p-3 text-[#64748B]">{e.district}</td>
                        <td className="p-3 font-mono">{e.startDate}</td>
                        <td className="p-3 font-bold text-[#0284C7]">{e.isFree ? 'Free' : `${e.priceStartingFrom} SAR`}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            e.status === 'approved' ? 'bg-[#DCFCE7] text-[#15803D]' :
                            e.status === 'pending' ? 'bg-[#FEF08A] text-[#854D0E]' :
                            'bg-[#F1F5F9] text-[#64748B]'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: API Synchronization & Authorized Feeds */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              
              {/* Authorized Key Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE]/40 border border-[#BAE6FD] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#0284C7]" />
                    <span className="text-xs font-bold text-[#0369A1] uppercase tracking-wide">
                      {t('apiKeyStatus')}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold">
                    {t('apiKeyActive')}
                  </span>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-[#CBD5E1] font-mono text-xs flex items-center justify-between">
                  <span className="text-[#334155] select-all">
                    1ef9ce1fc10da6b6b0a40be4cb036560b8b02cd1f48c643421cd4a7258d5c877
                  </span>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold">SHA-256 Auth</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                  <p className="text-xs text-[#0369A1]">
                    {t('externalSyncNotice')}
                  </p>

                  <button
                    onClick={syncFeeds}
                    disabled={isSyncing}
                    className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? t('syncing') : t('syncNow')}</span>
                  </button>
                </div>
              </div>

              {/* Supported Event Gateways */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Configured Jeddah Event Providers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'webook.com', status: 'Online · Syncing', events: 'Active' },
                    { name: 'Platinumlist SA', status: 'Online · Syncing', events: 'Active' },
                    { name: 'Ticket Tailor', status: 'Connected', events: 'Active' },
                    { name: 'Eventbrite Saudi', status: 'Online · Syncing', events: 'Active' },
                  ].map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white space-y-1">
                      <span className="font-bold text-xs text-[#0F172A] block">{p.name}</span>
                      <span className="text-[10px] text-[#15803D] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        <span>{p.status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Execution History Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Synchronization Audit Logs
                </h4>
                <div className="space-y-2">
                  {syncLogs.map(log => (
                    <div key={log.id} className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0F172A]">{log.provider}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#15803D] font-bold">
                            +{log.eventsCount} Synced
                          </span>
                        </div>
                        <p className="text-[#475569] text-[11px]">{log.message}</p>
                      </div>
                      <div className="text-end text-[10px] text-[#94A3B8] font-mono shrink-0">
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="block">{log.durationMs}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Analytics */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#E0F2FE]/50 border border-[#BAE6FD] space-y-1">
                  <span className="text-xs font-bold text-[#0369A1]">Approved Events</span>
                  <div className="text-2xl font-extrabold text-[#0F172A]">{stats?.approved || approvedEvents.length}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FEF08A]/40 border border-[#FDE047] space-y-1">
                  <span className="text-xs font-bold text-[#854D0E]">Pending Review</span>
                  <div className="text-2xl font-extrabold text-[#0F172A]">{stats?.pending || pendingEvents.length}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#DCFCE7]/50 border border-[#BBF7D0] space-y-1">
                  <span className="text-xs font-bold text-[#15803D]">Free Activities</span>
                  <div className="text-2xl font-extrabold text-[#0F172A]">{stats?.freeEvents || 4}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCE7F3]/50 border border-[#FBCFE8] space-y-1">
                  <span className="text-xs font-bold text-[#9D174D]">Total Bookings</span>
                  <div className="text-2xl font-extrabold text-[#0F172A]">{stats?.bookingsCount || 2}</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#CBD5E1] space-y-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase">Automated Lifecycle Rules</h4>
                <ul className="text-xs text-[#475569] space-y-1.5 list-disc pl-4">
                  <li>Background interval verifies event `endDate` and `endTime` against <strong>Asia/Riyadh (UTC+3)</strong>.</li>
                  <li>Events past expiry are automatically flagged as archived to ensure upcoming queries remain strictly real-time.</li>
                  <li>Deduplication key prevents duplicate entries across multi-feed sync.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
