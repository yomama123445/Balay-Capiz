import React, { useState } from 'react';
import {
  BoardingHouseListing,
  CAMPUSES,
  CAPELCO_BASELINE_RATE_PHP,
  FloodRiskLevel,
  GenderPolicy,
  RoomType,
} from '../data/roxasHousingData';
import { ScheduledVisit } from '../types/appTypes';
import { formatCurrentDatePh } from '../utils/nativeBridge';
import {
  RotateCcw,
  Plus,
  Check,
  Upload,
  Clock,
  ShieldCheck,
  MessageSquareReply,
  Users,
  ArrowUpRight,
  Calendar,
  Phone,
  MessageSquare,
  Lock,
  LogOut,
} from 'lucide-react';

interface LandlordPortalViewProps {
  listings: BoardingHouseListing[];
  visits: ScheduledVisit[];
  onUpdateVisitStatus: (visitId: string, status: ScheduledVisit['status']) => void;
  onRenewListing: (id: string) => void;
  onUpdateSlots: (id: string, delta: number) => void;
  onAddListing: (newListing: BoardingHouseListing) => void;
  onReplyToReview: (listingId: string, reviewId: string, replyMessage: string) => void;
  onOpenListing: (listing: BoardingHouseListing) => void;
}

export const LandlordPortalView: React.FC<LandlordPortalViewProps> = ({
  listings,
  visits,
  onUpdateVisitStatus,
  onRenewListing,
  onUpdateSlots,
  onAddListing,
  onReplyToReview,
  onOpenListing,
}) => {
  const [isHostVerified, setIsHostVerified] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('tahan_host_verified') === 'true';
    } catch {
      return false;
    }
  });
  const [hostPhoneInput, setHostPhoneInput] = useState<string>('0917-542-8810');
  const [hostPinInput, setHostPinInput] = useState<string>('');

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'visits' | 'new-listing'>(
    'dashboard'
  );
  const [renewedBannerId, setRenewedBannerId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  // New Listing Form State
  const [title, setTitle] = useState('');
  const [localSubtitle, setLocalSubtitle] = useState('');
  const [barangay, setBarangay] = useState('Lawaan');
  const [streetAddress, setStreetAddress] = useState('');
  const [nearestCampus, setNearestCampus] =
    useState<BoardingHouseListing['nearestCampus']>('hercor-lawaan');
  const [distanceMeters, setDistanceMeters] = useState<number>(300);
  const [monthlyRentPhp, setMonthlyRentPhp] = useState<number>(2000);
  const [roomType, setRoomType] = useState<RoomType>('Bedspace');
  const [genderPolicy, setGenderPolicy] = useState<GenderPolicy>('Women Only');
  const [totalSlots, setTotalSlots] = useState<number>(8);
  const [availableSlots, setAvailableSlots] = useState<number>(3);
  const [waterIncluded, setWaterIncluded] = useState<boolean>(true);
  const [capelcoStandard, setCapelcoStandard] = useState<boolean>(true);
  const [declaredKwhRate, setDeclaredKwhRate] = useState<number>(CAPELCO_BASELINE_RATE_PHP);
  const [floodRisk, setFloodRisk] = useState<FloodRiskLevel>('Low');
  const [elevationMeters, setElevationMeters] = useState<number>(0.8);
  const [floodNote, setFloodNote] = useState(
    'Elevated concrete driveway above Lawaan highway drainage; dry during 2025 monsoon.'
  );
  const [bfpUploaded, setBfpUploaded] = useState<boolean>(false);
  const [bfpFileName, setBfpFileName] = useState<string>('');
  const [bfpCertCode] = useState('FSIC-R6-RXS-2026-0719');
  const [landlordName, setLandlordName] = useState('Mrs. Elena Villanueva');
  const [landlordCallName, setLandlordCallName] = useState('Nanay Elena');
  const [landlordPhone, setLandlordPhone] = useState('0917-542-8810');
  const [wifiIncluded, setWifiIncluded] = useState<boolean>(true);
  const [hasStudyArea, setHasStudyArea] = useState<boolean>(true);
  const [hasKitchenAccess, setHasKitchenAccess] = useState<boolean>(true);
  const [hasPrivateCR, setHasPrivateCR] = useState<boolean>(false);
  const [gateSecurity] = useState('24/7 Steel Gate Lock + Caretaker');

  const handleHostLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostPhoneInput.trim()) return;
    setIsHostVerified(true);
    try {
      sessionStorage.setItem('tahan_host_verified', 'true');
    } catch {
      // Ignore storage error
    }
  };

  const handleQuickDemoHostAccess = () => {
    setIsHostVerified(true);
    try {
      sessionStorage.setItem('tahan_host_verified', 'true');
    } catch {
      // Ignore storage error
    }
  };

  const handleHostSignOut = () => {
    setIsHostVerified(false);
    try {
      sessionStorage.removeItem('tahan_host_verified');
    } catch {
      // Ignore storage error
    }
  };

  const handleBfpFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBfpUploaded(true);
    setBfpFileName(`${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`);
  };

  const handleRenew = (id: string) => {
    onRenewListing(id);
    setRenewedBannerId(id);
    setTimeout(() => setRenewedBannerId(null), 3500);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !streetAddress.trim() || !bfpUploaded) return;

    const targetCampus = CAMPUSES.find((c) => c.id === nearestCampus) || CAMPUSES[0];
    const walkMinutes = Math.max(1, Math.round(distanceMeters / 80));

    const created: BoardingHouseListing = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      localSubtitle: localSubtitle.trim() || `${landlordCallName}'s Verified Student Boarding House`,
      barangay,
      streetAddress: streetAddress.trim(),
      nearestCampus,
      distanceMeters,
      walkMinutes,
      trikeFarePhp: distanceMeters <= 400 ? 0 : 15,
      lat: targetCampus.lat + (Math.random() - 0.5) * 0.004,
      lng: targetCampus.lng + (Math.random() - 0.5) * 0.004,
      monthlyRentPhp,
      roomType,
      genderPolicy,
      totalSlots,
      availableSlots,
      waterIncluded,
      waterNote: waterIncluded
        ? 'MRWD water supply included in monthly rent'
        : 'Sub-metered MRWD water',
      capelcoStandard,
      declaredKwhRate: capelcoStandard ? CAPELCO_BASELINE_RATE_PHP : declaredKwhRate,
      crowdsourcedKwhRate: capelcoStandard ? CAPELCO_BASELINE_RATE_PHP : declaredKwhRate,
      meteringType: 'Individual CAPELCO Sub-meter',
      floodRisk,
      floodHistoryNote: floodNote,
      elevationMetersAboveStreet: elevationMeters,
      bfpVerified: true,
      bfpCertNumber: bfpCertCode,
      bfpInspectionDate: formatCurrentDatePh(),
      fireExtinguishersCount: 3,
      hasDedicatedFireExit: true,
      gateSecurity,
      curfewPolicy: '10:00 PM gate curfew (key provided for night classes)',
      visitorPolicy: 'Visitors welcome in ground receiving area until 8:00 PM',
      brownoutBackup: 'Emergency LED corridor lamps + charging outlet',
      wifiIncluded,
      wifiSpeedNote: wifiIncluded ? 'Fiber Wi-Fi 200 Mbps included' : 'Strong 5G indoor signal',
      hasStudyArea,
      hasKitchenAccess,
      hasLaundryArea: true,
      hasPrivateCR,
      hasWaterTank: true,
      hasCoveredMotoParking: true,
      landlordName,
      landlordLocalCallName: landlordCallName,
      landlordInitials: landlordName
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
      landlordSinceYear: 2022,
      landlordPhone,
      landlordKycVerified: true,
      landlordResponseNote: 'Direct SMS or phone call via Tahan',
      daysUntilExpiry: 30,
      lastUpdatedDate: formatCurrentDatePh(),
      visualPalette: {
        roofColor: '#0F172A',
        wallColor: '#FAF8F5',
        accentColor: '#D97706',
        foliageTone: '#15803D',
        architecturalStyle: 'concrete-two-storey',
      },
      reviews: [],
    };

    onAddListing(created);
    setActiveSubTab('dashboard');
    setTitle('');
    setStreetAddress('');
  };

  const expiringSoonListings = listings.filter((l) => l.daysUntilExpiry <= 14);
  const totalAvailableBeds = listings.reduce((sum, l) => sum + l.availableSlots, 0);
  const pendingVisitsCount = visits.filter((v) => v.status === 'Pending Landlord').length;

  if (!isHostVerified) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-16 pb-24">
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0F172A] text-[#F5C842] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1D4ED8]">Tahan Host Portal</div>
              <h1 className="text-xl font-bold text-[#0F172A]">Property Owner Sign-In</h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            To protect boarding house availability and utility disclosures from unauthorized edits, property management is restricted to verified landlords and dormitory managers.
          </p>

          <form onSubmit={handleHostLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Registered Landlord Mobile Number
              </label>
              <input
                type="tel"
                required
                value={hostPhoneInput}
                onChange={(e) => setHostPhoneInput(e.target.value)}
                placeholder="0917-542-8810"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs font-mono bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Host Access PIN / Verification Code
              </label>
              <input
                type="password"
                value={hostPinInput}
                onChange={(e) => setHostPinInput(e.target.value)}
                placeholder="Enter 4-digit host PIN"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] py-2.5 px-4 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-[#1E293B] transition-colors"
            >
              Unlock Host Portal
            </button>
          </form>

          <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#64748B]">Evaluating Tahan for a pitch or demo?</span>
            <button
              type="button"
              onClick={handleQuickDemoHostAccess}
              className="text-xs font-bold text-[#1D4ED8] hover:underline"
            >
              Enter Demo Host Session →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 lg:pb-12">
      {/* Header + Sub-navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 sm:pb-6 border-b border-[#E5E0D8]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#15803D]">
              ● Verified Host Session
            </span>
            <button
              type="button"
              onClick={handleHostSignOut}
              className="text-xs text-[#64748B] hover:text-[#0F172A] inline-flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Lock Portal
            </button>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] mt-1">
            Property Inventory & Student Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-2xl">
            Manage open bedspace slots, confirm viewing appointments, reply to verified tenant reviews, and renew active listings.
          </p>
        </div>

        <div className="flex items-center bg-[#F3F0EA] p-1 rounded-xl border border-[#E5E0D8] overflow-x-auto no-scrollbar max-w-full shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('dashboard')}
            className={`min-h-[38px] px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'dashboard'
                ? 'bg-[#0F172A] text-[#FAF8F5]'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Properties ({listings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('visits')}
            className={`min-h-[38px] px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'visits'
                ? 'bg-[#0F172A] text-[#FAF8F5]'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Viewing Requests ({visits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('new-listing')}
            className={`min-h-[38px] px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
              activeSubTab === 'new-listing'
                ? 'bg-[#0F172A] text-[#FAF8F5]'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Property
          </button>
        </div>
      </div>

      {activeSubTab === 'dashboard' && (
        <div className="mt-5 sm:mt-6 space-y-5 sm:space-y-6">
          {/* 4-Column KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-3.5 sm:p-4">
              <div className="text-xs text-[#64748B]">Active Properties</div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#0F172A] mt-1">
                {listings.length}
              </div>
              <div className="text-[11px] sm:text-xs text-[#15803D] mt-0.5">
                100% BFP FSIC Cleared
              </div>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-3.5 sm:p-4">
              <div className="text-xs text-[#64748B]">Open Bed Slots</div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#0F172A] mt-1">
                {totalAvailableBeds} beds
              </div>
              <div className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
                Live vacancy count
              </div>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-3.5 sm:p-4">
              <div className="text-xs text-[#64748B]">Viewing Requests</div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#1D4ED8] mt-1">
                {visits.length} total
              </div>
              <div className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
                {pendingVisitsCount} pending confirmation
              </div>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-3.5 sm:p-4">
              <div className="text-xs text-[#64748B]">Expiring ≤ 14 Days</div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#B45309] mt-1">
                {expiringSoonListings.length} dorms
              </div>
              <div className="text-[11px] sm:text-xs text-[#B45309] mt-0.5">
                1-tap 30d renewal ready
              </div>
            </div>
          </div>

          {renewedBannerId && (
            <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs text-[#14532D] font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-[#15803D] shrink-0" />
              Listing freshness timer reset to 30 days. Students will see today's verification timestamp.
            </div>
          )}

          {/* Property Management Cards */}
          <div className="space-y-4">
            {listings.map((item) => {
              const isExpiringSoon = item.daysUntilExpiry <= 14;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[11px] sm:text-xs text-[#64748B] font-mono truncate">
                        {item.bfpCertNumber || 'BFP-VERIFIED'} · {item.landlordName.toUpperCase()} ({item.landlordPhone})
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-[#0F172A] mt-0.5">
                        {item.title}
                      </h2>
                      <div className="text-xs text-[#475569] mt-0.5">
                        {item.streetAddress} · {item.roomType} ·{' '}
                        <span className="font-mono font-semibold text-[#0F172A]">
                          ₱{item.monthlyRentPhp.toLocaleString()}/mo
                        </span>{' '}
                        · Electricity: ₱{item.declaredKwhRate.toFixed(2)}/kWh
                      </div>
                    </div>

                    {/* Responsive Action Controls: Vacancy Stepper + 1-Tap Renew */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E5E0D8]">
                      <div className="flex items-center justify-between sm:justify-start gap-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl px-3 py-1.5">
                        <span className="text-xs text-[#475569] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#64748B]" />
                          Open Slots:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onUpdateSlots(item.id, -1)}
                            disabled={item.availableSlots <= 0}
                            className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] text-xs font-bold text-[#0F172A] disabled:opacity-40 hover:bg-[#F3F0EA]"
                          >
                            -
                          </button>
                          <span className="font-mono tabular-nums text-xs font-bold text-[#0F172A] min-w-[42px] text-center">
                            {item.availableSlots}/{item.totalSlots}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateSlots(item.id, 1)}
                            disabled={item.availableSlots >= item.totalSlots}
                            className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] text-xs font-bold text-[#0F172A] disabled:opacity-40 hover:bg-[#F3F0EA]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <span
                          className={`text-xs font-mono tabular-nums flex items-center gap-1 ${
                            isExpiringSoon ? 'text-[#B45309] font-semibold' : 'text-[#64748B]'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {item.daysUntilExpiry}d left
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRenew(item.id)}
                            className="min-h-[38px] px-3 py-1.5 bg-[#0F172A] text-[#FAF8F5] text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Renew (30d)
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenListing(item)}
                            className="min-h-[38px] px-3 py-1.5 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-xl hover:bg-[#F3F0EA] transition-colors flex items-center gap-1 whitespace-nowrap"
                          >
                            View
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tenant Reviews Requiring / Showing Landlord Reply */}
                  {item.reviews.length > 0 && (
                    <div className="pt-3 border-t border-[#E5E0D8] space-y-2.5">
                      <div className="text-xs font-semibold text-[#64748B]">
                        Student Tenant Reviews & Right-of-Reply ({item.reviews.length})
                      </div>
                      {item.reviews.map((rev) => {
                        const draftKey = `${item.id}_${rev.id}`;
                        return (
                          <div
                            key={rev.id}
                            className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 sm:p-3.5 text-xs space-y-2"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <span className="font-semibold text-[#0F172A]">
                                {rev.reviewerName} ({rev.programAndYear}) — "{rev.title}"
                              </span>
                              <span className="font-mono text-[#1D4ED8] shrink-0">
                                Reported ₱{rev.reportedKwhRate.toFixed(2)}/kWh
                              </span>
                            </div>
                            <p className="text-[#475569]">{rev.comment}</p>

                            {rev.landlordReply ? (
                              <div className="pt-2 border-t border-[#E5E0D8] text-[#334155]">
                                <span className="font-semibold text-[#0F172A]">
                                  Official Landlord Reply ({rev.landlordReply.respondedAt}):{' '}
                                </span>
                                {rev.landlordReply.message}
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  value={replyDrafts[draftKey] || ''}
                                  onChange={(e) =>
                                    setReplyDrafts((prev) => ({
                                      ...prev,
                                      [draftKey]: e.target.value,
                                    }))
                                  }
                                  placeholder={`Post an official reply as ${item.landlordLocalCallName}...`}
                                  className="flex-1 min-h-[38px] px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs focus:outline-none focus:border-[#0F172A]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const text = replyDrafts[draftKey]?.trim();
                                    if (!text) return;
                                    onReplyToReview(item.id, rev.id, text);
                                    setReplyDrafts((prev) => ({ ...prev, [draftKey]: '' }));
                                  }}
                                  className="min-h-[38px] px-3.5 py-1.5 bg-[#0F172A] text-white text-xs font-semibold rounded-lg hover:bg-[#1E293B] flex items-center justify-center gap-1 whitespace-nowrap"
                                >
                                  <MessageSquareReply className="w-3.5 h-3.5" />
                                  Post Reply
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'visits' && (
        <div className="mt-5 sm:mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#B45309] shrink-0" />
              <span>Incoming Student Viewing Appointments ({visits.length})</span>
            </h2>
            <span className="text-xs text-[#64748B]">
              Confirm appointments or reply via native SMS
            </span>
          </div>

          {visits.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-10 text-center text-xs text-[#64748B]">
              No incoming viewing appointments yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visits.map((v) => {
                const campus = CAMPUSES.find((c) => c.id === v.studentCampus);
                const cleanStudentPhone = v.studentPhone.replace(/[^0-9+]/g, '');

                return (
                  <div
                    key={v.id}
                    className="bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#64748B] truncate pr-2">
                          {v.visitDate} · {v.visitTimeSlot}
                        </span>
                        <span
                          className={`font-sans font-semibold shrink-0 ${
                            v.status === 'Confirmed'
                              ? 'text-[#15803D]'
                              : v.status === 'Visited & Inspected'
                              ? 'text-[#1D4ED8]'
                              : 'text-[#B45309]'
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#0F172A]">
                        Student: {v.studentName} ({v.occupantsCount}{' '}
                        {v.occupantsCount === 1 ? 'solo boarder' : 'roommates'})
                      </h3>
                      <div className="text-xs text-[#475569]">
                        Property: <strong>{v.listingTitle}</strong> · Studying at{' '}
                        {campus?.shortName || 'Roxas City'} · Contact:{' '}
                        <span className="font-mono">{v.studentPhone}</span>
                      </div>
                      {v.inspectionNotes && (
                        <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs text-[#475569]">
                          <strong>Student Note:</strong> "{v.inspectionNotes}"
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E5E0D8] flex flex-wrap items-center gap-2">
                      {v.status === 'Pending Landlord' && (
                        <button
                          type="button"
                          onClick={() => onUpdateVisitStatus(v.id, 'Confirmed')}
                          className="min-h-[38px] px-3 py-1.5 bg-[#15803D] text-white text-xs font-semibold rounded-lg hover:bg-[#166534] flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Confirm Slot
                        </button>
                      )}
                      <a
                        href={`sms:${cleanStudentPhone}?body=${encodeURIComponent(
                          `Maayong adlaw ${v.studentName}! Confirmed ang imo viewing sa ${v.listingTitle} sa ${v.visitDate} (${v.visitTimeSlot}). — ${v.landlordCallName}`
                        )}`}
                        className="min-h-[38px] px-3 py-1.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#78350F] text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        SMS Student
                      </a>
                      <a
                        href={`tel:${cleanStudentPhone}`}
                        className="min-h-[38px] px-3 py-1.5 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-lg flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'new-listing' && (
        <form
          onSubmit={handleCreateListing}
          className="mt-5 sm:mt-6 max-w-3xl bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-6 space-y-5 sm:space-y-6"
        >
          <div className="pb-4 border-b border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                Register New Student Boarding House
              </h2>
              <p className="text-xs text-[#64748B]">
                Listings are free (₱0 broker fee) and auto-archive after 30 days unless renewed.
              </p>
            </div>
            <span className="text-xs font-mono text-[#15803D] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              KYC + BFP Verification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Property Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. San Roque Scholars Boarding House"
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Local Subtitle / Compound Name
              </label>
              <input
                type="text"
                value={localSubtitle}
                onChange={(e) => setLocalSubtitle(e.target.value)}
                placeholder="e.g. Balay Tibudan · 2-Storey Concrete Dorm"
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0F172A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Roxas City Barangay *
              </label>
              <select
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              >
                <option value="Lawaan">Brgy. Lawaan</option>
                <option value="Tiza / Fuentes Drive">Brgy. Tiza / Fuentes Drive</option>
                <option value="Banica">Brgy. Banica</option>
                <option value="Brgy. VIII (Roxas Ave)">Brgy. VIII (Roxas Ave)</option>
                <option value="Inzo Arnaldo Village">Inzo Arnaldo Village</option>
                <option value="Mongpong">Brgy. Mongpong</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Complete Street Address & Landmark *
              </label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="e.g. 18 Rizal St., near Lawaan Barangay Hall, Roxas City"
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Nearest Campus Gate
              </label>
              <select
                value={nearestCampus}
                onChange={(e) =>
                  setNearestCampus(e.target.value as BoardingHouseListing['nearestCampus'])
                }
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              >
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Distance to Gate (meters)
              </label>
              <input
                type="number"
                min={50}
                max={3000}
                value={distanceMeters}
                onChange={(e) => setDistanceMeters(Number(e.target.value))}
                className="w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Monthly Rent (₱)
              </label>
              <input
                type="number"
                min={800}
                max={10000}
                step={50}
                value={monthlyRentPhp}
                onChange={(e) => setMonthlyRentPhp(Number(e.target.value))}
                className="w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              >
                <option value="Bedspace">Bedspace</option>
                <option value="Single Room">Single Room</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Studio w/ CR">Studio w/ CR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Gender Policy
              </label>
              <select
                value={genderPolicy}
                onChange={(e) => setGenderPolicy(e.target.value as GenderPolicy)}
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              >
                <option value="Women Only">Women Only</option>
                <option value="Men Only">Men Only</option>
                <option value="Co-ed (Separate Floors)">Co-ed (Separate Floors)</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Total Bed Slots
              </label>
              <input
                type="number"
                min={1}
                max={40}
                value={totalSlots}
                onChange={(e) => setTotalSlots(Number(e.target.value))}
                className="w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Available Now
              </label>
              <input
                type="number"
                min={1}
                max={totalSlots}
                value={availableSlots}
                onChange={(e) => setAvailableSlots(Number(e.target.value))}
                className="w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E0D8] space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A]">
              Safety, CAPELCO Rate & BFP Fire Clearance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-[#0F172A]">
                    CAPELCO Standard Rate
                  </span>
                  <input
                    type="checkbox"
                    checked={capelcoStandard}
                    onChange={(e) => {
                      setCapelcoStandard(e.target.checked);
                      if (e.target.checked) setDeclaredKwhRate(CAPELCO_BASELINE_RATE_PHP);
                    }}
                    className="w-4 h-4 accent-[#0F172A]"
                  />
                </label>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Pass-through ₱{CAPELCO_BASELINE_RATE_PHP}/kWh with zero markup.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Declared Rate (₱ / kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  disabled={capelcoStandard}
                  value={capelcoStandard ? CAPELCO_BASELINE_RATE_PHP : declaredKwhRate}
                  onChange={(e) => setDeclaredKwhRate(Number(e.target.value))}
                  className="w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white disabled:bg-[#F3F0EA] border border-[#CBD5E1] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Monsoon Flood Risk
                </label>
                <select
                  value={floodRisk}
                  onChange={(e) => setFloodRisk(e.target.value as FloodRiskLevel)}
                  className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
                >
                  <option value="Low">Low Risk (Elevated / Dry)</option>
                  <option value="Medium">Medium Risk (Street Puddles)</option>
                  <option value="High">High Risk (Flood Prone)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Street Elevation (+meters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={elevationMeters}
                  onChange={(e) => setElevationMeters(Number(e.target.value))}
                  className="w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Barangay Flood & Drainage Note
                </label>
                <input
                  type="text"
                  value={floodNote}
                  onChange={(e) => setFloodNote(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  BFP Fire Safety Inspection Certificate (FSIC) *
                </label>
                {!bfpUploaded && (
                  <button
                    type="button"
                    onClick={() => {
                      setBfpUploaded(true);
                      setBfpFileName(`${bfpCertCode}.pdf (Demo Sample)`);
                    }}
                    className="text-[11px] font-semibold text-[#1D4ED8] hover:underline"
                  >
                    Use sample FSIC for pitch demo
                  </button>
                )}
              </div>
              <label
                className={`block cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                  bfpUploaded
                    ? 'border-[#15803D] bg-[#F0FDF4]'
                    : 'border-[#CBD5E1] bg-[#FAF8F5] hover:border-[#0F172A]'
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleBfpFileChange}
                  className="hidden"
                />
                {bfpUploaded ? (
                  <div className="text-xs font-semibold text-[#15803D] flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Attached: {bfpFileName || `${bfpCertCode}.pdf`}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-5 h-5 mx-auto text-[#64748B]" />
                    <div className="text-xs font-semibold text-[#0F172A]">
                      Choose BFP Fire Safety Certificate PDF or Photo
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Required before &quot;BFP Cleared&quot; status is displayed on Tahan.
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E0D8] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Landlord Full Name *
              </label>
              <input
                type="text"
                required
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Local Call Name
              </label>
              <input
                type="text"
                value={landlordCallName}
                onChange={(e) => setLandlordCallName(e.target.value)}
                placeholder="e.g. Nanay Elena / Manong Roel"
                className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Mobile Number (for tel: & sms:) *
              </label>
              <input
                type="tel"
                required
                value={landlordPhone}
                onChange={(e) => setLandlordPhone(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg"
              />
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={waterIncluded}
                onChange={(e) => setWaterIncluded(e.target.checked)}
                className="accent-[#0F172A]"
              />
              <span>MRWD Water Included</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wifiIncluded}
                onChange={(e) => setWifiIncluded(e.target.checked)}
                className="accent-[#0F172A]"
              />
              <span>Fiber Wi-Fi Included</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasStudyArea}
                onChange={(e) => setHasStudyArea(e.target.checked)}
                className="accent-[#0F172A]"
              />
              <span>Study Area</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPrivateCR}
                onChange={(e) => setHasPrivateCR(e.target.checked)}
                className="accent-[#0F172A]"
              />
              <span>Private Inside CR</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveSubTab('dashboard')}
              className="min-h-[42px] px-4 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!bfpUploaded}
              className="min-h-[42px] px-5 sm:px-6 py-2.5 bg-[#0F172A] disabled:bg-[#94A3B8] text-[#FAF8F5] text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors"
            >
              Publish Verified Listing
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
