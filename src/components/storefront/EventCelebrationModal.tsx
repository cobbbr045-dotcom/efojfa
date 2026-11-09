import React, { useState, useEffect } from 'react';
import { StoreEvent } from '../../types';
import { api } from '../../services/api';
import { X, Sparkles, Award, Copy, Check, ArrowRight, ShieldCheck, Calendar, PartyPopper } from 'lucide-react';

interface EventCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoucherToCheckout?: (code: string) => void;
}

export const EventCelebrationModal: React.FC<EventCelebrationModalProps> = ({
  isOpen,
  onClose,
  onApplyVoucherToCheckout,
}) => {
  const [events, setEvents] = useState<StoreEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<StoreEvent | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [passCodeInput, setPassCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Celebratory state upon check-in
  const [celebrationResult, setCelebrationResult] = useState<{
    congratulationTitle: string;
    congratulationMessage: string;
    eventTitle: string;
    rewardTitle: string;
    rewardCode: string;
    rewardDiscountValue: number;
    rewardDiscountType: 'percentage' | 'fixed';
    attendee: any;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCelebrationResult(null);
      setError('');
      api.getEvents().then((data) => {
        setEvents(data);
        if (data.length > 0) {
          setSelectedEvent(data[0]);
        }
      }).catch(err => {
        console.error('Failed to load events:', err);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !customerContact.trim()) {
      setError('Please provide your name and phone number to join the event.');
      return;
    }

    // Determine target event
    let target = selectedEvent;
    if (passCodeInput.trim()) {
      const match = events.find(ev => ev.code.toUpperCase() === passCodeInput.trim().toUpperCase());
      if (match) {
        target = match;
      }
    }

    if (!target) {
      setError('Please select an active event or enter a valid Event Pass code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.checkInEvent({
        eventId: target.id,
        customerName: customerName.trim(),
        customerContact: customerContact.trim(),
      });
      setCelebrationResult(res);
    } catch (err: any) {
      setError(err.message || 'Check-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {celebrationResult ? (
          /* CONGRATULATIONS CELEBRATION VIEW */
          <div className="p-6 sm:p-8 text-center space-y-6 animate-scale-up">
            {/* Sparkle Confetti Banner */}
            <div className="relative py-2">
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-amber-100 animate-bounce">
                <PartyPopper className="w-10 h-10 text-stone-950" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
                ★ Verified Event Guest ★
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
                {celebrationResult.congratulationTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md mx-auto leading-relaxed">
                {celebrationResult.congratulationMessage}
              </p>
            </div>

            {/* Personalized Pass Card */}
            <div className="bg-stone-950 text-white rounded-2xl p-5 shadow-2xl border border-stone-800 text-left space-y-4 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    CLEVARA EXCLUSIVE EVENT PASS
                  </span>
                  <h4 className="text-base font-serif font-bold text-white mt-0.5">
                    {celebrationResult.eventTitle}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-mono">PASS NO.</span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {celebrationResult.attendee?.id?.slice(-8).toUpperCase() || 'VIP-PASS'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-light text-stone-300">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">Guest Name</span>
                  <span className="font-semibold text-white">{celebrationResult.attendee?.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">Check-in Status</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Authorized</span>
                  </span>
                </div>
              </div>

              {/* Reward Voucher Box */}
              <div className="p-3.5 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                    {celebrationResult.rewardTitle}
                  </span>
                  <span className="text-lg font-mono font-black text-amber-300 tracking-wider">
                    {celebrationResult.rewardCode}
                  </span>
                  <span className="text-[11px] text-stone-400 block">
                    ({celebrationResult.rewardDiscountType === 'percentage'
                      ? `${celebrationResult.rewardDiscountValue}% discount on your next order`
                      : `रु. ${celebrationResult.rewardDiscountValue} privilege discount`})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(celebrationResult.rewardCode)}
                  className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onApplyVoucherToCheckout) {
                    onApplyVoucherToCheckout(celebrationResult.rewardCode);
                  }
                  onClose();
                }}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Shop CLEVARA Collection with VIP Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
              >
                Close & Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* EVENT CHECK-IN / REGISTRATION FORM VIEW */
          <div>
            {/* Header Banner */}
            <div className="h-44 w-full relative overflow-hidden bg-stone-900">
              <img
                src={selectedEvent?.bannerImage || '/src/assets/images/hero_clevara_lifestyle_1794115562217.jpg'}
                alt="Event Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider rounded">
                    ★ CLEVARA EVENT
                  </span>
                  {selectedEvent && (
                    <span className="text-[11px] font-mono text-amber-300 font-bold">
                      CODE: {selectedEvent.code}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {selectedEvent ? selectedEvent.title : 'CLEVARA Brand Events & Activations'}
                </h2>
                <p className="text-xs text-stone-300 line-clamp-1 font-light">
                  {selectedEvent ? selectedEvent.description : 'Enter an event to receive your congratulation greeting and exclusive VIP privilege.'}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {events.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Select Event
                  </label>
                  <select
                    value={selectedEvent?.id || ''}
                    onChange={(e) => {
                      const ev = events.find(x => x.id === e.target.value);
                      if (ev) setSelectedEvent(ev);
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} (Pass: {ev.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reward Highlights */}
              {selectedEvent && (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-semibold text-amber-950 block">{selectedEvent.rewardTitle}</span>
                      <span className="text-[11px] text-amber-800">
                        Unlocked immediately upon event attendance
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-amber-900 bg-amber-200/60 px-2 py-1 rounded">
                    {selectedEvent.rewardDiscountType === 'percentage'
                      ? `${selectedEvent.rewardDiscountValue}% OFF`
                      : `रु. ${selectedEvent.rewardDiscountValue} OFF`}
                  </span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleCheckIn} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Your Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subarna Shrestha"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Mobile Number <span className="text-rose-600">*</span> (+977)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9841234567"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                {events.length === 0 && (
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Event Pass Code <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GALA2026 or VIP2026"
                      value={passCodeInput}
                      onChange={(e) => setPassCodeInput(e.target.value.toUpperCase())}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-900 font-mono uppercase font-bold focus:outline-none focus:border-stone-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isLoading ? 'Checking in...' : 'Enter Event & Claim VIP Privilege'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
