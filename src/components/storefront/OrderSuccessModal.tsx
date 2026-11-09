import React from 'react';
import { formatNPR } from '../../utils/pricing';
import { CheckCircle, Package, Phone, MapPin, X } from 'lucide-react';

interface OrderSuccessModalProps {
  order: any;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Order Confirmed & Reserved
          </h2>
          <p className="text-xs text-stone-500">
            Thank you for choosing CLEVARA. Your order has been securely logged in our Kathmandu fulfillment registry.
          </p>

          <div className="inline-block px-4 py-2 bg-stone-100 rounded-lg text-xs font-mono font-bold text-stone-800 tracking-wider">
            Order Reference: {order.id}
          </div>
        </div>

        {/* Order Details */}
        <div className="mt-6 border-t border-b border-stone-100 py-4 space-y-4 text-xs">
          {/* Customer & Address */}
          <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
            <MapPin className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
            <div className="text-left space-y-0.5">
              <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
              <p className="text-stone-600">
                {order.customer.houseNumber}, {order.customer.fullAddress}, {order.customer.areaTole}
              </p>
              <p className="text-stone-500">
                {order.customer.cityMunicipality}, {order.customer.district}, {order.customer.province}
              </p>
              <p className="text-stone-700 font-medium pt-1">
                Contact: <span className="font-semibold text-stone-900">{order.customer.phone}</span>
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-2">
            <p className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
              Reserved Products
            </p>
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-stone-700">
                <span>
                  {item.quantity} × {item.productName}
                </span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatNPR(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-2 border-t border-stone-200/60 flex justify-between items-baseline font-bold text-sm text-stone-950">
            <span>Payable on Delivery (COD)</span>
            <span className="text-base tabular-nums">{formatNPR(order.totalAmount)}</span>
          </div>
        </div>

        {/* Next Steps Information */}
        <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-left flex items-start gap-3">
          <Phone className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-900 leading-relaxed">
            <span className="font-semibold">Concierge Dispatch Call:</span> Our logistics partner will phone you at{' '}
            <span className="font-semibold">{order.customer.phone}</span> prior to departure to confirm your landmark and convenient delivery time.
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Continue Browsing CLEVARA
          </button>
        </div>
      </div>
    </div>
  );
};
