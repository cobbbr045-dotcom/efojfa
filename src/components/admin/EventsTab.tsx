import React, { useState, useEffect } from 'react';
import { StoreEvent, EventAttendee } from '../../types';
import { api } from '../../services/api';
import { Sparkles, Plus, Edit2, Trash2, Calendar, Check, X, Users, Award, Tag, Image, Clock, Phone, UserCheck } from 'lucide-react';

interface EventsTabProps {
  onRefresh?: () => Promise<void>;
}

export const EventsTab: React.FC<EventsTabProps> = () => {
  const [events, setEvents] = useState<StoreEvent[]>([]);
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<StoreEvent | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'events' | 'attendees'>('events');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('/src/assets/images/hero_clevara_lifestyle_1794115562217.jpg');
  const [code, setCode] = useState('VIP2026');
  const [congratulationMessage, setCongratulationMessage] = useState('Congratulations! You have successfully registered and unlocked your exclusive CLEVARA VIP privilege.');
  const [rewardTitle, setRewardTitle] = useState('VIP Sanctuary Pass');
  const [rewardCode, setRewardCode] = useState('VIPGALA20');
  const [rewardDiscountValue, setRewardDiscountValue] = useState<number | string>(20);
  const [rewardDiscountType, setRewardDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PRESET_EVENT_IMAGES = [
    { label: 'Sanctuary Interior Living', url: '/src/assets/images/hero_clevara_lifestyle_1794115562217.jpg' },
    { label: 'Kathmandu Gala Signature', url: '/src/assets/images/deal_banner_nepal_1794115563679.jpg' },
    { label: 'Botanical Mist Reserve', url: '/src/assets/images/product_linen_mist_1794115564318.jpg' },
    { label: 'Ultra Clarity Window Edition', url: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, attendeesData] = await Promise.all([
        api.adminGetEvents(),
        api.adminGetEventAttendees(),
      ]);
      setEvents(eventsData);
      setAttendees(attendeesData);
    } catch (err: any) {
      console.error('Failed to load events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setBannerImage('/src/assets/images/hero_clevara_lifestyle_1794115562217.jpg');
    setCode(`CLEVARA-${Math.floor(100 + Math.random() * 900)}`);
    setCongratulationMessage('Congratulations! You have unlocked your exclusive CLEVARA VIP privilege. Enjoy 20% off all organic luxury home formulas.');
    setRewardTitle('VIP Sanctuary Voucher');
    setRewardCode('VIPGALA20');
    setRewardDiscountValue(20);
    setRewardDiscountType('percentage');
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    setIsModalOpen(true);
  };

  const openEditModal = (event: StoreEvent) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setBannerImage(event.bannerImage || '/src/assets/images/hero_clevara_lifestyle_1794115562217.jpg');
    setCode(event.code);
    setCongratulationMessage(event.congratulationMessage);
    setRewardTitle(event.rewardTitle);
    setRewardCode(event.rewardCode);
    setRewardDiscountValue(event.rewardDiscountValue);
    setRewardDiscountType(event.rewardDiscountType);
    setStartDate(event.startDate.slice(0, 10));
    setEndDate(event.endDate.slice(0, 10));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        bannerImage: bannerImage.trim() || undefined,
        code: code.trim().toUpperCase(),
        congratulationMessage: congratulationMessage.trim(),
        rewardTitle: rewardTitle.trim(),
        rewardCode: rewardCode.trim().toUpperCase(),
        rewardDiscountValue: Number(rewardDiscountValue),
        rewardDiscountType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };

      if (editingEvent) {
        await api.adminUpdateEvent(editingEvent.id, payload);
      } else {
        await api.adminCreateEvent(payload);
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event? All attendee associations will be retained in history.')) {
      try {
        await api.adminDeleteEvent(id);
        await loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete event');
      }
    }
  };

  const handleToggleActive = async (event: StoreEvent) => {
    try {
      await api.adminUpdateEvent(event.id, { isActive: !event.isActive });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update event status');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>Store Events & VIP Activations</span>
            <Sparkles className="w-5 h-5 text-amber-600" />
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Host special brand activations and private events where guests receive celebratory passes & exclusive rewards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('events')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'events' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Events ({events.length})
            </button>
            <button
              onClick={() => setActiveSubTab('attendees')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'attendees' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Attendees ({attendees.length})
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'events' ? (
        events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-stone-900">No Events Created Yet</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto font-light">
                Create a VIP event for store launches, private gatherings, or holiday promotions. Guests who attend or check into the event receive an interactive congratulations popup with a custom reward voucher.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const isExpired = new Date(event.endDate) < new Date();

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  {event.bannerImage && (
                    <div className="h-36 w-full overflow-hidden relative bg-stone-100 border-b border-stone-200">
                      <img
                        src={event.bannerImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            event.isActive && !isExpired
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          {isExpired ? 'Concluded' : event.isActive ? 'Active Event' : 'Draft'}
                        </span>
                      </div>
                      <span className="absolute bottom-2 left-3 text-white text-xs font-mono font-bold tracking-wider">
                        PASS: {event.code}
                      </span>
                    </div>
                  )}

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-base font-serif font-bold text-stone-900">
                        {event.title}
                      </h3>
                      <p className="text-xs text-stone-500 font-light line-clamp-2">
                        {event.description}
                      </p>

                      {/* Reward Badge */}
                      <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-900 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-700" />
                            <span>{event.rewardTitle}</span>
                          </span>
                          <span className="font-bold">
                            {event.rewardDiscountType === 'percentage'
                              ? `${event.rewardDiscountValue}% OFF`
                              : `रु. ${event.rewardDiscountValue} OFF`}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-amber-800 font-medium">
                          Voucher Code: <strong>{event.rewardCode}</strong>
                        </p>
                      </div>

                      {/* Congratulation note */}
                      <div className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded border border-stone-200/70">
                        "{event.congratulationMessage}"
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        <span>{event.attendeesCount || 0} Attendees</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(event)}
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded cursor-pointer"
                          title={event.isActive ? 'Pause Event' : 'Activate Event'}
                        >
                          {event.isActive ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Attendees Table */
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 text-xs">
            <span className="font-semibold text-stone-900">
              Verified Event Check-ins ({attendees.length})
            </span>
            <span className="text-stone-500">
              Customers who joined an event and claimed congratulations rewards
            </span>
          </div>

          {attendees.length === 0 ? (
            <div className="p-10 text-center text-xs text-stone-400">
              No event attendees recorded yet. When customers check into an event on the storefront, their details and congratulations timestamp will show here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-200 tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Attendee Name</th>
                    <th className="py-3 px-4">Phone / Contact</th>
                    <th className="py-3 px-4">Event Attended</th>
                    <th className="py-3 px-4">Check-in Timestamp</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {attendees.map((a) => (
                    <tr key={a.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{a.customerName}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-mono">{a.customerContact}</td>
                      <td className="py-3 px-4 text-stone-800">{a.eventTitle}</td>
                      <td className="py-3 px-4 text-stone-500">
                        {new Date(a.checkedInAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                          ✓ Congratulated
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal for Create/Edit Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-serif font-bold text-stone-900">
                {editingEvent ? 'Edit Event Activation' : 'Create New Event Activation'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CLEVARA Kathmandu Valley Gala"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Event Pass Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GALA2026"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-400 font-mono uppercase font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Event Description</label>
                <textarea
                  rows={2}
                  placeholder="Details of the event activation, location, and guest benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-400"
                />
              </div>

              {/* Event Picture / Banner */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Event Banner Picture</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {PRESET_EVENT_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setBannerImage(img.url)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all h-14 cursor-pointer ${
                        bannerImage === img.url ? 'border-stone-900 ring-2 ring-stone-900/20' : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                      title={img.label}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom image URL"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                />
              </div>

              {/* Congratulation Message */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2">
                <label className="block text-amber-900 font-bold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Celebration / Congratulation Message *</span>
                </label>
                <p className="text-[11px] text-amber-800 font-light">
                  Shown in high-prominence celebration popup when someone checks into or attends this event:
                </p>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Congratulations! You are officially registered for the CLEVARA Exclusive Gala."
                  value={congratulationMessage}
                  onChange={(e) => setCongratulationMessage(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Reward Voucher Config */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <label className="block text-stone-900 font-bold text-xs flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-stone-700" />
                  <span>Attendee Reward / Coupon Privilege</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Reward Title</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP Sanctuary Pass"
                      value={rewardTitle}
                      onChange={(e) => setRewardTitle(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Reward Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VIPGALA20"
                      value={rewardCode}
                      onChange={(e) => setRewardCode(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none font-mono uppercase font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Discount Type</label>
                    <select
                      value={rewardDiscountType}
                      onChange={(e) => setRewardDiscountType(e.target.value as any)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (रु. NPR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Discount Amount *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={rewardDiscountValue}
                      onChange={(e) => setRewardDiscountValue(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-md font-semibold cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
