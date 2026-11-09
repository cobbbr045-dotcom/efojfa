import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { formatNPR } from '../../utils/pricing';
import { NEPAL_PROVINCES, validateCustomerAddress } from '../../utils/validation';
import { X, ShieldCheck, Truck, Banknote, ArrowRight, CheckCircle2, AlertCircle, Tag, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { items, subtotal, clearCart } = useCart();

  // Customer form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    altPhone: '',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    cityMunicipality: 'Kathmandu Metropolitan City',
    areaTole: '',
    fullAddress: '',
    houseNumber: '',
    landmark: '',
    instructions: '',
  });

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'eSewa'>('Cash on Delivery');
  const [esewaNumber, setEsewaNumber] = useState('');

  if (!isOpen) return null;

  // Free delivery for CLEVARA across Nepal
  const deliveryFee = 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPayable = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'CLEAN10' || code === 'VIPGALA10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code, discount });
    } else if (code.startsWith('VIP') || code === 'WELCOME2026') {
      const discount = Math.round(subtotal * 0.15);
      setAppliedCoupon({ code, discount });
    } else if (code === 'FREEDELIVERY') {
      setAppliedCoupon({ code, discount: 0 });
    } else {
      setCouponError('Invalid coupon code or promotion expired.');
      setAppliedCoupon(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate address
    const validation = validateCustomerAddress(formData);
    const formErrors = { ...validation.errors };

    if (paymentMethod === 'eSewa') {
      const cleanEsewa = esewaNumber.trim().replace(/[\s\-()]/g, '');
      if (!cleanEsewa || cleanEsewa.length < 9) {
        formErrors.esewaNumber = 'Please enter a valid 10-digit eSewa registered mobile number.';
      }
    }

    if (!validation.isValid || Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (items.length === 0) {
      alert('Your shopping bag is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer: formData,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          variantId: i.variant?.id,
          color: i.variant?.color,
          quantity: i.quantity,
        })),
        couponCode: appliedCoupon?.code,
        paymentMethod,
        esewaNumber: paymentMethod === 'eSewa' ? esewaNumber.trim() : undefined,
      };

      const result = await api.createOrder(payload);
      if (result.success) {
        // If eSewa selected, optionally initiate verification simulation
        if (paymentMethod === 'eSewa') {
          try {
            await api.verifyEsewaPayment(result.orderId, `ESEWA-${Date.now()}`, 'SUCCESS');
            result.order.paymentStatus = 'PAID';
            result.order.status = 'Confirmed';
          } catch (e) {
            console.warn('eSewa auto-verification sandbox notice', e);
          }
        }
        clearCart();
        onClose();
        onOrderSuccess(result.order);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">CLEVARA</span>
              <span className="text-stone-300">·</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Free Delivery Included
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">
              Nepal Delivery & Secure Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
            {/* Left: Customer Address & Payment (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-stone-200">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-2 mb-4">
                  <Truck className="w-4 h-4 text-stone-700" />
                  <span>1. Delivery Destination (Nepal)</span>
                </h3>

                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Subarna Shrestha"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-stone-500 ${
                        errors.fullName ? 'border-rose-500 bg-rose-50/30' : 'border-stone-200'
                      }`}
                    />
                    {errors.fullName && <p className="mt-1 text-[11px] text-rose-600">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">
                      10-Digit Mobile Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9841XXXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-stone-500 ${
                        errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-stone-200'
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-[11px] text-rose-600">{errors.phone}</p>}
                  </div>
                </div>

                {/* Province & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">
                      Province <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
                    >
                      {NEPAL_PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">
                      District <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kathmandu, Lalitpur, Kaski"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-stone-500 ${
                        errors.district ? 'border-rose-500 bg-rose-50/30' : 'border-stone-200'
                      }`}
                    />
                    {errors.district && <p className="mt-1 text-[11px] text-rose-600">{errors.district}</p>}
                  </div>
                </div>

                {/* City & Tole */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">
                      City / Municipality <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kathmandu Metro, Pokhara"
                      value={formData.cityMunicipality}
                      onChange={(e) => handleInputChange('cityMunicipality', e.target.value)}
                      className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-stone-500 ${
                        errors.cityMunicipality ? 'border-rose-500 bg-rose-50/30' : 'border-stone-200'
                      }`}
                    />
                    {errors.cityMunicipality && (
                      <p className="mt-1 text-[11px] text-rose-600">{errors.cityMunicipality}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">
                      Area / Tole <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Baluwatar, Lazimpat, Lakeside"
                      value={formData.areaTole}
                      onChange={(e) => handleInputChange('areaTole', e.target.value)}
                      className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-stone-500 ${
                        errors.areaTole ? 'border-rose-500 bg-rose-50/30' : 'border-stone-200'
                      }`}
                    />
                    {errors.areaTole && <p className="mt-1 text-[11px] text-rose-600">{errors.areaTole}</p>}
                  </div>
                </div>

                {/* Street Address & House # */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">
                      Complete Street Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ward 4, Russian Embassy Road"
                      value={formData.fullAddress}
                      onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                      className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-stone-500 ${
                        errors.fullAddress ? 'border-rose-500 bg-rose-50/30' : 'border-stone-200'
                      }`}
                    />
                    {errors.fullAddress && (
                      <p className="mt-1 text-[11px] text-rose-600">{errors.fullAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1 text-xs">
                      House / Apt # <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 14B"
                      value={formData.houseNumber}
                      onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                      className={`w-full bg-stone-50 border rounded-lg px-3.5 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-stone-500 ${
                        errors.houseNumber ? 'border-rose-500 bg-rose-50/30' : 'border-stone-200'
                      }`}
                    />
                    {errors.houseNumber && (
                      <p className="mt-1 text-[11px] text-rose-600">{errors.houseNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method section */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-2 mb-3">
                  <Banknote className="w-4 h-4 text-stone-700" />
                  <span>2. Payment Option</span>
                </h3>

                <div className="space-y-3">
                  {/* Option 1: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-4 rounded-xl flex items-start gap-3 cursor-pointer border-2 transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'bg-stone-50 border-stone-900 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {paymentMethod === 'Cash on Delivery' ? (
                        <CheckCircle2 className="w-5 h-5 fill-stone-900 text-white" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-stone-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-stone-900">
                          Cash on Delivery (COD)
                        </h4>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-700 bg-stone-200/80 px-2 py-0.5 rounded">
                          Pay upon delivery
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-stone-600 leading-relaxed font-light">
                        Inspect your sealed CLEVARA package upon arrival and pay exact cash directly to the courier agent.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: eSewa Mobile Wallet */}
                  <label
                    onClick={() => setPaymentMethod('eSewa')}
                    className={`p-4 rounded-xl flex flex-col gap-3 cursor-pointer border-2 transition-all ${
                      paymentMethod === 'eSewa'
                        ? 'bg-emerald-50/40 border-emerald-600 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {paymentMethod === 'eSewa' ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-stone-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-stone-900">
                              eSewa Mobile Wallet
                            </h4>
                            <span className="bg-[#60bb46] text-white font-black text-[10px] px-1.5 py-0.5 rounded tracking-tight">
                              eSewa
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                            Instant Digital Pay
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-600 leading-relaxed font-light">
                          Fast & secure digital payment via Nepal's leading eSewa wallet.
                        </p>
                      </div>
                    </div>

                    {paymentMethod === 'eSewa' && (
                      <div className="mt-1 pt-3 border-t border-emerald-200/60 pl-8 space-y-2 text-xs animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <label className="block text-stone-700 font-semibold mb-1">
                            Your eSewa ID / Registered Mobile Number <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 9841XXXXXX"
                            value={esewaNumber}
                            onChange={(e) => {
                              setEsewaNumber(e.target.value);
                              if (errors.esewaNumber) {
                                setErrors((prev) => {
                                  const n = { ...prev };
                                  delete n.esewaNumber;
                                  return n;
                                });
                              }
                            }}
                            className={`w-full bg-white border rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-emerald-600 ${
                              errors.esewaNumber ? 'border-rose-500 bg-rose-50/50' : 'border-emerald-300'
                            }`}
                          />
                          {errors.esewaNumber && (
                            <p className="mt-1 text-[11px] text-rose-600">{errors.esewaNumber}</p>
                          )}
                        </div>
                        <div className="p-2.5 bg-emerald-100/50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 space-y-1">
                          <p className="font-semibold">CLEVARA Verified eSewa Account:</p>
                          <p className="font-mono text-stone-800">Merchant Code: <strong>CLEVARA_NEPAL</strong></p>
                          <p className="text-[10px] text-stone-600">Digital receipt will be auto-generated upon submission.</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-stone-50 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mb-4">
                  Order Summary
                </h3>

                {/* Items preview with Color Badges */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {items.map(({ product, variant, quantity }) => {
                    const price = product.discountedPrice || product.price;
                    const image = variant?.image || product.images[0] || '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg';

                    return (
                      <div key={`${product.id}-${variant?.id || 'def'}`} className="flex gap-3 text-xs bg-white p-2.5 rounded-lg border border-stone-200/80">
                        <img
                          src={image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-stone-900 truncate">{product.name}</p>
                          {variant && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-stone-600 font-medium">
                              <span
                                className="w-2 h-2 rounded-full inline-block"
                                style={{ backgroundColor: variant.hexColor }}
                              />
                              Colour: <strong>{variant.color}</strong>
                            </span>
                          )}
                          <p className="text-stone-500 text-[11px] mt-0.5">
                            Qty: <span className="font-semibold">{quantity}</span> × {formatNPR(price)}
                          </p>
                        </div>
                        <div className="text-right font-bold text-stone-950 tabular-nums">
                          {formatNPR(price * quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code Input */}
                <div className="mt-5 pt-4 border-t border-stone-200">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Coupon (e.g. VIPGALA10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full bg-white border border-stone-200 text-xs rounded-lg pl-8 pr-3 py-2 text-stone-900 focus:outline-none focus:border-stone-400 uppercase"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="mt-1 text-[11px] text-rose-600">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="mt-1 text-[11px] text-emerald-700 font-semibold">
                      ✓ Coupon {appliedCoupon.code} applied (-{formatNPR(appliedCoupon.discount)})
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="mt-5 pt-4 border-t border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-stone-900 tabular-nums">{formatNPR(subtotal)}</span>
                  </div>

                  {appliedCoupon && appliedCoupon.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Privilege Discount ({appliedCoupon.code})</span>
                      <span className="tabular-nums">-{formatNPR(appliedCoupon.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Nepal Delivery Fee</span>
                    <span className="font-semibold text-emerald-700">
                      FREE (रु. 0)
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-stone-950">
                    <span>Final Payable ({paymentMethod === 'eSewa' ? 'eSewa' : 'COD'})</span>
                    <span className="tabular-nums text-lg">{formatNPR(finalPayable)}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className={`w-full py-4 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'eSewa' ? 'bg-[#51a03a] hover:bg-[#438a2e]' : 'bg-stone-900 hover:bg-stone-800'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Securing Order & Deducting Stock...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order ({formatNPR(finalPayable)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-stone-400 text-center leading-normal">
                  Atomic real-time reserve active. Your selected colour variant will be reserved exclusively for you.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
