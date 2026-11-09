import React, { useState } from 'react';
import { api } from '../../services/api';
import { formatNPR } from '../../utils/pricing';
import { Lock, Save, RotateCcw, Sparkles, Download, Shield, AlertTriangle } from 'lucide-react';

interface SettingsTabProps {
  onRefresh: () => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onRefresh }) => {
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Store settings
  const [storeName, setStoreName] = useState('CLEVARA');
  const [tagline, setTagline] = useState('The Art of Living Clean');
  const [supportPhone, setSupportPhone] = useState('+977 1 4545000');
  const [supportEmail, setSupportEmail] = useState('concierge@clevara.com.np');
  const [deliveryFee, setDeliveryFee] = useState(150);
  const [freeThreshold, setFreeThreshold] = useState(3000);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: 'Owner password successfully updated!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminUpdateSettings({
        storeName,
        tagline,
        supportPhone,
        supportEmail,
        defaultDeliveryFee: Number(deliveryFee),
        freeDeliveryThreshold: Number(freeThreshold),
        defaultLowStockThreshold: Number(lowStockThreshold),
      });
      setSettingsSavedMsg(true);
      setTimeout(() => setSettingsSavedMsg(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  const handleResetCatalog = async () => {
    if (
      confirm(
        'CLEVARA STORE RESET: This will remove all products and reset the catalog to completely empty (as described in Master Prompt Section 2). The storefront will display an elegant empty-store experience until you publish products. Proceed?'
      )
    ) {
      try {
        await api.adminResetDatabase();
        await onRefresh();
        alert('Catalog reset completed. Storefront is now clean and empty.');
      } catch (err: any) {
        alert(err.message || 'Reset failed');
      }
    }
  };

  const handleSeed25Products = async () => {
    if (
      confirm(
        'SEED 25 PRODUCTS: This will populate 25 curated luxury Nepalese home care and surface care products (including CLEVARA Spray Window Cleaner with 25 units). Proceed?'
      )
    ) {
      try {
        const res = await api.adminSeed25Products();
        await onRefresh();
        alert(`Successfully seeded ${res.count} curated products!`);
      } catch (err: any) {
        alert(err.message || 'Seeding failed');
      }
    }
  };

  const handleDownloadBackup = () => {
    const token = localStorage.getItem('clevara_admin_token');
    window.open(`/api/admin/database/backup?token=${token}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in text-xs text-stone-800">
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Store Configuration & Security
        </h1>
        <p className="text-stone-500 font-light mt-0.5">
          Owner credentials, Nepalese delivery fees, catalog reset, and JSON database backup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store & Pricing Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <h3 className="text-sm font-serif font-bold text-stone-900 border-b pb-2">
            Store Profile & Delivery Rules (NPR)
          </h3>

          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Concierge Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Concierge Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Default Delivery Fee (रु.)</label>
                <input
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none font-semibold"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Free Delivery Threshold (रु.)</label>
                <input
                  type="number"
                  min="0"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none font-semibold"
                />
              </div>
            </div>

            {settingsSavedMsg && (
              <p className="text-emerald-700 font-semibold text-xs">
                ✓ Store settings successfully saved.
              </p>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Save Store Rules
            </button>
          </form>
        </div>

        {/* Change Owner Password */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b pb-2">
            <Lock className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-serif font-bold text-stone-900">
              Security: Change Owner Password
            </h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Current Password *</label>
              <input
                type="password"
                required
                placeholder="Current administrator password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">New Password * (Min 6 chars)</label>
              <input
                type="password"
                required
                placeholder="Enter strong new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none"
              />
            </div>

            {passwordMsg && (
              <p
                className={`text-xs font-semibold ${
                  passwordMsg.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {passwordMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold shadow-sm transition-colors cursor-pointer"
            >
              {isChangingPassword ? 'Hashing & Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Database Maintenance & Catalog Utilities (Section 2 & Advice #2) */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-6 border border-stone-800">
        <div>
          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Database Maintenance & Catalog Controls</span>
          </h3>
          <p className="text-xs text-stone-400 font-light mt-1">
            Execute full store reset to start empty, load 25 curated products, or export database snapshots.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Seed 25 Curated Products */}
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Seed 25 Products</span>
              </h4>
              <p className="text-[11px] text-stone-400 font-light mt-1">
                Populates 25 curated luxury formulas including the 25-unit flagship Spray Window Cleaner test item.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSeed25Products}
              className="mt-3 w-full py-2 bg-stone-100 hover:bg-white text-stone-950 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
            >
              Seed 25 Products
            </button>
          </div>

          {/* Reset Store to Clean Slate */}
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-rose-300 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset Storefront Catalog</span>
              </h4>
              <p className="text-[11px] text-stone-400 font-light mt-1">
                Clears all existing catalog items to test the elegant empty-store state requested in Section 2.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetCatalog}
              className="mt-3 w-full py-2 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
            >
              Wipe Catalog to Empty
            </button>
          </div>

          {/* Download JSON Backup */}
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Export Database Backup</span>
              </h4>
              <p className="text-[11px] text-stone-400 font-light mt-1">
                Download a complete, offline JSON snapshot of products, stock logs, customer orders, and settings.
              </p>
            </div>
            <a
              href="/api/admin/database/backup"
              target="_blank"
              download
              className="mt-3 w-full py-2 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-lg transition-colors text-center block text-xs"
            >
              Download Backup (.json)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
