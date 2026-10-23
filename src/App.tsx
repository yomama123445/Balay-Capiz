/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  BoardingHouseListing,
  CAMPUSES,
  CampusId,
  CAPELCO_BASELINE_RATE_PHP,
  INITIAL_LISTINGS,
  RoomType,
  TenantReview,
} from './data/roxasHousingData';
import {
  INITIAL_SCHEDULED_VISITS,
  InspectionChecklist,
  ScheduledVisit,
} from './types/appTypes';
import { PropertyIllustration } from './components/PropertyIllustration';
import { ListingDetailModal } from './components/ListingDetailModal';
import { RoxasMapView } from './components/RoxasMapView';
import { CapelcoCalculatorView } from './components/CapelcoCalculatorView';
import { LandlordPortalView } from './components/LandlordPortalView';
import { VisitsAndCompareView } from './components/VisitsAndCompareView';
import { InstallAndDataModal } from './components/InstallAndDataModal';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWAInstall';
import {
  fetchCloudDataset,
  pushSingleListingToCloud,
  pushSingleReviewToCloud,
  pushSingleVisitToCloud,
  removeVisitFromCloud,
} from './services/housingService';
import {
  locateStudentPosition,
  UserLocationResult,
} from './utils/nativeBridge';
import {
  Search,
  SlidersHorizontal,
  Heart,
  Phone,
  MessageSquare,
  RotateCcw,
  MapPin,
  Compass,
  Calculator,
  Building2,
  CalendarCheck,
  Download,
  WifiOff,
  LocateFixed,
} from 'lucide-react';

type ActiveTab = 'explore' | 'map' | 'visits' | 'calculator' | 'landlord';

const STORAGE_SAVED_KEY = 'balaycapiz_saved_room_ids_v1';
const STORAGE_LISTINGS_KEY = 'balaycapiz_listings_v2';
const STORAGE_VISITS_KEY = 'balaycapiz_visits_v1';
const STORAGE_KWH_KEY = 'balaycapiz_monthly_kwh_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  const { isInstallable, isInstalled, isIOS, isInIframe, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Persistent Listings State
  const [listings, setListings] = useState<BoardingHouseListing[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_LISTINGS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  // Persistent Saved Shortlist State
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_KEY);
      return raw ? JSON.parse(raw) : ['lawaan-student-haven', 'casa-verde-lawaan'];
    } catch {
      return ['lawaan-student-haven', 'casa-verde-lawaan'];
    }
  });

  // Persistent Scheduled Visits & Inspection Checklists
  const [visits, setVisits] = useState<ScheduledVisit[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_VISITS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_SCHEDULED_VISITS;
    } catch {
      return INITIAL_SCHEDULED_VISITS;
    }
  });

  // Persistent Student Monthly kWh Appliance Load
  const [estimatedMonthlyKwh, setEstimatedMonthlyKwh] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KWH_KEY);
      return raw ? Number(raw) : 26;
    } catch {
      return 26;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LISTINGS_KEY, JSON.stringify(listings));
    } catch {
      // Ignore sandbox quota issues
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedIds));
    } catch {
      // Ignore sandbox quota issues
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VISITS_KEY, JSON.stringify(visits));
    } catch {
      // Ignore sandbox quota issues
    }
  }, [visits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KWH_KEY, String(estimatedMonthlyKwh));
    } catch {
      // Ignore sandbox quota issues
    }
  }, [estimatedMonthlyKwh]);

  // Student Filter State
  const [selectedCampus, setSelectedCampus] = useState<CampusId>('all');
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | RoomType | 'Women Only' | 'Wi-Fi Included'
  >('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxBudgetPhp, setMaxBudgetPhp] = useState<number>(4000);
  const [maxDistanceMeters, setMaxDistanceMeters] = useState<number>(1000);
  const [capelcoOnly, setCapelcoOnly] = useState<boolean>(false);
  const [bfpOnly, setBfpOnly] = useState<boolean>(true);
  const [lowFloodOnly, setLowFloodOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'distance' | 'true-cost' | 'price-asc' | 'rating'>(
    'distance'
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const toggleSaveRoom = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAllFilters = () => {
    setSelectedCampus('all');
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxBudgetPhp(4000);
    setMaxDistanceMeters(1000);
    setCapelcoOnly(false);
    setBfpOnly(false);
    setLowFloodOnly(false);
    setSortBy('distance');
  };

  // Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        if (selectedCampus !== 'all' && item.nearestCampus !== selectedCampus) {
          return false;
        }
        if (selectedCategory === 'Women Only' && item.genderPolicy !== 'Women Only') {
          return false;
        }
        if (selectedCategory === 'Wi-Fi Included' && !item.wifiIncluded) {
          return false;
        }
        if (
          selectedCategory !== 'All' &&
          selectedCategory !== 'Women Only' &&
          selectedCategory !== 'Wi-Fi Included' &&
          item.roomType !== selectedCategory
        ) {
          return false;
        }
        if (item.monthlyRentPhp > maxBudgetPhp) {
          return false;
        }
        if (item.distanceMeters > maxDistanceMeters) {
          return false;
        }
        if (capelcoOnly && !item.capelcoStandard) {
          return false;
        }
        if (bfpOnly && !item.bfpVerified) {
          return false;
        }
        if (lowFloodOnly && item.floodRisk !== 'Low') {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchBrgy = item.barangay.toLowerCase().includes(q);
          const matchStreet = item.streetAddress.toLowerCase().includes(q);
          const matchLandlord =
            item.landlordName.toLowerCase().includes(q) ||
            item.landlordLocalCallName.toLowerCase().includes(q);
          if (!matchTitle && !matchBrgy && !matchStreet && !matchLandlord) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distanceMeters - b.distanceMeters;
        if (sortBy === 'price-asc') return a.monthlyRentPhp - b.monthlyRentPhp;
        if (sortBy === 'true-cost') {
          const trueA =
            a.monthlyRentPhp +
            Math.round(estimatedMonthlyKwh * a.declaredKwhRate) +
            (a.waterIncluded ? 0 : 135);
          const trueB =
            b.monthlyRentPhp +
            Math.round(estimatedMonthlyKwh * b.declaredKwhRate) +
            (b.waterIncluded ? 0 : 135);
          return trueA - trueB;
        }
        const avgA =
          a.reviews.length > 0
            ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length
            : 4.5;
        const avgB =
          b.reviews.length > 0
            ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length
            : 4.5;
        return avgB - avgA;
      });
  }, [
    listings,
    selectedCampus,
    selectedCategory,
    searchQuery,
    maxBudgetPhp,
    maxDistanceMeters,
    capelcoOnly,
    bfpOnly,
    lowFloodOnly,
    sortBy,
    estimatedMonthlyKwh,
  ]);

  // Native GPS Location State & Handler
  const [userGps, setUserGps] = useState<UserLocationResult | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);

  // Hydrate from Supabase Cloud if configured
  useEffect(() => {
    let active = true;
    fetchCloudDataset().then((res) => {
      if (!active) return;
      if (res.listings && res.listings.length > 0) {
        setListings(res.listings);
      }
      if (res.visits && res.visits.length > 0) {
        setVisits(res.visits);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleNearMeClick = async () => {
    setIsLocatingGps(true);
    const res = await locateStudentPosition();
    setIsLocatingGps(false);
    if (res.location) {
      setUserGps(res.location);
      setSelectedCampus(res.location.nearestCampusId);
      setSortBy('distance');
    }
  };

  // State Mutation Handlers (Local-First + Background Cloud Sync)
  const handleAddReview = (listingId: string, review: TenantReview) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        const updatedReviews = [review, ...item.reviews];
        const avgKwh =
          updatedReviews.reduce((sum, r) => sum + r.reportedKwhRate, 0) /
          updatedReviews.length;
        const newCrowdsourced = Number(avgKwh.toFixed(2));
        pushSingleReviewToCloud(listingId, review, newCrowdsourced);
        return {
          ...item,
          crowdsourcedKwhRate: newCrowdsourced,
          reviews: updatedReviews,
        };
      })
    );
  };

  const handleScheduleVisit = (newVisit: ScheduledVisit) => {
    setVisits((prev) => [newVisit, ...prev]);
    pushSingleVisitToCloud(newVisit);
  };

  const handleUpdateVisitStatus = (visitId: string, status: ScheduledVisit['status']) => {
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id !== visitId) return v;
        const updated = { ...v, status };
        pushSingleVisitToCloud(updated);
        return updated;
      })
    );
  };

  const handleToggleChecklistItem = (
    visitId: string,
    key: keyof InspectionChecklist
  ) => {
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id !== visitId) return v;
        const updated = {
          ...v,
          checklist: {
            ...v.checklist,
            [key]: !v.checklist[key],
          },
        };
        pushSingleVisitToCloud(updated);
        return updated;
      })
    );
  };

  const handleUpdateVisitNotes = (visitId: string, inspectionNotes: string) => {
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id !== visitId) return v;
        const updated = { ...v, inspectionNotes };
        pushSingleVisitToCloud(updated);
        return updated;
      })
    );
  };

  const handleDeleteVisit = (visitId: string) => {
    setVisits((prev) => prev.filter((v) => v.id !== visitId));
    removeVisitFromCloud(visitId);
  };

  const handleRenewListing = (listingId: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        const updated = {
          ...item,
          daysUntilExpiry: 30,
          lastUpdatedDate: 'October 23, 2026',
        };
        pushSingleListingToCloud(updated);
        return updated;
      })
    );
  };

  const handleUpdateSlots = (listingId: string, delta: number) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        const updated = {
          ...item,
          availableSlots: Math.max(
            0,
            Math.min(item.totalSlots, item.availableSlots + delta)
          ),
        };
        pushSingleListingToCloud(updated);
        return updated;
      })
    );
  };

  const handleAddNewListing = (newListing: BoardingHouseListing) => {
    setListings((prev) => [newListing, ...prev]);
    pushSingleListingToCloud(newListing);
  };

  const handleReplyToReview = (
    listingId: string,
    reviewId: string,
    replyMessage: string
  ) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        return {
          ...item,
          reviews: item.reviews.map((r) => {
            if (r.id !== reviewId) return r;
            const updatedReview: TenantReview = {
              ...r,
              landlordReply: {
                respondedAt: 'October 23, 2026',
                message: replyMessage,
              },
            };
            pushSingleReviewToCloud(listingId, updatedReview, item.crowdsourcedKwhRate);
            return updatedReview;
          }),
        };
      })
    );
  };

  const handlePrimaryInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const selectedListing = useMemo(
    () => listings.find((l) => l.id === selectedListingId) || null,
    [listings, selectedListingId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0F172A] overflow-x-hidden">
      {/* =====================================================================
          STRICT 3-ZONE TOP BAR CONTRACT
          [Zone 1: 1-line Brand Wordmark] — [Zone 2: 5 Single-Line Nav Links] — [Zone 3: 1 Primary Action]
      ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5E0D8]">
        <div className="max-w-[1360px] mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 lg:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => {
              setSelectedListingId(null);
              setActiveTab('explore');
            }}
            className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 text-left"
          >
            BalayCapiz
          </button>

          {/* Zone 2: 5 concise single-line text navigation links (Desktop lg+) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#475569]">
            <button
              type="button"
              onClick={() => {
                setSelectedListingId(null);
                setActiveTab('explore');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'explore' && !selectedListingId
                  ? 'border-[#0F172A] text-[#0F172A] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedListingId(null);
                setActiveTab('map');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'map' && !selectedListingId
                  ? 'border-[#0F172A] text-[#0F172A] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Map Radar
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedListingId(null);
                setActiveTab('visits');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'visits' && !selectedListingId
                  ? 'border-[#0F172A] text-[#0F172A] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Saved & Visits ({savedIds.length + visits.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedListingId(null);
                setActiveTab('calculator');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'calculator' && !selectedListingId
                  ? 'border-[#0F172A] text-[#0F172A] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Bill Planner
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedListingId(null);
                setActiveTab('landlord');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'landlord' && !selectedListingId
                  ? 'border-[#0F172A] text-[#0F172A] font-semibold'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Landlord Studio
            </button>
          </nav>

          {/* Zone 3: 1 primary action button (PWA Install & Field Data) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePrimaryInstallClick}
              className="min-h-[40px] px-3 sm:px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#0F172A] rounded-xl hover:bg-[#1E293B] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#F5C842] shrink-0" />
              <span>{isInstalled ? 'App & Data' : 'Install App'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Non-intrusive Offline Mode Banner */}
      {!isOnline && (
        <div className="bg-[#FFFBEB] border-b border-[#FCD34D] px-4 py-2 text-center text-xs font-medium text-[#78350F] flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>
            Offline Mode — Using cached Roxas City boarding houses, saved shortlist, and map tiles.
          </span>
        </div>
      )}

      {/* =====================================================================
          MAIN APPLICATION WORKSPACE
      ===================================================================== */}
      <main className="flex-1 min-w-0">
        {selectedListing ? (
          <ListingDetailModal
            listing={selectedListing}
            onClose={() => setSelectedListingId(null)}
            isSaved={savedIds.includes(selectedListing.id)}
            onToggleSave={toggleSaveRoom}
            onAddReview={handleAddReview}
            onScheduleVisit={handleScheduleVisit}
            onJumpToMap={(campusId) => {
              setSelectedListingId(null);
              setSelectedCampus(campusId);
              setActiveTab('map');
            }}
            estimatedMonthlyKwh={estimatedMonthlyKwh}
          />
        ) : activeTab === 'map' ? (
          <RoxasMapView
            listings={filteredListings.length > 0 ? filteredListings : listings}
            selectedCampus={selectedCampus}
            onSelectCampus={setSelectedCampus}
            onOpenListing={(listing) => setSelectedListingId(listing.id)}
            savedIds={savedIds}
            onToggleSave={toggleSaveRoom}
          />
        ) : activeTab === 'visits' ? (
          <VisitsAndCompareView
            listings={listings}
            savedIds={savedIds}
            onToggleSave={toggleSaveRoom}
            visits={visits}
            onUpdateVisitStatus={handleUpdateVisitStatus}
            onToggleChecklistItem={handleToggleChecklistItem}
            onUpdateVisitNotes={handleUpdateVisitNotes}
            onDeleteVisit={handleDeleteVisit}
            onOpenListing={(listing) => setSelectedListingId(listing.id)}
            onNavigateExplore={() => setActiveTab('explore')}
            estimatedMonthlyKwh={estimatedMonthlyKwh}
          />
        ) : activeTab === 'calculator' ? (
          <CapelcoCalculatorView
            listings={listings}
            onOpenListing={(listing) => setSelectedListingId(listing.id)}
            onUpdateMonthlyKwh={setEstimatedMonthlyKwh}
          />
        ) : activeTab === 'landlord' ? (
          <LandlordPortalView
            listings={listings}
            visits={visits}
            onUpdateVisitStatus={handleUpdateVisitStatus}
            onRenewListing={handleRenewListing}
            onUpdateSlots={handleUpdateSlots}
            onAddListing={handleAddNewListing}
            onReplyToReview={handleReplyToReview}
            onOpenListing={(listing) => setSelectedListingId(listing.id)}
          />
        ) : (
          /* ===================================================================
             DISCOVER WORKSPACE (App Command Bar + Live Filtered Room Feed)
          =================================================================== */
          <div className="pb-24 lg:pb-12">
            {/* Compact App Command Surface */}
            <section className="bg-[#0F172A] text-[#FAF8F5] border-b border-[#1E293B]">
              <div className="max-w-[1360px] mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-4 sm:space-y-5">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-3.5 min-w-0">
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-mono text-[#F5C842] tracking-wide">
                      ROXAS CITY, CAPIZ · CAPELCO BASELINE ₱{CAPELCO_BASELINE_RATE_PHP}/kWh · ₱0 BROKER FEE
                    </p>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mt-1">
                      Where are you studying in Roxas City?
                    </h1>
                  </div>

                  {/* Campus Gate Selector + Native GPS Proximity Trigger */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 xl:pb-0 min-w-0 max-w-full">
                    <button
                      type="button"
                      onClick={handleNearMeClick}
                      disabled={isLocatingGps}
                      title="Detect nearest Roxas City campus via GPS"
                      className="min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold bg-[#1E293B] text-[#F5C842] border border-[#334155] hover:bg-[#334155] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <LocateFixed className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
                      <span>
                        {userGps
                          ? `GPS: ${userGps.nearestCampusDistanceMeters}m`
                          : isLocatingGps
                          ? 'Locating...'
                          : 'Near Me'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCampus('all')}
                      className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        selectedCampus === 'all'
                          ? 'bg-[#F5C842] text-[#0F172A]'
                          : 'bg-[#1E293B] text-[#CBD5E1] hover:bg-[#334155]'
                      }`}
                    >
                      All Campuses ({listings.length})
                    </button>
                    {CAMPUSES.map((campus) => {
                      const count = listings.filter(
                        (l) => l.nearestCampus === campus.id
                      ).length;
                      return (
                        <button
                          key={campus.id}
                          type="button"
                          onClick={() => setSelectedCampus(campus.id)}
                          className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            selectedCampus === campus.id
                              ? 'bg-[#F5C842] text-[#0F172A]'
                              : 'bg-[#1E293B] text-[#CBD5E1] hover:bg-[#334155]'
                          }`}
                        >
                          {campus.shortName} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search Pill + Budget Ceiling + Filter Sheet Trigger */}
                <div className="bg-white text-[#0F172A] p-2 sm:p-2.5 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-6 lg:col-span-6 px-3 py-1.5 border-b md:border-b-0 md:border-r border-[#E5E0D8] min-w-0">
                    <label className="block text-[10px] font-mono text-[#64748B] uppercase truncate">
                      Search Barangay, Street or Landlord
                    </label>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Search className="w-4 h-4 text-[#64748B] shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Lawaan, Fuentes Drive, Banica, Nanay Elena..."
                        className="w-full min-w-0 text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4 lg:col-span-4 px-3 py-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-[#64748B]">
                      <span className="truncate">MAX BASE RENT</span>
                      <span className="font-bold text-[#0F172A] tabular-nums shrink-0">
                        ≤ ₱{maxBudgetPhp.toLocaleString()}/mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1300}
                      max={4000}
                      step={100}
                      value={maxBudgetPhp}
                      onChange={(e) => setMaxBudgetPhp(Number(e.target.value))}
                      className="w-full mt-1 accent-[#0F172A] cursor-pointer"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedFilters((prev) => !prev)}
                      className="w-full min-h-[44px] py-2.5 px-3 bg-[#0F172A] text-[#FAF8F5] text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                      <span>Filters</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Category & Safety Filter Bar */}
            <section className="bg-white border-b border-[#E5E0D8]">
              <div className="max-w-[1360px] mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 space-y-3">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 min-w-0">
                  {/* Room Category Segmented Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 xl:pb-0 min-w-0 max-w-full">
                    {(
                      [
                        'All',
                        'Bedspace',
                        'Single Room',
                        'Shared Room',
                        'Studio w/ CR',
                        'Women Only',
                        'Wi-Fi Included',
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          selectedCategory === cat
                            ? 'bg-[#0F172A] text-[#FAF8F5]'
                            : 'bg-[#F3F0EA] text-[#475569] hover:text-[#0F172A]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Quick Compliance Toggles & Sort */}
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => setCapelcoOnly((prev) => !prev)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        capelcoOnly
                          ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8] font-semibold'
                          : 'bg-white border-[#E5E0D8] text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      {capelcoOnly ? '✓ CAPELCO Standard' : 'CAPELCO Standard'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setBfpOnly((prev) => !prev)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        bfpOnly
                          ? 'bg-[#F0FDF4] border-[#15803D] text-[#15803D] font-semibold'
                          : 'bg-white border-[#E5E0D8] text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      {bfpOnly ? '✓ BFP Cleared' : 'BFP Cleared'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLowFloodOnly((prev) => !prev)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        lowFloodOnly
                          ? 'bg-[#F0FDF4] border-[#15803D] text-[#15803D] font-semibold'
                          : 'bg-white border-[#E5E0D8] text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      {lowFloodOnly ? '✓ Low Flood Risk' : 'Low Flood Risk'}
                    </button>

                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as 'distance' | 'true-cost' | 'price-asc' | 'rating'
                        )
                      }
                      aria-label="Sort listings by"
                      className="w-full sm:w-auto min-h-[38px] px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-semibold text-[#0F172A] focus:outline-none"
                    >
                      <option value="distance">Sort: Nearest to Gate</option>
                      <option value="true-cost">
                        Sort: Lowest True Cost ({estimatedMonthlyKwh} kWh)
                      </option>
                      <option value="price-asc">Sort: Lowest Base Rent</option>
                      <option value="rating">Sort: Highest Rating</option>
                    </select>
                  </div>
                </div>

                {/* Expandable Filter Sheet */}
                {showAdvancedFilters && (
                  <div className="pt-3.5 border-t border-[#E5E0D8] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end bg-[#FAF8F5] p-4 rounded-2xl">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Max Walking Distance to Gate
                      </label>
                      <select
                        value={maxDistanceMeters}
                        onChange={(e) => setMaxDistanceMeters(Number(e.target.value))}
                        className="w-full min-h-[40px] px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium"
                      >
                        <option value={250}>≤ 250 meters (3 min walk)</option>
                        <option value={400}>≤ 400 meters (5 min walk)</option>
                        <option value={500}>≤ 500 meters (6 min walk)</option>
                        <option value={1000}>≤ 1.0 km (All walkable)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Your Monthly Appliance Load: {estimatedMonthlyKwh} kWh
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={120}
                        step={2}
                        value={estimatedMonthlyKwh}
                        onChange={(e) => setEstimatedMonthlyKwh(Number(e.target.value))}
                        className="w-full accent-[#0F172A]"
                      />
                    </div>

                    <div className="text-xs text-[#475569]">
                      Showing <strong className="font-mono">{filteredListings.length}</strong> of{' '}
                      <strong className="font-mono">{listings.length}</strong> properties.
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="min-h-[40px] px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(false)}
                        className="min-h-[40px] px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl"
                      >
                        Done ({filteredListings.length})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ROOM FEED GRID */}
            <section className="max-w-[1360px] mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="text-xs text-[#64748B] leading-relaxed">
                  Showing <strong className="text-[#0F172A]">{filteredListings.length}</strong> verified student rooms · True Monthly Total includes your{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('calculator')}
                    className="font-mono font-semibold text-[#1D4ED8] hover:underline"
                  >
                    {estimatedMonthlyKwh} kWh appliance profile
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInstallModalOpen(true)}
                    className="flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 bg-white border border-[#E5E0D8] rounded-xl text-xs font-semibold text-[#0F172A] hover:bg-[#F3F0EA] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                    <span>Export / Import JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('map')}
                    className="flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 bg-white border border-[#E5E0D8] rounded-xl text-xs font-semibold text-[#0F172A] hover:bg-[#F3F0EA] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                    <span>Open Map Radar</span>
                  </button>
                </div>
              </div>

              {filteredListings.length === 0 ? (
                <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-6 space-y-3">
                  <div className="text-base font-bold text-[#0F172A]">
                    No boarding houses match all active filters
                  </div>
                  <p className="text-xs text-[#64748B]">
                    Try expanding your rent ceiling or resetting compliance filters to see all rooms in Roxas City.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="min-h-[44px] px-5 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors"
                  >
                    Reset All Filters ({listings.length} Rooms)
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredListings.map((listing) => {
                    const campus = CAMPUSES.find((c) => c.id === listing.nearestCampus);
                    const isSaved = savedIds.includes(listing.id);
                    const hasScheduledVisit = visits.some(
                      (v) => v.listingId === listing.id && v.status !== 'Cancelled'
                    );
                    const avgRating =
                      listing.reviews.length > 0
                        ? (
                            listing.reviews.reduce((s, r) => s + r.rating, 0) /
                            listing.reviews.length
                          ).toFixed(1)
                        : 'New';
                    const cleanPhone = listing.landlordPhone.replace(/[^0-9+]/g, '');

                    const estElecPhp = Math.round(
                      estimatedMonthlyKwh * listing.declaredKwhRate
                    );
                    const estWaterPhp = listing.waterIncluded ? 0 : 135;
                    const trueMonthlyTotal =
                      listing.monthlyRentPhp + estElecPhp + estWaterPhp;

                    return (
                      <article
                        key={listing.id}
                        className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 min-w-0"
                      >
                        <div>
                          {/* Visual Carrier */}
                          <div
                            onClick={() => setSelectedListingId(listing.id)}
                            className="relative aspect-[16/10] w-full bg-[#F3F0EA] cursor-pointer overflow-hidden border-b border-[#E5E0D8]"
                          >
                            <PropertyIllustration
                              listing={listing}
                              sceneIndex={0}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              aria-label={isSaved ? 'Remove from shortlist' : 'Save room'}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveRoom(listing.id);
                              }}
                              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 border border-[#E5E0D8] flex items-center justify-center text-[#0F172A] hover:scale-105 transition-transform"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isSaved ? 'fill-[#B91C1C] text-[#B91C1C]' : 'text-[#0F172A]'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Card Body — Clean Unboxed Typography */}
                          <div className="p-4 sm:p-5 space-y-3">
                            {/* 1-line Quiet Kicker */}
                            <div className="text-xs text-[#64748B] font-medium flex items-center justify-between gap-2">
                              <span className="truncate">
                                Brgy. {listing.barangay} ·{' '}
                                <strong className="font-mono tabular-nums text-[#0F172A]">
                                  {listing.distanceMeters}m
                                </strong>{' '}
                                to {campus?.shortName}
                              </span>
                              <span className="font-mono tabular-nums text-[#0F172A] shrink-0">
                                ★ {avgRating} ({listing.reviews.length})
                              </span>
                            </div>

                            {/* Title & Room Type */}
                            <div>
                              <h2
                                onClick={() => setSelectedListingId(listing.id)}
                                className="text-base sm:text-lg font-bold text-[#0F172A] hover:text-[#B45309] cursor-pointer transition-colors leading-snug"
                              >
                                {listing.title}
                              </h2>
                              <p className="text-xs text-[#64748B] truncate mt-0.5">
                                {listing.roomType} · {listing.genderPolicy} ·{' '}
                                <span className="font-mono tabular-nums text-[#0F172A]">
                                  {listing.availableSlots} of {listing.totalSlots} slots open
                                </span>
                                {hasScheduledVisit ? ' · Visit Scheduled' : ''}
                              </p>
                            </div>

                            {/* Clean Unboxed Safety & Utility Line */}
                            <div className="pt-2.5 border-t border-[#E5E0D8] text-xs text-[#475569] leading-relaxed">
                              <span
                                className={
                                  listing.floodRisk === 'Low'
                                    ? 'text-[#15803D] font-semibold'
                                    : 'text-[#B45309] font-semibold'
                                }
                              >
                                Flood: {listing.floodRisk} (+{listing.elevationMetersAboveStreet}m)
                              </span>
                              <span aria-hidden="true"> · </span>
                              <span
                                className={
                                  listing.capelcoStandard
                                    ? 'text-[#1D4ED8] font-mono tabular-nums font-medium'
                                    : 'text-[#B45309] font-mono tabular-nums font-medium'
                                }
                              >
                                ₱{listing.declaredKwhRate.toFixed(2)}/kWh
                              </span>
                              <span aria-hidden="true"> · </span>
                              <span className="text-[#15803D] font-medium">
                                {listing.bfpVerified ? 'BFP Cleared' : 'BFP Pending'}
                              </span>
                            </div>

                            {/* Base Rent + Personalized True Monthly Total */}
                            <div className="pt-2 flex flex-wrap items-baseline justify-between gap-2">
                              <div>
                                <span className="text-lg sm:text-xl font-extrabold font-mono tabular-nums text-[#0F172A]">
                                  ₱{listing.monthlyRentPhp.toLocaleString()}
                                </span>
                                <span className="text-xs text-[#64748B]"> / mo base</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-mono tabular-nums font-bold text-[#15803D]">
                                  ≈ ₱{trueMonthlyTotal.toLocaleString()}/mo true total
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Card Footer Actions (44px Touch Targets) */}
                        <div className="px-4 sm:px-5 py-3.5 bg-[#FAF8F5] border-t border-[#E5E0D8] flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedListingId(listing.id)}
                            className="flex-1 min-h-[42px] py-2 px-3 bg-[#0F172A] text-[#FAF8F5] text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors whitespace-nowrap truncate"
                          >
                            Inspect & Book
                          </button>
                          <a
                            href={`tel:${cleanPhone}`}
                            aria-label={`Call ${listing.landlordLocalCallName}`}
                            className="min-h-[42px] py-2 px-3 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-xl hover:bg-[#F3F0EA] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`sms:${cleanPhone}?body=${encodeURIComponent(
                              `Maayong adlaw ${listing.landlordLocalCallName}! Saw ${listing.title} on BalayCapiz. Is a slot still available?`
                            )}`}
                            aria-label={`Send SMS to ${listing.landlordLocalCallName}`}
                            className="min-h-[42px] py-2 px-3 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-xl hover:bg-[#F3F0EA] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>SMS</span>
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* =====================================================================
          PWA INSTALL & DATASET IMPORT/EXPORT MODAL
      ===================================================================== */}
      <InstallAndDataModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        isInIframe={isInIframe}
        onTriggerInstall={install}
        listings={listings}
        visits={visits}
        savedIds={savedIds}
        onImportDataset={(data) => {
          if (data.listings) setListings(data.listings);
          if (data.visits) setVisits(data.visits);
          if (data.savedIds) setSavedIds(data.savedIds);
        }}
        onResetDefaultDataset={() => {
          setListings(INITIAL_LISTINGS);
          setVisits(INITIAL_SCHEDULED_VISITS);
          setSavedIds(['lawaan-student-haven', 'casa-verde-lawaan']);
        }}
      />

      {/* =====================================================================
          MOBILE & TABLET FIXED BOTTOM TAB BAR (Thumb-Zone Navigation, lg:hidden)
      ===================================================================== */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-t border-[#E5E0D8] grid grid-cols-5 items-center px-1 pb-safe"
      >
        <button
          type="button"
          onClick={() => {
            setSelectedListingId(null);
            setActiveTab('explore');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === 'explore' && !selectedListingId
              ? 'text-[#0F172A] font-bold'
              : 'text-[#64748B]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Discover</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedListingId(null);
            setActiveTab('map');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === 'map' && !selectedListingId
              ? 'text-[#0F172A] font-bold'
              : 'text-[#64748B]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Map Radar</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedListingId(null);
            setActiveTab('visits');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === 'visits' && !selectedListingId
              ? 'text-[#0F172A] font-bold'
              : 'text-[#64748B]'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            Saved ({savedIds.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedListingId(null);
            setActiveTab('calculator');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === 'calculator' && !selectedListingId
              ? 'text-[#0F172A] font-bold'
              : 'text-[#64748B]'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Bill Plan</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedListingId(null);
            setActiveTab('landlord');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center ${
            activeTab === 'landlord' && !selectedListingId
              ? 'text-[#0F172A] font-bold'
              : 'text-[#64748B]'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Landlord</span>
        </button>
      </nav>
    </div>
  );
}
