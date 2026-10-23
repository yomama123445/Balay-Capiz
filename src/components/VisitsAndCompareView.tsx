import React, { useState } from 'react';
import { BoardingHouseListing, CAMPUSES } from '../data/roxasHousingData';
import { ScheduledVisit, InspectionChecklist } from '../types/appTypes';
import {
  Calendar,
  CheckSquare,
  Square,
  Phone,
  MessageSquare,
  Trash2,
  ArrowUpRight,
  Users,
  ShieldCheck,
  Zap,
  Droplets,
  Heart,
  CheckCircle2,
} from 'lucide-react';

interface VisitsAndCompareViewProps {
  listings: BoardingHouseListing[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  visits: ScheduledVisit[];
  onUpdateVisitStatus: (visitId: string, status: ScheduledVisit['status']) => void;
  onToggleChecklistItem: (visitId: string, key: keyof InspectionChecklist) => void;
  onUpdateVisitNotes: (visitId: string, notes: string) => void;
  onDeleteVisit: (visitId: string) => void;
  onOpenListing: (listing: BoardingHouseListing) => void;
  onNavigateExplore: () => void;
  estimatedMonthlyKwh: number;
}

export const VisitsAndCompareView: React.FC<VisitsAndCompareViewProps> = ({
  listings,
  savedIds,
  onToggleSave,
  visits,
  onUpdateVisitStatus,
  onToggleChecklistItem,
  onUpdateVisitNotes,
  onDeleteVisit,
  onOpenListing,
  onNavigateExplore,
  estimatedMonthlyKwh,
}) => {
  const [subView, setSubView] = useState<'compare' | 'visits'>('compare');
  const [roommateSplit, setRoommateSplit] = useState<number>(1);

  const savedListings = listings.filter((l) => savedIds.includes(l.id));

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 lg:pb-12">
      {/* Header & Sub-Navigation Segmented Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#E5E0D8]">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#1D4ED8] tracking-tight truncate">
            Shortlist Comparison & Room Inspection Planner
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] mt-1">
            Saved Rooms & Viewing Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-2xl">
            Compare your saved properties side by side with roommate cost splitting, or use the on-site checklist during your room visit.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center bg-[#F3F0EA] p-1 rounded-xl border border-[#E5E0D8] w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setSubView('compare')}
            className={`min-h-[40px] px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              subView === 'compare'
                ? 'bg-[#0F172A] text-[#FAF8F5]'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Shortlist ({savedListings.length})
          </button>
          <button
            type="button"
            onClick={() => setSubView('visits')}
            className={`min-h-[40px] px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              subView === 'visits'
                ? 'bg-[#0F172A] text-[#FAF8F5]'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Visits & Checklist ({visits.length})
          </button>
        </div>
      </div>

      {subView === 'compare' ? (
        <div className="mt-5 sm:mt-6 space-y-5 sm:space-y-6">
          {/* Roommate Cost Splitter Bar */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F0EA] flex items-center justify-center text-[#0F172A] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0F172A]">
                  Roommate Cost-Split Calculator
                </div>
                <p className="text-xs text-[#64748B]">
                  Splitting a room with classmates? Adjust occupancy to see your per-person share of Rent + CAPELCO ({estimatedMonthlyKwh} kWh) + Water.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E0D8] w-full sm:w-auto shrink-0">
              {[
                { count: 1, label: '1 Solo' },
                { count: 2, label: '2 Split (÷2)' },
                { count: 3, label: '3 Split (÷3)' },
              ].map((opt) => (
                <button
                  key={opt.count}
                  type="button"
                  onClick={() => setRoommateSplit(opt.count)}
                  className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    roommateSplit === opt.count
                      ? 'bg-[#0F172A] text-[#FAF8F5]'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {savedListings.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-3">
              <Heart className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <div className="text-base font-bold text-[#0F172A]">
                Your comparison shortlist is empty
              </div>
              <p className="text-xs text-[#64748B]">
                Tap the heart icon on any boarding house in Discover or Map Radar to compare monthly costs, CAPELCO kWh rates, and flood elevation side by side.
              </p>
              <button
                type="button"
                onClick={onNavigateExplore}
                className="min-h-[44px] px-5 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors"
              >
                Browse Roxas City Rooms
              </button>
            </div>
          ) : (
            <>
              {/* MOBILE STACKED COMPARISON CARDS (< 768px, md:hidden) */}
              <div className="md:hidden space-y-4">
                {savedListings.map((item) => {
                  const campus = CAMPUSES.find((c) => c.id === item.nearestCampus);
                  const elecPhp = Math.round(estimatedMonthlyKwh * item.declaredKwhRate);
                  const waterPhp = item.waterIncluded ? 0 : 135;
                  const totalRoomCost = item.monthlyRentPhp + elecPhp + waterPhp;
                  const perPerson = Math.round(totalRoomCost / roommateSplit);

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-[#E5E0D8] rounded-2xl p-4 space-y-3.5"
                    >
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E5E0D8]">
                        <div className="min-w-0">
                          <div className="text-[11px] text-[#64748B]">
                            Brgy. {item.barangay} · {item.roomType} · {item.genderPolicy}
                          </div>
                          <button
                            type="button"
                            onClick={() => onOpenListing(item)}
                            className="text-base font-bold text-[#0F172A] hover:text-[#B45309] text-left truncate block w-full"
                          >
                            {item.title}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleSave(item.id)}
                          className="text-xs text-[#B91C1C] font-medium px-2 py-1 rounded hover:bg-[#FEF2F2] shrink-0"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Highlighted Per-Person True Cost Box */}
                      <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#14532D]">
                            {roommateSplit === 1
                              ? 'True Monthly Total (Solo)'
                              : `Your Share (÷${roommateSplit} Roommates)`}
                          </div>
                          <div className="text-[11px] text-[#15803D]">
                            Base ₱{item.monthlyRentPhp.toLocaleString()} + ₱{elecPhp} elec{' '}
                            {waterPhp === 0 ? '+ Water incl.' : `+ ₱${waterPhp} water`}
                          </div>
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <div className="text-lg font-extrabold text-[#15803D]">
                            ₱{perPerson.toLocaleString()}/mo
                          </div>
                        </div>
                      </div>

                      {/* 2x2 Spec Grid */}
                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                          <div className="text-[11px] text-[#64748B]">Campus Distance</div>
                          <div className="font-mono font-bold text-[#0F172A] mt-0.5">
                            {item.distanceMeters}m ({item.walkMinutes}m walk)
                          </div>
                          <div className="text-[11px] text-[#64748B] truncate">
                            to {campus?.shortName}
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                          <div className="text-[11px] text-[#64748B]">CAPELCO Rate</div>
                          <div className="font-mono font-bold text-[#1D4ED8] mt-0.5">
                            ₱{item.declaredKwhRate.toFixed(2)} / kWh
                          </div>
                          <div className="text-[11px] text-[#64748B] truncate">
                            {item.capelcoStandard ? 'Pass-through' : 'Sub-meter'}
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                          <div className="text-[11px] text-[#64748B]">Flood Profile</div>
                          <div
                            className={`font-bold mt-0.5 ${
                              item.floodRisk === 'Low' ? 'text-[#15803D]' : 'text-[#B45309]'
                            }`}
                          >
                            {item.floodRisk} (+{item.elevationMetersAboveStreet}m)
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                          <div className="text-[11px] text-[#64748B]">BFP Fire Safety</div>
                          <div className="font-mono font-semibold text-[#15803D] mt-0.5 truncate">
                            {item.bfpCertNumber || 'Cleared'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenListing(item)}
                          className="min-h-[42px] py-2 px-3 bg-[#0F172A] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1"
                        >
                          Inspect & Visit
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`tel:${item.landlordPhone.replace(/[^0-9+]/g, '')}`}
                          className="min-h-[42px] py-2 px-3 bg-[#F3F0EA] text-[#0F172A] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call {item.landlordLocalCallName}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP / TABLET SIDE-BY-SIDE COMPARISON TABLE (hidden md:block) */}
              <div className="hidden md:block bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E0D8] bg-[#FAF8F5] text-[11px] font-mono text-[#64748B]">
                        <th className="py-3.5 px-5 w-48">COMPARISON METRIC</th>
                        {savedListings.map((item) => (
                          <th key={item.id} className="py-3.5 px-5 border-l border-[#E5E0D8]">
                            <div className="flex items-start justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenListing(item)}
                                className="text-sm font-sans font-bold text-[#0F172A] hover:text-[#B45309] text-left"
                              >
                                {item.title}
                              </button>
                              <button
                                type="button"
                                onClick={() => onToggleSave(item.id)}
                                className="text-[11px] font-sans text-[#B91C1C] hover:underline shrink-0"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="text-[11px] font-sans font-normal text-[#64748B] mt-0.5">
                              Brgy. {item.barangay} · {item.roomType}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8] text-xs">
                      <tr className="bg-[#F0FDF4]/50">
                        <td className="py-3.5 px-5 font-semibold text-[#0F172A]">
                          True Cost per Person
                          <div className="text-[11px] font-normal text-[#64748B]">
                            {roommateSplit === 1
                              ? 'Solo occupancy'
                              : `Split by ${roommateSplit} roommates`}
                          </div>
                        </td>
                        {savedListings.map((item) => {
                          const elecPhp = Math.round(estimatedMonthlyKwh * item.declaredKwhRate);
                          const waterPhp = item.waterIncluded ? 0 : 135;
                          const totalRoomCost = item.monthlyRentPhp + elecPhp + waterPhp;
                          const perPerson = Math.round(totalRoomCost / roommateSplit);
                          return (
                            <td
                              key={item.id}
                              className="py-3.5 px-5 border-l border-[#E5E0D8] font-mono tabular-nums"
                            >
                              <div className="text-lg font-extrabold text-[#15803D]">
                                ₱{perPerson.toLocaleString()} / mo
                              </div>
                              <div className="text-[11px] text-[#64748B]">
                                Room total: ₱{totalRoomCost.toLocaleString()}/mo
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      <tr>
                        <td className="py-3.5 px-5 font-semibold text-[#0F172A]">
                          Base Monthly Rent
                        </td>
                        {savedListings.map((item) => (
                          <td
                            key={item.id}
                            className="py-3.5 px-5 border-l border-[#E5E0D8] font-mono tabular-nums text-[#0F172A]"
                          >
                            <span className="font-bold">
                              ₱{item.monthlyRentPhp.toLocaleString()}
                            </span>{' '}
                            <span className="font-sans text-[#64748B]">
                              ({item.waterIncluded ? 'MRWD Water incl.' : '+₱135 water'})
                            </span>
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <td className="py-3.5 px-5 font-semibold text-[#0F172A]">
                          Campus Gate Proximity
                        </td>
                        {savedListings.map((item) => {
                          const campus = CAMPUSES.find((c) => c.id === item.nearestCampus);
                          return (
                            <td key={item.id} className="py-3.5 px-5 border-l border-[#E5E0D8]">
                              <span className="font-mono tabular-nums font-bold text-[#0F172A]">
                                {item.distanceMeters}m ({item.walkMinutes} min walk)
                              </span>
                              <div className="text-[#64748B] mt-0.5">
                                to {campus?.shortName} ·{' '}
                                {item.trikeFarePhp === 0
                                  ? '₱0 walk'
                                  : `₱${item.trikeFarePhp} trike`}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      <tr>
                        <td className="py-3.5 px-5 font-semibold text-[#0F172A]">
                          CAPELCO Electricity
                        </td>
                        {savedListings.map((item) => (
                          <td key={item.id} className="py-3.5 px-5 border-l border-[#E5E0D8]">
                            <div
                              className={`font-mono tabular-nums font-bold flex items-center gap-1 ${
                                item.capelcoStandard ? 'text-[#1D4ED8]' : 'text-[#B45309]'
                              }`}
                            >
                              <Zap className="w-3.5 h-3.5" />₱{item.declaredKwhRate.toFixed(2)} / kWh
                            </div>
                            <div className="text-[#64748B] mt-0.5">{item.meteringType}</div>
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <td className="py-3.5 px-5 font-semibold text-[#0F172A]">
                          Monsoon Flood Grade
                        </td>
                        {savedListings.map((item) => (
                          <td key={item.id} className="py-3.5 px-5 border-l border-[#E5E0D8]">
                            <div
                              className={`font-bold flex items-center gap-1 ${
                                item.floodRisk === 'Low' ? 'text-[#15803D]' : 'text-[#B45309]'
                              }`}
                            >
                              <Droplets className="w-3.5 h-3.5" />
                              {item.floodRisk} Risk (+{item.elevationMetersAboveStreet}m grade)
                            </div>
                            <div className="text-[#64748B] mt-0.5 line-clamp-2">
                              {item.floodHistoryNote}
                            </div>
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <td className="py-3.5 px-5 font-semibold text-[#0F172A]">
                          BFP Safety & Curfew
                        </td>
                        {savedListings.map((item) => (
                          <td key={item.id} className="py-3.5 px-5 border-l border-[#E5E0D8]">
                            <div className="font-mono text-[#15803D] font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {item.bfpCertNumber || 'BFP Cleared'}
                            </div>
                            <div className="text-[#64748B] mt-0.5">{item.curfewPolicy}</div>
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-[#FAF8F5]">
                        <td className="py-3.5 px-5 font-semibold text-[#0F172A]">
                          Book Visit / Contact
                        </td>
                        {savedListings.map((item) => (
                          <td key={item.id} className="py-3.5 px-5 border-l border-[#E5E0D8]">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenListing(item)}
                                className="min-h-[38px] px-3 py-1.5 bg-[#0F172A] text-white text-xs font-semibold rounded-lg hover:bg-[#1E293B] flex items-center gap-1 whitespace-nowrap"
                              >
                                Inspect & Book Visit
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`tel:${item.landlordPhone.replace(/[^0-9+]/g, '')}`}
                                className="min-h-[38px] px-3 py-1.5 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-lg hover:bg-[#F3F0EA] flex items-center gap-1 whitespace-nowrap"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Call
                              </a>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* SCHEDULED VISITS & ON-SITE INSPECTION CHECKLIST */
        <div className="mt-5 sm:mt-6 space-y-5">
          {visits.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-3">
              <Calendar className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <div className="text-base font-bold text-[#0F172A]">
                No room viewings scheduled yet
              </div>
              <p className="text-xs text-[#64748B]">
                Open any boarding house and tap "Schedule In-Person Room Viewing" to plan your Saturday or after-class inspection around Roxas City.
              </p>
              <button
                type="button"
                onClick={onNavigateExplore}
                className="min-h-[44px] px-5 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B]"
              >
                Explore Available Rooms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {visits.map((visit) => {
                const matchedListing = listings.find((l) => l.id === visit.listingId);
                const cleanPhone = visit.landlordPhone.replace(/[^0-9+]/g, '');
                const completedChecksCount = Object.values(visit.checklist).filter(Boolean).length;

                return (
                  <div
                    key={visit.id}
                    className="bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E0D8]">
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-mono text-[#64748B] truncate">
                            {visit.visitDate} · {visit.visitTimeSlot}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mt-0.5 truncate">
                            {visit.listingTitle}
                          </h3>
                          <p className="text-xs text-[#64748B] truncate">
                            {visit.streetAddress} · {visit.landlordCallName}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-xs font-semibold ${
                              visit.status === 'Confirmed'
                                ? 'text-[#15803D]'
                                : visit.status === 'Visited & Inspected'
                                ? 'text-[#1D4ED8]'
                                : visit.status === 'Cancelled'
                                ? 'text-[#B91C1C]'
                                : 'text-[#B45309]'
                            }`}
                          >
                            {visit.status}
                          </span>
                          <div className="text-xs font-mono tabular-nums font-bold text-[#0F172A] mt-0.5">
                            ₱{visit.monthlyRentPhp.toLocaleString()}/mo
                          </div>
                        </div>
                      </div>

                      {/* 4-Point Physical Boarding House Inspection Checklist */}
                      <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3.5 sm:p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0F172A]">
                            On-Site Inspection Checklist
                          </span>
                          <span className="text-xs font-mono tabular-nums text-[#15803D]">
                            {completedChecksCount}/4 verified
                          </span>
                        </div>

                        {(
                          [
                            {
                              key: 'checkedSubMeter',
                              label: 'Inspect physical CAPELCO sub-meter & initial kWh reading',
                            },
                            {
                              key: 'testedMorningWater',
                              label: 'Turn on faucet & shower to verify MRWD / tank pressure',
                            },
                            {
                              key: 'verifiedFireExit',
                              label: 'Walk the BFP fire exit stairwell & check gate lock key',
                            },
                            {
                              key: 'checkedCellSignal',
                              label: 'Test Smart/Globe 5G & Wi-Fi speed inside the actual room',
                            },
                          ] as const
                        ).map((check) => {
                          const isChecked = visit.checklist[check.key];
                          return (
                            <button
                              key={check.key}
                              type="button"
                              onClick={() => onToggleChecklistItem(visit.id, check.key)}
                              className="w-full min-h-[38px] text-left flex items-start sm:items-center gap-2.5 text-xs py-1 text-[#0F172A] hover:text-[#B45309] transition-colors"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5 sm:mt-0" />
                              ) : (
                                <Square className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5 sm:mt-0" />
                              )}
                              <span className={isChecked ? 'line-through text-[#64748B]' : ''}>
                                {check.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Personal Inspection Notes */}
                      <div>
                        <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                          Your Field Notes & Questions for {visit.landlordCallName}
                        </label>
                        <textarea
                          rows={2}
                          value={visit.inspectionNotes}
                          onChange={(e) => onUpdateVisitNotes(visit.id, e.target.value)}
                          placeholder="Write down room number, deposit terms, or curfew notes..."
                          className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0F172A]"
                        />
                      </div>
                    </div>

                    {/* Responsive Action Footer */}
                    <div className="pt-3 border-t border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="grid grid-cols-2 sm:flex items-center gap-2">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="min-h-[40px] px-3 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call {visit.landlordCallName}
                        </a>
                        <a
                          href={`sms:${cleanPhone}?body=${encodeURIComponent(
                            `Maayong adlaw ${visit.landlordCallName}! Confirming my room viewing at ${visit.listingTitle} on ${visit.visitDate} (${visit.visitTimeSlot}). — ${visit.studentName}`
                          )}`}
                          className="min-h-[40px] px-3 py-2 bg-[#FEF3C7] border border-[#FDE68A] text-[#78350F] text-xs font-semibold rounded-xl hover:bg-[#FDE68A] flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          SMS Reminder
                        </a>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        {visit.status !== 'Visited & Inspected' && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateVisitStatus(visit.id, 'Visited & Inspected')
                            }
                            className="flex-1 sm:flex-initial min-h-[40px] px-3 py-2 bg-[#F0FDF4] border border-[#86EFAC] text-[#15803D] text-xs font-semibold rounded-xl hover:bg-[#DCFCE7] flex items-center justify-center gap-1 whitespace-nowrap"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Visited
                          </button>
                        )}
                        {matchedListing && (
                          <button
                            type="button"
                            onClick={() => onOpenListing(matchedListing)}
                            className="flex-1 sm:flex-initial min-h-[40px] px-3 py-2 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-xl hover:bg-[#F3F0EA]"
                          >
                            Room Details
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label="Delete visit"
                          onClick={() => onDeleteVisit(visit.id)}
                          className="min-h-[40px] px-2.5 py-2 text-[#B91C1C] hover:bg-[#FEF2F2] rounded-xl transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
