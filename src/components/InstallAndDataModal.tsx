import React, { useRef, useState } from 'react';
import { BoardingHouseListing } from '../data/roxasHousingData';
import { ScheduledVisit } from '../types/appTypes';
import { isSupabaseConfigured, SUPABASE_URL } from '../lib/supabaseClient';
import {
  fetchCloudDataset,
  syncLocalDatasetToCloud,
} from '../services/housingService';
import { getRuntimePlatform } from '../utils/nativeBridge';
import {
  Download,
  Smartphone,
  Upload,
  Check,
  X,
  Share,
  HardDriveDownload,
  Copy,
  WifiOff,
  CheckCircle2,
  Database,
  RefreshCw,
  QrCode,
} from 'lucide-react';

interface InstallAndDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isInIframe: boolean;
  onTriggerInstall: () => Promise<boolean>;
  listings: BoardingHouseListing[];
  visits: ScheduledVisit[];
  savedIds: string[];
  onImportDataset: (data: {
    listings?: BoardingHouseListing[];
    visits?: ScheduledVisit[];
    savedIds?: string[];
  }) => void;
  onResetDefaultDataset: () => void;
}

export const InstallAndDataModal: React.FC<InstallAndDataModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  isInIframe,
  onTriggerInstall,
  listings,
  visits,
  savedIds,
  onImportDataset,
  onResetDefaultDataset,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [cloudStatus, setCloudStatus] = useState<string | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin;
  const runtimePlatform = getRuntimePlatform();
  const cloudConfigured = isSupabaseConfigured();

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleExportJson = () => {
    const payload = {
      app: 'BalayCapiz',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      listings,
      visits,
      savedIds,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balaycapiz-roxas-dataset-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result || '{}'));
        if (Array.isArray(parsed.listings)) {
          onImportDataset(parsed);
          setImportStatus(
            `Imported ${parsed.listings.length} boarding houses into BalayCapiz.`
          );
        } else {
          setImportStatus('Invalid file format: expected a BalayCapiz JSON export.');
        }
      } catch {
        setImportStatus('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handlePushToCloud = async () => {
    setIsSyncingCloud(true);
    setCloudStatus(null);
    const res = await syncLocalDatasetToCloud(listings, visits);
    setIsSyncingCloud(false);
    if (res.error) {
      setCloudStatus(`Cloud sync error: ${res.error}`);
    } else {
      setCloudStatus(
        `Synced ${res.syncedCount} Roxas City boarding houses & reviews to Supabase PostgreSQL.`
      );
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncingCloud(true);
    setCloudStatus(null);
    const res = await fetchCloudDataset();
    setIsSyncingCloud(false);
    if (res.error) {
      setCloudStatus(`Cloud fetch error: ${res.error}`);
    } else if (res.listings && res.listings.length > 0) {
      onImportDataset({
        listings: res.listings,
        visits: res.visits || undefined,
      });
      setCloudStatus(
        `Loaded ${res.listings.length} live boarding houses from Supabase.`
      );
    } else {
      setCloudStatus('Supabase table is currently empty. Click "Push Local to Cloud" to seed it.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-[#E5E0D8] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#0F172A] text-[#FAF8F5] flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/pwa-192x192.png"
              alt="BalayCapiz App Icon"
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border border-[#334155] shrink-0"
            />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-mono text-[#F5C842] truncate">
                CROSS-PLATFORM APP ({runtimePlatform.toUpperCase()}) · OFFLINE-READY
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white mt-0.5 leading-snug">
                Install BalayCapiz, Cloud Sync & Field Tools
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[40px] min-w-[40px] rounded-xl bg-[#1E293B] text-[#CBD5E1] hover:text-white flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* 1. Direct App Installation Section */}
          <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#1D4ED8] shrink-0" />
                <span>01. Install on Android, iOS, Windows, or macOS</span>
              </h3>
              <span className="text-xs font-mono text-[#15803D] flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Capacitor & PWA Ready
              </span>
            </div>

            {isInstalled ? (
              <div className="p-3.5 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl text-xs text-[#14532D] font-medium">
                BalayCapiz is currently running as an installed standalone application on your device.
              </div>
            ) : isInstallable ? (
              <div className="space-y-3">
                <p className="text-xs text-[#475569]">
                  Your browser supports direct one-tap installation. Installing adds the BalayCapiz icon to your home screen / app launcher and caches Roxas City maps and listings for offline use.
                </p>
                <button
                  type="button"
                  onClick={onTriggerInstall}
                  className="w-full min-h-[46px] py-3 px-4 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-[#1E293B] flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#F5C842]" />
                  Install BalayCapiz App Now
                </button>
              </div>
            ) : isIOS ? (
              <div className="space-y-2 text-xs text-[#334155] bg-white p-4 rounded-xl border border-[#E5E0D8]">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Share className="w-4 h-4 text-[#1D4ED8]" />
                  How to Install on iPhone / iPad (Safari):
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[#475569]">
                  <li>
                    Open this app URL in <strong>Safari</strong> on your iPhone or iPad.
                  </li>
                  <li>
                    Tap the <strong>Share</strong> button at the bottom of Safari.
                  </li>
                  <li>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-[#475569]">
                {isInIframe && (
                  <div className="p-3.5 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl text-[#78350F] leading-relaxed">
                    <strong>Why the native install button isn&apos;t triggered inside the preview frame:</strong> Chrome and Android block PWA installation prompts inside embedded preview iframes for security. Open the direct App URL in a new browser tab on your phone or laptop to click <strong>Install BalayCapiz</strong> in the address bar!
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-xl border border-[#E5E0D8]">
                  <span className="font-mono text-[11px] text-[#0F172A] truncate">
                    {appUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="w-full sm:w-auto min-h-[38px] px-3 py-1.5 bg-[#0F172A] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                        Copied URL
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy App Link
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white border border-[#E5E0D8] rounded-xl">
                    <div className="font-bold text-[#0F172A]">On Android (APK or Chrome):</div>
                    <p className="mt-1 text-[#64748B]">
                      Open in Chrome → tap <strong>⋮ menu → Install app</strong>, or build the native APK via <code>npm run android:apk:debug</code>.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-[#E5E0D8] rounded-xl">
                    <div className="font-bold text-[#0F172A]">On Windows / Mac (Desktop):</div>
                    <p className="mt-1 text-[#64748B]">
                      Open the link in Chrome or Edge → click the <strong>Install icon</strong> in the right side of the address bar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Supabase Cloud Database Synchronization */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#15803D] shrink-0" />
                <span>02. Supabase PostgreSQL Cloud Sync</span>
              </h3>
              <span
                className={`text-xs font-mono shrink-0 ${
                  cloudConfigured ? 'text-[#15803D]' : 'text-[#B45309]'
                }`}
              >
                {cloudConfigured ? '● Cloud Connected' : '○ Local Offline-First Mode'}
              </span>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              {cloudConfigured
                ? `Connected to ${SUPABASE_URL}. Changes to listings, student reviews, and visits sync automatically with offline caching.`
                : 'Running on local device storage with zero-latency offline support. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local to enable live multi-device cloud sync.'}
            </p>

            {cloudStatus && (
              <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] font-medium">
                {cloudStatus}
              </div>
            )}

            {cloudConfigured && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={isSyncingCloud}
                  onClick={handlePushToCloud}
                  className="min-h-[40px] px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`}
                  />
                  Push Local to Cloud
                </button>
                <button
                  type="button"
                  disabled={isSyncingCloud}
                  onClick={handlePullFromCloud}
                  className="min-h-[40px] px-4 py-2 bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold rounded-xl hover:bg-[#F3F0EA] disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Pull Latest from Cloud
                </button>
              </div>
            )}
          </div>

          {/* 3. Field Survey Data Backup / Import (.JSON) & Campus QR Poster */}
          <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                <HardDriveDownload className="w-5 h-5 text-[#0F172A] shrink-0" />
                <span>03. Field Survey Dataset (.JSON) & Campus QR Poster</span>
              </h3>
              <span className="text-xs font-mono text-[#64748B] shrink-0">
                {listings.length} properties loaded
              </span>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Surveyed real boarding houses in Lawaan, Fuentes Drive, or Roxas Ave? Export your dataset as a <code>.json</code> file or print the official QR poster for university bulletin boards.
            </p>

            {importStatus && (
              <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs text-[#1E3A8A] font-medium">
                {importStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full sm:w-auto min-h-[42px] px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Dataset (.json)
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto min-h-[42px] px-4 py-2 bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold rounded-xl hover:bg-[#F3F0EA] flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Import Dataset (.json)
              </button>

              <a
                href="/campus-qr-poster.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[42px] px-4 py-2 bg-[#FEF3C7] border border-[#FDE68A] text-[#78350F] text-xs font-bold rounded-xl hover:bg-[#FDE68A] flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                Print Campus QR Poster
              </a>

              <button
                type="button"
                onClick={() => {
                  onResetDefaultDataset();
                  setImportStatus('Restored default Roxas City dataset.');
                }}
                className="w-full sm:w-auto min-h-[42px] px-3 py-2 text-xs font-medium text-[#64748B] hover:text-[#B91C1C] text-center"
              >
                Reset to Default Data
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* 4. Offline Capabilities Indicator */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 flex items-start gap-3 text-xs">
            <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#15803D] flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-[#0F172A]">
                Offline-First Service Worker Enabled
              </div>
              <p className="text-[#64748B] mt-0.5 leading-relaxed">
                Workbox automatically precaches the app shell, typography, and visited OpenStreetMap tiles of Roxas City so students can review saved rooms, inspection checklists, and landlord phone numbers even without mobile data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
