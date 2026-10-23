import React, { useState, useEffect } from 'react';
import {
  BoardingHouseListing,
  CAPELCO_BASELINE_RATE_PHP,
  STUDENT_APPLIANCES,
  ApplianceItem,
} from '../data/roxasHousingData';
import { Zap, Calculator, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CapelcoCalculatorViewProps {
  listings: BoardingHouseListing[];
  onOpenListing: (listing: BoardingHouseListing) => void;
  onUpdateMonthlyKwh?: (kwh: number) => void;
}

interface ApplianceState extends ApplianceItem {
  enabled: boolean;
  hoursPerDay: number;
}

export const CapelcoCalculatorView: React.FC<CapelcoCalculatorViewProps> = ({
  listings,
  onOpenListing,
  onUpdateMonthlyKwh,
}) => {
  const [appliances, setAppliances] = useState<ApplianceState[]>(() =>
    STUDENT_APPLIANCES.map((a) => ({
      ...a,
      enabled: a.defaultEnabled,
      hoursPerDay: a.defaultHoursPerDay,
    }))
  );

  const [comparisonMarkupRate, setComparisonMarkupRate] = useState<number>(20.0);

  const toggleAppliance = (id: string) => {
    setAppliances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const updateHours = (id: string, hours: number) => {
    setAppliances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hoursPerDay: hours } : item))
    );
  };

  const totalMonthlyKwh = appliances.reduce((acc, item) => {
    if (!item.enabled) return acc;
    return acc + (item.watts * item.hoursPerDay * 30) / 1000;
  }, 0);

  useEffect(() => {
    if (onUpdateMonthlyKwh) {
      onUpdateMonthlyKwh(Math.max(1, Math.round(totalMonthlyKwh)));
    }
  }, [totalMonthlyKwh, onUpdateMonthlyKwh]);

  const capelcoMonthlyBill = totalMonthlyKwh * CAPELCO_BASELINE_RATE_PHP;
  const markupMonthlyBill = totalMonthlyKwh * comparisonMarkupRate;
  const monthlyOverchargeSavings = Math.max(0, markupMonthlyBill - capelcoMonthlyBill);
  const semesterSavings = monthlyOverchargeSavings * 5;

  const sortedByTrueCost = [...listings]
    .map((listing) => {
      const elecPhp = Math.round(totalMonthlyKwh * listing.declaredKwhRate);
      const waterPhp = listing.waterIncluded ? 0 : 135;
      const trueTotal = listing.monthlyRentPhp + elecPhp + waterPhp;
      return { listing, elecPhp, waterPhp, trueTotal };
    })
    .sort((a, b) => a.trueTotal - b.trueTotal);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 lg:pb-12">
      {/* Header */}
      <div className="pb-5 sm:pb-6 border-b border-[#E5E0D8] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#1D4ED8] tracking-tight">
            Utility Rate Transparency · Local Grid Baseline ₱{CAPELCO_BASELINE_RATE_PHP.toFixed(2)}/kWh (CAPELCO)
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] mt-1">
            True Monthly Cost & Appliance Planner
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-2xl">
            Select the appliances you plan to use in your room. Your estimated usage ({totalMonthlyKwh.toFixed(1)} kWh/mo) updates the total monthly cost across every listing on Tahan.
          </p>
        </div>

        <div className="w-full md:w-auto bg-white border border-[#E5E0D8] rounded-2xl px-4 py-3 flex md:block items-center justify-between md:text-right shrink-0">
          <div>
            <div className="text-xs text-[#64748B]">Semester Savings (5 mos)</div>
            <div className="text-[11px] text-[#64748B] md:hidden">
              vs ₱{comparisonMarkupRate.toFixed(0)}/kWh sub-meter
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-[#15803D]">
              ₱{Math.round(semesterSavings).toLocaleString()} saved
            </div>
            <div className="hidden md:block text-xs text-[#64748B]">
              at grid rate vs ₱{comparisonMarkupRate.toFixed(0)}/kWh sub-meter
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-6 sm:mt-8">
        {/* Left 6 Cols: Appliance Load Configurator */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#0F172A] shrink-0" />
              <span>Appliance Load Estimator</span>
            </h2>
            <span className="text-xs font-mono tabular-nums font-semibold text-[#0F172A] bg-[#F3F0EA] px-2.5 py-1 rounded-lg shrink-0">
              {totalMonthlyKwh.toFixed(1)} kWh / month
            </span>
          </div>

          <div className="bg-white border border-[#E5E0D8] rounded-2xl divide-y divide-[#E5E0D8]">
            {appliances.map((item) => {
              const itemMonthlyKwh = ((item.watts * item.hoursPerDay * 30) / 1000).toFixed(1);
              const itemMonthlyPhp = (
                ((item.watts * item.hoursPerDay * 30) / 1000) *
                CAPELCO_BASELINE_RATE_PHP
              ).toFixed(0);

              return (
                <div key={item.id} className="p-3.5 sm:p-4 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer select-none min-h-[40px] min-w-0">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={() => toggleAppliance(item.id)}
                        className="mt-1 w-4 h-4 accent-[#0F172A] rounded cursor-pointer shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                          {item.name}{' '}
                          <span className="font-mono text-xs font-normal text-[#64748B]">
                            ({item.watts}W)
                          </span>
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#64748B]">
                          {item.localExample}
                        </div>
                      </div>
                    </label>

                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-bold font-mono tabular-nums text-[#0F172A]">
                        {item.enabled ? `₱${itemMonthlyPhp}/mo` : '₱0/mo'}
                      </div>
                      <div className="text-[11px] font-mono tabular-nums text-[#64748B]">
                        {item.enabled ? `${itemMonthlyKwh} kWh` : 'Not used'}
                      </div>
                    </div>
                  </div>

                  {item.enabled && (
                    <div className="mt-2.5 pl-6 sm:pl-7 flex items-center gap-3">
                      <input
                        type="range"
                        min="0.25"
                        max="16"
                        step="0.25"
                        value={item.hoursPerDay}
                        onChange={(e) => updateHours(item.id, parseFloat(e.target.value))}
                        className="flex-1 accent-[#0F172A] cursor-pointer"
                      />
                      <span className="text-xs font-mono tabular-nums text-[#0F172A] w-20 text-right shrink-0">
                        {item.hoursPerDay}h / day
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Unverified Sub-meter Comparison Control */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-[#0F172A]">
                Compare Against Marked-Up Sub-Meter Rate
              </span>
              <span className="text-xs font-mono tabular-nums font-bold text-[#B45309] shrink-0">
                ₱{comparisonMarkupRate.toFixed(2)} / kWh
              </span>
            </div>
            <input
              type="range"
              min="13"
              max="25"
              step="0.5"
              value={comparisonMarkupRate}
              onChange={(e) => setComparisonMarkupRate(parseFloat(e.target.value))}
              className="w-full accent-[#B45309] cursor-pointer"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 pt-4 border-t border-[#E5E0D8]">
              <div className="p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                <div className="text-[11px] text-[#14532D] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                  Standard Grid Rate (₱{CAPELCO_BASELINE_RATE_PHP}/kWh)
                </div>
                <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-[#0F172A] mt-0.5">
                  ₱{Math.round(capelcoMonthlyBill).toLocaleString()} / mo
                </div>
              </div>
              <div className="p-3 bg-[#FFFBEB] rounded-xl border border-[#FDE68A]">
                <div className="text-[11px] text-[#78350F] flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                  Marked-Up Sub-Meter (₱{comparisonMarkupRate.toFixed(2)}/kWh)
                </div>
                <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-[#B45309] mt-0.5">
                  ₱{Math.round(markupMonthlyBill).toLocaleString()} / mo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: True Monthly Cost Ledger Across All Listings */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D97706] shrink-0" />
              <span>True Monthly Cost by Property</span>
            </h2>
            <span className="text-xs text-[#64748B] hidden sm:inline">
              Base Rent + Water + Electricity
            </span>
          </div>

          {/* MOBILE COST CARDS (< 640px, sm:hidden) */}
          <div className="sm:hidden space-y-3">
            {sortedByTrueCost.map(({ listing, elecPhp, waterPhp, trueTotal }) => (
              <div
                key={listing.id}
                className="bg-white border border-[#E5E0D8] rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#0F172A] truncate">
                      {listing.title}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Brgy. {listing.barangay} · {listing.roomType} ·{' '}
                      <span
                        className={
                          listing.capelcoStandard
                            ? 'text-[#15803D] font-mono'
                            : 'text-[#B45309] font-mono'
                        }
                      >
                        ₱{listing.declaredKwhRate.toFixed(2)}/kWh
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenListing(listing)}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#0F172A] text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    Details
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#E5E0D8] text-xs font-mono tabular-nums">
                  <div>
                    <div className="text-[10px] font-sans text-[#64748B]">Base Rent</div>
                    <div className="font-semibold text-[#0F172A]">
                      ₱{listing.monthlyRentPhp.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-sans text-[#64748B]">Elec + Water</div>
                    <div className="text-[#475569]">+₱{(elecPhp + waterPhp).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-sans text-[#64748B]">True Total</div>
                    <div className="font-extrabold text-[#15803D]">
                      ₱{trueTotal.toLocaleString()}/mo
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TABLET & DESKTOP TABLE (hidden sm:block) */}
          <div className="hidden sm:block bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E0D8] bg-[#FAF8F5] text-[11px] font-semibold text-[#64748B]">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-3 text-right">Base Rent</th>
                    <th className="py-3 px-3 text-right">Est. Utilities</th>
                    <th className="py-3 px-4 text-right">True Monthly Total</th>
                    <th className="py-3 px-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8] text-xs">
                  {sortedByTrueCost.map(({ listing, elecPhp, waterPhp, trueTotal }) => (
                    <tr key={listing.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0F172A]">{listing.title}</div>
                        <div className="text-[11px] text-[#64748B]">
                          Brgy. {listing.barangay} · {listing.roomType} ·{' '}
                          <span
                            className={
                              listing.capelcoStandard
                                ? 'text-[#15803D] font-mono'
                                : 'text-[#B45309] font-mono'
                            }
                          >
                            ₱{listing.declaredKwhRate.toFixed(2)}/kWh
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#0F172A]">
                        ₱{listing.monthlyRentPhp.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#475569]">
                        +₱{(elecPhp + waterPhp).toLocaleString()}
                        <div className="text-[10px] font-sans text-[#64748B]">
                          {waterPhp === 0 ? 'Water incl.' : '+₱135 water'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-sm text-[#15803D]">
                        ₱{trueTotal.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenListing(listing)}
                          className="min-h-[36px] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F3F0EA] hover:bg-[#0F172A] hover:text-white text-[#0F172A] font-medium transition-colors whitespace-nowrap"
                        >
                          View
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
