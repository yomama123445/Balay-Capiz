import React, { useState } from 'react';
import {
  BoardingHouseListing,
  CAMPUSES,
  CAPELCO_BASELINE_RATE_PHP,
  TenantReview,
} from '../data/roxasHousingData';
import { ScheduledVisit } from '../types/appTypes';
import { PropertyIllustration, SCENE_LABELS } from './PropertyIllustration';
import {
  ArrowLeft,
  Heart,
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  Droplets,
  Lock,
  Wifi,
  Star,
  Upload,
  Check,
  Copy,
  FileCheck2,
  MapPin,
  CalendarPlus,
  Users,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: BoardingHouseListing;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onAddReview: (listingId: string, review: TenantReview) => void;
  onScheduleVisit: (visit: ScheduledVisit) => void;
  onJumpToMap: (campusId: BoardingHouseListing['nearestCampus']) => void;
  estimatedMonthlyKwh: number;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isSaved,
  onToggleSave,
  onAddReview,
  onScheduleVisit,
  onJumpToMap,
  estimatedMonthlyKwh,
}) => {
  const [activeScene, setActiveScene] = useState<number>(0);
  const [smsLanguage, setSmsLanguage] = useState<'hiligaynon' | 'english'>('hiligaynon');
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [roommateSplit, setRoommateSplit] = useState<number>(1);

  // Schedule Visit Modal / Drawer State
  const [showVisitBooking, setShowVisitBooking] = useState<boolean>(false);
  const [visitDate, setVisitDate] = useState<string>('2026-10-24');
  const [visitTimeSlot, setVisitTimeSlot] = useState<string>('10:00 AM – 11:00 AM (Saturday)');
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('0917-');
  const [visitNote, setVisitNote] = useState<string>(
    'Check room ventilation, water pressure, and individual CAPELCO sub-meter.'
  );
  const [visitConfirmedBanner, setVisitConfirmedBanner] = useState<boolean>(false);

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [programAndYear, setProgramAndYear] = useState('BS Computer Science · 3rd Year (Hercor)');
  const [rating, setRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reportedKwh, setReportedKwh] = useState<string>(listing.declaredKwhRate.toFixed(2));
  const [proofUploaded, setProofUploaded] = useState<boolean>(false);
  const [proofFileName, setProofFileName] = useState<string>('');
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState<boolean>(false);

  const campusObj = CAMPUSES.find((c) => c.id === listing.nearestCampus);

  const avgRating =
    listing.reviews.length > 0
      ? (
          listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
        ).toFixed(1)
      : 'New';

  const smsBody =
    smsLanguage === 'hiligaynon'
      ? `Maayong adlaw ${listing.landlordLocalCallName}! Nakita ko ang "${listing.title}" sa BalayCapiz (₱${listing.monthlyRentPhp.toLocaleString()}/mo). Estudyante ako sa ${campusObj?.shortName || 'Roxas City'}. May bakante pa nga ${listing.roomType.toLowerCase()} kag pwede ma-check subong nga semana? Salamat gid!`
      : `Good day ${listing.landlordLocalCallName}! I saw "${listing.title}" on BalayCapiz (₱${listing.monthlyRentPhp.toLocaleString()}/mo). I'm a student at ${campusObj?.shortName || 'Roxas City'}. Do you still have an available ${listing.roomType.toLowerCase()} slot for viewing this week? Thank you!`;

  const cleanPhone = listing.landlordPhone.replace(/[^0-9+]/g, '');

  const elecCostPhp = Math.round(estimatedMonthlyKwh * listing.declaredKwhRate);
  const waterCostPhp = listing.waterIncluded ? 0 : 135;
  const totalMonthlyOutOfPocket = listing.monthlyRentPhp + elecCostPhp + waterCostPhp;
  const perPersonMonthly = Math.round(totalMonthlyOutOfPocket / roommateSplit);

  const handleCopySmsInfo = () => {
    navigator.clipboard?.writeText(`${listing.landlordPhone}\n\n${smsBody}`);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  const handleSimulateProofUpload = () => {
    setProofUploaded(true);
    setProofFileName('hercor_student_id_receipt_blurred.jpg');
  };

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const newVisit: ScheduledVisit = {
      id: `visit-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      barangay: listing.barangay,
      streetAddress: listing.streetAddress,
      landlordName: listing.landlordName,
      landlordCallName: listing.landlordLocalCallName,
      landlordPhone: listing.landlordPhone,
      monthlyRentPhp: listing.monthlyRentPhp,
      visitDate,
      visitTimeSlot,
      studentName: visitorName.trim(),
      studentPhone: visitorPhone.trim() || '0917-000-0000',
      studentCampus: listing.nearestCampus,
      occupantsCount: roommateSplit,
      status: 'Pending Landlord',
      inspectionNotes: visitNote.trim(),
      checklist: {
        checkedSubMeter: false,
        testedMorningWater: false,
        verifiedFireExit: false,
        checkedCellSignal: false,
      },
      createdAt: 'Oct 22, 2026',
    };

    onScheduleVisit(newVisit);
    setShowVisitBooking(false);
    setVisitConfirmedBanner(true);
    setTimeout(() => setVisitConfirmedBanner(false), 4500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewTitle.trim() || !reviewComment.trim() || !proofUploaded) {
      return;
    }

    const parts = reviewerName.trim().split(' ');
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : reviewerName.slice(0, 2).toUpperCase();

    const newReview: TenantReview = {
      id: `rev-${Date.now()}`,
      reviewerName: reviewerName.trim(),
      reviewerInitials: initials,
      programAndYear,
      stayPeriod: 'AY 2026–2027 (Current Sem)',
      rating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      reportedKwhRate: parseFloat(reportedKwh) || listing.declaredKwhRate,
      verificationMethod: 'Student ID + Receipt Verified',
      verifiedDate: 'October 22, 2026',
    };

    onAddReview(listing.id, newReview);
    setReviewerName('');
    setReviewTitle('');
    setReviewComment('');
    setProofUploaded(false);
    setProofFileName('');
    setShowReviewForm(false);
    setReviewSubmittedMsg(true);
    setTimeout(() => setReviewSubmittedMsg(false), 4000);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 lg:pb-12">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between gap-2 pb-4 sm:pb-5 border-b border-[#E5E0D8]">
        <button
          type="button"
          onClick={onClose}
          className="min-h-[42px] inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F172A] hover:text-[#B45309] transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Back to Rooms
        </button>

        <div className="flex items-center gap-2.5 text-xs text-[#64748B]">
          <span className="hidden md:inline font-mono tabular-nums">
            Verified · {listing.daysUntilExpiry}d before auto-archive
          </span>
          <button
            type="button"
            onClick={() => onToggleSave(listing.id)}
            className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap ${
              isSaved
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]'
                : 'bg-white border-[#E5E0D8] text-[#0F172A] hover:bg-[#F3F0EA]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#B91C1C] text-[#B91C1C]' : ''}`} />
            {isSaved ? 'Saved' : 'Save Room'}
          </button>
        </div>
      </div>

      {visitConfirmedBanner && (
        <div className="mt-4 p-4 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs text-[#14532D] font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>
            Viewing scheduled for <strong>{visitDate} ({visitTimeSlot})</strong> with {listing.landlordLocalCallName}! Added to your Saved & Visits tab.
          </span>
          <a
            href={`sms:${cleanPhone}?body=${encodeURIComponent(
              `Maayong adlaw ${listing.landlordLocalCallName}! Nag-schedule ako sang room viewing sa ${listing.title} sa ${visitDate} (${visitTimeSlot}). Salamat!`
            )}`}
            className="min-h-[38px] px-3 py-2 bg-[#15803D] text-white rounded-lg font-semibold text-center shrink-0"
          >
            Send SMS Confirmation
          </a>
        </div>
      )}

      {/* Main Contiguous 12-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-5 sm:mt-6 items-start">
        {/* LEFT COLUMN (7 Cols on Desktop) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 min-w-0">
          {/* Interactive 4-Scene Architectural Gallery */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden">
            <div className="aspect-[16/10] w-full bg-[#F3F0EA] relative">
              <PropertyIllustration
                listing={listing}
                sceneIndex={activeScene}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Scene Selector Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[#E5E0D8] bg-[#FAF8F5]">
              {SCENE_LABELS.map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveScene(idx)}
                  className={`min-h-[46px] px-2.5 sm:px-3 py-2 text-left text-xs transition-colors border-b sm:border-b-0 border-r last:border-r-0 border-[#E5E0D8] ${
                    activeScene === idx
                      ? 'bg-[#0F172A] text-[#FAF8F5] font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F3F0EA]'
                  }`}
                >
                  <div className="font-mono text-[10px] opacity-70">VIEW 0{idx + 1}</div>
                  <div className="truncate mt-0.5">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Clean Unboxed Metadata Header */}
          <div className="pb-5 border-b border-[#E5E0D8]">
            <div className="text-xs text-[#64748B] font-medium">
              Brgy. {listing.barangay} · {listing.distanceMeters}m to {campusObj?.shortName} Gate ({listing.walkMinutes} min walk) · {listing.roomType} · {listing.genderPolicy}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] mt-1.5">
              {listing.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1">
              {listing.localSubtitle} — {listing.streetAddress}
            </p>
          </div>

          {/* SAFETY & COMPLIANCE SUMMARY LEDGER */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#15803D] shrink-0" />
                <span>Safety, Flood & CAPELCO Compliance</span>
              </h2>
              <span className="text-xs font-mono text-[#15803D]">
                {listing.bfpCertNumber || 'BFP INSPECTED'}
              </span>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-2xl divide-y divide-[#E5E0D8]">
              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                    Electricity Billing & Sub-Meter Transparency
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5">
                    {listing.meteringType} · CAPELCO baseline is ₱{CAPELCO_BASELINE_RATE_PHP}/kWh
                  </div>
                </div>
                <div className="sm:text-right font-mono tabular-nums">
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      listing.capelcoStandard ? 'text-[#15803D]' : 'text-[#B45309]'
                    }`}
                  >
                    ₱{listing.declaredKwhRate.toFixed(2)} / kWh declared
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#64748B]">
                    Tenant avg: ₱{listing.crowdsourcedKwhRate.toFixed(2)}/kWh
                  </div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#0284C7] shrink-0" />
                    Monsoon & Typhoon Flood Profile (Brgy. {listing.barangay})
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5 max-w-xl">
                    {listing.floodHistoryNote}
                  </div>
                </div>
                <div className="sm:text-right shrink-0 font-mono tabular-nums">
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      listing.floodRisk === 'Low'
                        ? 'text-[#15803D]'
                        : listing.floodRisk === 'Medium'
                        ? 'text-[#B45309]'
                        : 'text-[#B91C1C]'
                    }`}
                  >
                    Flood Risk: {listing.floodRisk}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#64748B]">
                    +{listing.elevationMetersAboveStreet.toFixed(2)}m above street
                  </div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#15803D] shrink-0" />
                    BFP Fire Safety Inspection Certificate (FSIC)
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5">
                    {listing.fireExtinguishersCount} active fire extinguishers ·{' '}
                    {listing.hasDedicatedFireExit
                      ? 'Dedicated steel fire exit stairwell confirmed'
                      : 'Standard exit'}
                  </div>
                </div>
                <div className="sm:text-right shrink-0 font-mono tabular-nums">
                  <div className="text-xs sm:text-sm font-bold text-[#15803D]">
                    {listing.bfpVerified ? 'BFP Cleared' : 'Pending Inspection'}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#64748B]">
                    Inspected {listing.bfpInspectionDate}
                  </div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#0F172A] shrink-0" />
                    Gate Security, Curfew & Brownout Backup
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5">
                    {listing.curfewPolicy} · {listing.brownoutBackup}
                  </div>
                </div>
                <div className="sm:text-right shrink-0 text-xs font-medium text-[#0F172A]">
                  {listing.gateSecurity}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities & House Rules */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] mb-3">
              Room Amenities & Utilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white border border-[#E5E0D8] rounded-xl flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 shrink-0" /> Internet Connectivity
                  </div>
                  <div className="text-[#64748B] mt-0.5">{listing.wifiSpeedNote}</div>
                </div>
                <span className="font-mono font-medium text-[#0F172A] shrink-0">
                  {listing.wifiIncluded ? 'Included' : 'Optional'}
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#E5E0D8] rounded-xl flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-[#0F172A]">Water Supply (MRWD)</div>
                  <div className="text-[#64748B] mt-0.5">{listing.waterNote}</div>
                </div>
                <span className="font-mono font-medium text-[#0F172A] shrink-0">
                  {listing.waterIncluded ? 'Included' : 'Sub-metered'}
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#E5E0D8] rounded-xl flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-[#0F172A]">Bathroom / Comfort Room</div>
                  <div className="text-[#64748B] mt-0.5">
                    {listing.hasPrivateCR
                      ? 'Inside room (Private CR & shower)'
                      : 'Maintained shared floor CR (cleaned daily)'}
                  </div>
                </div>
                <span className="font-mono font-medium text-[#0F172A] shrink-0">
                  {listing.hasPrivateCR ? 'Private CR' : 'Shared CR'}
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#E5E0D8] rounded-xl flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-[#0F172A]">Cooking, Laundry & Study</div>
                  <div className="text-[#64748B] mt-0.5">
                    {listing.hasStudyArea ? 'Dedicated study area' : 'In-room desk'} ·{' '}
                    {listing.hasKitchenAccess ? 'Kitchen access' : 'Light cooking'} ·{' '}
                    {listing.hasCoveredMotoParking ? 'Covered moto parking' : 'Street parking'}
                  </div>
                </div>
                <span className="font-mono font-medium text-[#15803D] shrink-0">Confirmed</span>
              </div>
            </div>
          </div>

          {/* VERIFIED STUDENT REVIEWS */}
          <div className="pt-4 border-t border-[#E5E0D8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  Verified Student Tenant Reviews ({listing.reviews.length})
                </h2>
                <p className="text-xs text-[#64748B]">
                  Every review requires a Student ID or rental receipt upload to verify tenancy and reported kWh rates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm((prev) => !prev)}
                className="min-h-[40px] px-4 py-2 bg-[#0F172A] text-[#FAF8F5] text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors whitespace-nowrap self-start"
              >
                {showReviewForm ? 'Cancel Review' : 'Submit Verified Review'}
              </button>
            </div>

            {reviewSubmittedMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs text-[#14532D] font-medium">
                Thank you! Your tenancy-verified review and kWh rate report have been added to {listing.title}.
              </div>
            )}

            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="mb-6 bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Write a Tenancy-Verified Review
                  </h3>
                  <span className="text-xs font-mono text-[#1D4ED8]">Tenancy Proof Required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Your Name (or First Name + Last Initial) *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Carlo M."
                      className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Degree Program & School *
                    </label>
                    <input
                      type="text"
                      required
                      value={programAndYear}
                      onChange={(e) => setProgramAndYear(e.target.value)}
                      className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Overall Stay Rating
                    </label>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1.5 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? 'fill-[#D97706] text-[#D97706]'
                                : 'text-[#CBD5E1]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono ml-2 text-[#0F172A]">{rating}.0 / 5.0</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Electricity Rate Experienced (₱ / kWh) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={reportedKwh}
                      onChange={(e) => setReportedKwh(e.target.value)}
                      placeholder="11.42"
                      className="w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0F172A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Honest electricity billing and quiet after 9 PM"
                    className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Detailed Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share concrete details about water pressure, flood drainage, and electricity billing..."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Proof of Tenancy (Student ID or Signed Rental Receipt) *
                  </label>
                  <div
                    onClick={handleSimulateProofUpload}
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                      proofUploaded
                        ? 'border-[#15803D] bg-[#F0FDF4]'
                        : 'border-[#CBD5E1] bg-white hover:border-[#0F172A]'
                    }`}
                  >
                    {proofUploaded ? (
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#15803D]">
                        <Check className="w-4 h-4" />
                        Attached: {proofFileName} (Auto-blurred for privacy)
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-5 h-5 mx-auto text-[#64748B]" />
                        <div className="text-xs font-semibold text-[#0F172A]">
                          Tap to Attach Student ID or Rental Receipt Photo
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          Sensitive details are blurred before verification.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="min-h-[40px] px-4 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!proofUploaded}
                    className="min-h-[40px] px-5 py-2 bg-[#0F172A] disabled:bg-[#94A3B8] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors"
                  >
                    Publish Verified Review
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {listing.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-[#E5E0D8] rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#0F172A] text-[#FAF8F5] text-xs font-bold flex items-center justify-center shrink-0">
                        {rev.reviewerInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] truncate">
                          {rev.reviewerName}{' '}
                          <span className="font-normal text-[#64748B]">
                            · {rev.programAndYear}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#1D4ED8] font-medium">
                          {rev.verificationMethod} · Reported ₱{rev.reportedKwhRate.toFixed(2)}/kWh
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 font-mono text-xs text-[#D97706] shrink-0">
                      {'★'.repeat(rev.rating)}
                      <span className="text-[#CBD5E1]">{'★'.repeat(5 - rev.rating)}</span>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-[#0F172A]">{rev.title}</div>
                  <p className="text-xs text-[#475569] leading-relaxed">{rev.comment}</p>

                  {rev.landlordReply && (
                    <div className="mt-3 pt-3 border-t border-[#E5E0D8] bg-[#FAF8F5] p-3 rounded-xl">
                      <div className="text-[11px] font-semibold text-[#0F172A]">
                        Response from {listing.landlordName} ({listing.landlordLocalCallName}) ·{' '}
                        <span className="font-normal text-[#64748B]">
                          {rev.landlordReply.respondedAt}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] mt-1">{rev.landlordReply.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols on Desktop): Contiguous Pricing, Roommate Splitter, Viewing Scheduler & Direct Contact */}
        <div
          id="booking-contact-module"
          className="lg:col-span-5 lg:sticky lg:top-20 space-y-5 min-w-0"
        >
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-6 space-y-5">
            {/* Price & Availability Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-[#E5E0D8]">
              <div>
                <div className="text-xs text-[#64748B]">Monthly Boarding Rate</div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#0F172A]">
                    ₱{listing.monthlyRentPhp.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#64748B]">/ month</span>
                </div>
                <div className="text-xs text-[#15803D] font-medium mt-1">
                  ₱0 Broker Fee · {listing.waterIncluded ? 'MRWD Water Included' : 'Metered Water'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-mono tabular-nums text-[#0F172A]">
                  ★ {avgRating} ({listing.reviews.length})
                </div>
                <div className="text-xs font-mono tabular-nums text-[#B45309] font-semibold mt-1">
                  {listing.availableSlots} of {listing.totalSlots} slots open
                </div>
              </div>
            </div>

            {/* Interactive Roommate Split + True Monthly Out-of-Pocket */}
            <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3.5 sm:p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  Occupancy & Cost Split
                </span>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#E5E0D8]">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRoommateSplit(n)}
                      className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        roommateSplit === n
                          ? 'bg-[#0F172A] text-white'
                          : 'text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      {n === 1 ? 'Solo' : `÷${n}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[#475569]">
                  <span>Base Monthly Rent ({listing.roomType})</span>
                  <span className="font-mono tabular-nums">
                    ₱{listing.monthlyRentPhp.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>
                    Est. Electricity ({estimatedMonthlyKwh} kWh @ ₱
                    {listing.declaredKwhRate.toFixed(2)})
                  </span>
                  <span className="font-mono tabular-nums">+₱{elecCostPhp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>MRWD Water Supply</span>
                  <span className="font-mono tabular-nums">
                    {listing.waterIncluded ? '₱0 (Included)' : '+₱135'}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#E5E0D8] flex items-baseline justify-between">
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">
                    {roommateSplit === 1
                      ? 'Estimated True Total'
                      : `Your Share (÷${roommateSplit} Roommates)`}
                  </div>
                  {roommateSplit > 1 && (
                    <div className="text-[11px] text-[#64748B] font-mono tabular-nums">
                      Full room total: ₱{totalMonthlyOutOfPocket.toLocaleString()}/mo
                    </div>
                  )}
                </div>
                <span className="text-lg font-extrabold font-mono tabular-nums text-[#15803D]">
                  ₱{perPersonMonthly.toLocaleString()} / mo
                </span>
              </div>
            </div>

            {/* Schedule Room Viewing Interactive Drawer Trigger / Form */}
            {!showVisitBooking ? (
              <button
                type="button"
                onClick={() => setShowVisitBooking(true)}
                className="w-full min-h-[46px] py-3 px-4 bg-[#F3F0EA] hover:bg-[#E5E0D8] text-[#0F172A] text-xs font-bold rounded-xl border border-[#CBD5E1] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <CalendarPlus className="w-4 h-4 text-[#B45309] shrink-0" />
                Schedule In-Person Room Viewing
              </button>
            ) : (
              <form
                onSubmit={handleCreateVisit}
                className="bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
                  <span className="text-xs font-bold text-[#0F172A]">
                    Book Room Inspection with {listing.landlordLocalCallName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowVisitBooking(false)}
                    className="text-[11px] text-[#64748B] hover:text-[#0F172A]"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                      Visit Date
                    </label>
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full min-h-[38px] px-2.5 py-1.5 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                      Time Slot
                    </label>
                    <select
                      value={visitTimeSlot}
                      onChange={(e) => setVisitTimeSlot(e.target.value)}
                      className="w-full min-h-[38px] px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg"
                    >
                      <option value="9:00 AM – 10:00 AM">9:00 AM – 10:00 AM</option>
                      <option value="10:00 AM – 11:00 AM (Saturday)">
                        10:00 AM – 11:00 AM
                      </option>
                      <option value="1:30 PM – 2:30 PM">1:30 PM – 2:30 PM</option>
                      <option value="4:30 PM – 5:30 PM (After Class)">
                        4:30 PM – 5:30 PM (After Class)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="e.g. Joshua Villa"
                      className="w-full min-h-[38px] px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                      Your Mobile #
                    </label>
                    <input
                      type="tel"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder="0917-XXX-XXXX"
                      className="w-full min-h-[38px] px-2.5 py-1.5 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                    Reminder Note for Inspection
                  </label>
                  <input
                    type="text"
                    value={visitNote}
                    onChange={(e) => setVisitNote(e.target.value)}
                    className="w-full min-h-[38px] px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[42px] py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-lg hover:bg-[#1E293B]"
                >
                  Save Viewing & Add Inspection Checklist
                </button>
              </form>
            )}

            {/* Landlord KYC Profile Strip */}
            <div className="flex items-start gap-3.5 pt-2 border-t border-[#E5E0D8]">
              <div className="w-11 h-11 rounded-full bg-[#0F172A] text-[#FAF8F5] font-display font-bold text-sm flex items-center justify-center shrink-0">
                {listing.landlordInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[#0F172A]">
                  {listing.landlordName} ({listing.landlordLocalCallName})
                </div>
                <div className="text-xs text-[#64748B]">
                  Landlord since {listing.landlordSinceYear} · KYC & Barangay Permit Verified
                </div>
                <div className="text-xs text-[#475569] mt-1">{listing.landlordResponseNote}</div>
              </div>
            </div>

            {/* Pre-formatted SMS Language Selector */}
            <div className="space-y-2 pt-2 border-t border-[#E5E0D8]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#0F172A]">
                  Direct SMS Template
                </span>
                <div className="flex items-center gap-1 bg-[#F3F0EA] p-0.5 rounded-lg border border-[#E5E0D8]">
                  <button
                    type="button"
                    onClick={() => setSmsLanguage('hiligaynon')}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      smsLanguage === 'hiligaynon'
                        ? 'bg-[#0F172A] text-white'
                        : 'text-[#475569]'
                    }`}
                  >
                    Hiligaynon
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmsLanguage('english')}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      smsLanguage === 'english' ? 'bg-[#0F172A] text-white' : 'text-[#475569]'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs text-[#334155] italic leading-relaxed">
                "{smsBody}"
              </div>
            </div>

            {/* Direct tel: and sms: Action Buttons */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${cleanPhone}`}
                  className="min-h-[46px] py-3 px-3 bg-[#0F172A] text-[#FAF8F5] text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="truncate">Call {listing.landlordLocalCallName}</span>
                </a>
                <a
                  href={`sms:${cleanPhone}?body=${encodeURIComponent(smsBody)}`}
                  className="min-h-[46px] py-3 px-3 bg-[#D97706] text-[#0F172A] text-xs font-bold rounded-xl hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Send SMS</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopySmsInfo}
                  className="min-h-[42px] py-2 px-3 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-xl hover:bg-[#F3F0EA] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                      <span className="truncate">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Copy # & SMS</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onJumpToMap(listing.nearestCampus)}
                  className="min-h-[42px] py-2 px-3 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-xl hover:bg-[#F3F0EA] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span className="truncate">Campus Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
