import React from 'react';
import { Lock, Shield, MapPin, Phone, Mail, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenOwnerPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOwnerPortal }) => {
  return (
    <footer id="craft" className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Brand Craftsmanship Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-stone-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">Himalayan Botanical Base</h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Every CLEVARA bottle blends pure mineral spring water with cold-pressed high-altitude pine, bergamot, and cedar essences sourced conscientiously within Nepal.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">Surface-Neutral Safety</h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Specifically pH-calibrated to protect sensitive natural materials: architectural Italian travertine, honed granite, lacquered walnut, and optical low-iron window glass.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base">Nationwide Delivery</h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Express fulfillment across Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, and all 7 provinces of Nepal with Cash on Delivery (COD) security.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <span className="text-2xl font-serif font-bold tracking-widest text-white uppercase block">
              CLEVARA
            </span>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              The Art of Living Clean. Premium architectural care and botanical cleansing solutions designed for contemporary residences in Nepal.
            </p>
            <p className="text-xs text-stone-500">
              Curated in Kathmandu · Handcrafted in Nepal
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold text-white uppercase tracking-wider">Collections</h5>
            <ul className="space-y-2 text-stone-400">
              <li>Surface & Glass Care</li>
              <li>Body Cleaner</li>
              <li>Stone & Wood Sealants</li>
              <li>Precision Microfibers</li>
              <li>Sanctuary Care Sets</li>
            </ul>
          </div>

          {/* Delivery & Assurance */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold text-white uppercase tracking-wider">Nepal Fulfillment</h5>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>Complimentary Delivery over रु. 3,000</li>
              <li>Standard Flat Rate: रु. 150</li>
              <li>Cash on Delivery (COD) Accepted</li>
              <li>Direct Courier Phone Verification</li>
              <li>7-Day Purity Exchange Assurance</li>
            </ul>
          </div>

          {/* Concierge & Owner Access */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold text-white uppercase tracking-wider">Concierge</h5>
            <div className="space-y-1.5 text-stone-400 font-light">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>Kathmandu Valley, Nepal</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>+977 1 4545000</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>concierge@clevara.com.np</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenOwnerPortal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-md border border-stone-800 transition-colors cursor-pointer text-xs"
              >
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Owner Portal (/admin)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} CLEVARA Nepal. All rights reserved.</p>
          <p className="text-[11px] font-light">
            All prices listed in Nepalese Rupees (रु. NPR). Official E-Commerce Platform.
          </p>
        </div>
      </div>
    </footer>
  );
};
