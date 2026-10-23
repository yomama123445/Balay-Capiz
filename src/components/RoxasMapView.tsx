import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { BoardingHouseListing, CAMPUSES, CampusId } from '../data/roxasHousingData';
import { Navigation, Phone, MessageSquare, ArrowUpRight, ShieldCheck, Map, Columns } from 'lucide-react';

interface RoxasMapViewProps {
  listings: BoardingHouseListing[];
  selectedCampus: CampusId;
  onSelectCampus: (campus: CampusId) => void;
  onOpenListing: (listing: BoardingHouseListing) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const RoxasMapView: React.FC<RoxasMapViewProps> = ({
  listings,
  selectedCampus,
  onSelectCampus,
  onOpenListing,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeListingId, setActiveListingId] = useState<string>(
    listings[0]?.id || 'lawaan-student-haven'
  );
  const [showWalkingRadius, setShowWalkingRadius] = useState<boolean>(true);
  const [mobileMapMode, setMobileMapMode] = useState<'split' | 'map-full'>('split');

  const activeListing =
    listings.find((l) => l.id === activeListingId) || listings[0] || null;

  useEffect(() => {
    if (listings.length > 0 && !listings.some((l) => l.id === activeListingId)) {
      setActiveListingId(listings[0].id);
    }
  }, [listings, activeListingId]);

  // Initialize Leaflet Map + ResizeObserver for responsive container changes
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [11.5725, 122.7545],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors · BalayCapiz GIS',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = layerGroup;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(mapContainerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Pan map when campus filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedCampus !== 'all') {
      const campus = CAMPUSES.find((c) => c.id === selectedCampus);
      if (campus) {
        map.flyTo([campus.lat, campus.lng], 16, { duration: 0.6 });
      }
    } else {
      map.flyTo([11.5725, 122.7545], 14, { duration: 0.6 });
    }
  }, [selectedCampus]);

  // Render Campus Pins, 500m Walking Rings, and Property Price Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    CAMPUSES.forEach((campus) => {
      if (showWalkingRadius) {
        L.circle([campus.lat, campus.lng], {
          radius: 500,
          color: '#1D4ED8',
          weight: 1.5,
          dashArray: '4 4',
          fillColor: '#3B82F6',
          fillOpacity: 0.07,
        }).addTo(layerGroup);
      }

      const campusIcon = L.divIcon({
        className: 'custom-campus-div-icon',
        html: `<div class="balay-campus-marker">${campus.shortName} Gate</div>`,
        iconSize: [120, 28],
        iconAnchor: [60, 14],
      });

      const marker = L.marker([campus.lat, campus.lng], { icon: campusIcon });
      marker.on('click', () => {
        onSelectCampus(campus.id);
      });
      marker.addTo(layerGroup);
    });

    if (activeListing) {
      const targetCampus = CAMPUSES.find((c) => c.id === activeListing.nearestCampus);
      if (targetCampus) {
        L.polyline(
          [
            [activeListing.lat, activeListing.lng],
            [targetCampus.lat, targetCampus.lng],
          ],
          {
            color: '#D97706',
            weight: 2.5,
            dashArray: '6 4',
          }
        ).addTo(layerGroup);
      }
    }

    listings.forEach((listing) => {
      const isSelected = listing.id === activeListing?.id;
      const priceIcon = L.divIcon({
        className: 'custom-price-div-icon',
        html: `<div class="balay-price-marker ${isSelected ? 'is-active' : ''}">₱${listing.monthlyRentPhp.toLocaleString()}</div>`,
        iconSize: [74, 28],
        iconAnchor: [37, 14],
      });

      const marker = L.marker([listing.lat, listing.lng], {
        icon: priceIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      });

      marker.on('click', () => {
        setActiveListingId(listing.id);
        map.panTo([listing.lat, listing.lng], { animate: true });
      });

      marker.addTo(layerGroup);
    });
  }, [listings, activeListing, showWalkingRadius, onSelectCampus]);

  const activeCampusObj = activeListing
    ? CAMPUSES.find((c) => c.id === activeListing.nearestCampus)
    : null;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 lg:pb-12">
      {/* Section Header + Responsive Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#E5E0D8]">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-mono text-[#64748B] tracking-tight truncate">
            ROXAS CITY GIS · OPENSTREETMAP + LEAFLET.JS
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] mt-1">
            Campus Proximity & Barangay Elevation Map
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-2xl">
            Tap any price pin to inspect walking distance to campus gates, street flood elevation, and verified CAPELCO metering.
          </p>
        </div>

        {/* Scrollable Campus Switcher + 500m Ring Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1 bg-[#F3F0EA] p-1 rounded-xl border border-[#E5E0D8] overflow-x-auto no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => onSelectCampus('all')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCampus === 'all'
                  ? 'bg-[#0F172A] text-[#FAF8F5]'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              All Roxas ({listings.length})
            </button>
            {CAMPUSES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCampus(c.id)}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCampus === c.id
                    ? 'bg-[#0F172A] text-[#FAF8F5]'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {c.shortName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowWalkingRadius((prev) => !prev)}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap ${
                showWalkingRadius
                  ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'
                  : 'bg-white border-[#E5E0D8] text-[#475569]'
              }`}
            >
              {showWalkingRadius ? '500m Rings: On' : '500m Rings: Off'}
            </button>

            {/* Mobile Layout Switcher (visible only below lg) */}
            <button
              type="button"
              onClick={() =>
                setMobileMapMode((prev) => (prev === 'split' ? 'map-full' : 'split'))
              }
              className="lg:hidden min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E5E0D8] bg-white text-[#0F172A] flex items-center gap-1.5 whitespace-nowrap"
            >
              {mobileMapMode === 'split' ? (
                <>
                  <Map className="w-3.5 h-3.5" />
                  Expand Map
                </>
              ) : (
                <>
                  <Columns className="w-3.5 h-3.5" />
                  Show Details
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Horizontal Pin Selector Bar on Mobile/Tablet */}
      <div className="lg:hidden mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {listings.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveListingId(item.id);
              mapInstanceRef.current?.panTo([item.lat, item.lng], { animate: true });
            }}
            className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              item.id === activeListing?.id
                ? 'bg-[#0F172A] text-[#FAF8F5] border-[#0F172A]'
                : 'bg-white text-[#0F172A] border-[#E5E0D8]'
            }`}
          >
            <span className="truncate max-w-[140px]">{item.title}</span>
            <span className="font-mono tabular-nums font-bold text-[#F5C842]">
              ₱{item.monthlyRentPhp.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Main Split Grid: Map Left (8 cols on lg), Active Pin Inspector Right (4 cols on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 mt-4 lg:mt-6 items-stretch">
        {/* Map Container */}
        <div className="lg:col-span-8 flex flex-col">
          <div
            className={`relative w-full rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#E2E8F0] transition-opacity ${
              mobileMapMode === 'map-full'
                ? 'h-[65vh] sm:h-[520px] lg:h-[580px]'
                : 'h-[300px] sm:h-[380px] lg:h-[580px]'
            }`}
          >
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Compact Floating Preview Card on Mobile when in Full-Map Mode */}
            {mobileMapMode === 'map-full' && activeListing && (
              <div className="lg:hidden absolute bottom-3 left-3 right-3 z-[400] bg-white/95 backdrop-blur-md border border-[#E5E0D8] rounded-xl p-3.5 shadow-lg flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] text-[#64748B] truncate">
                    Brgy. {activeListing.barangay} · {activeListing.distanceMeters}m to{' '}
                    {activeCampusObj?.shortName}
                  </div>
                  <div className="text-sm font-bold text-[#0F172A] truncate">
                    {activeListing.title}
                  </div>
                  <div className="text-xs font-mono tabular-nums font-bold text-[#15803D]">
                    ₱{activeListing.monthlyRentPhp.toLocaleString()}/mo · Flood:{' '}
                    {activeListing.floodRisk}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenListing(activeListing)}
                  className="min-h-[40px] px-3.5 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl shrink-0"
                >
                  Inspect
                </button>
              </div>
            )}

            {/* Map Legend Overlay (Hidden on small mobile when floating card is active) */}
            <div
              className={`${
                mobileMapMode === 'map-full' ? 'hidden lg:block' : 'block'
              } absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto z-[400] bg-[#FAF8F5]/95 backdrop-blur-sm border border-[#E5E0D8] rounded-xl px-3 py-2 text-[11px] text-[#0F172A] shadow-sm`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-2.5 h-2.5 rounded-xs bg-[#0F172A]" />
                  Rent Pin
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-2.5 h-2.5 rounded-xs bg-[#D97706]" />
                  Selected
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-2.5 h-2.5 rounded-xs bg-[#1D4ED8]" />
                  Campus Gate (500m)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Pin Inspector + Quick List */}
        <div
          className={`${
            mobileMapMode === 'map-full' ? 'hidden lg:flex' : 'flex'
          } lg:col-span-4 flex-col justify-between bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-5`}
        >
          {activeListing ? (
            <div>
              <div className="flex items-center justify-between text-xs text-[#64748B] font-mono pb-3 border-b border-[#E5E0D8]">
                <span className="truncate pr-2">
                  PIN · BRGY. {activeListing.barangay.toUpperCase()}
                </span>
                <span className="tabular-nums shrink-0">
                  {activeListing.availableSlots}/{activeListing.totalSlots} open
                </span>
              </div>

              <div className="mt-3.5">
                <div className="text-xs text-[#475569]">
                  {activeListing.roomType} · {activeListing.genderPolicy} ·{' '}
                  <span className="font-mono tabular-nums font-medium text-[#0F172A]">
                    {activeListing.distanceMeters}m
                  </span>{' '}
                  to {activeCampusObj?.shortName}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mt-1">
                  {activeListing.title}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">{activeListing.streetAddress}</p>
              </div>

              {/* Price & Utility Summary */}
              <div className="mt-4 py-3 border-y border-[#E5E0D8] flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#0F172A]">
                    ₱{activeListing.monthlyRentPhp.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#64748B]"> / mo</span>
                </div>
                <div className="text-right text-xs text-[#475569]">
                  <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                    ₱{activeListing.declaredKwhRate.toFixed(2)}/kWh
                  </span>{' '}
                  · {activeListing.waterIncluded ? 'Water incl.' : 'Metered'}
                </div>
              </div>

              {/* Walking & Flood Specs */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#64748B]">Walking Time to Gate</span>
                  <span className="font-mono tabular-nums font-medium text-[#0F172A]">
                    {activeListing.walkMinutes} mins ({activeListing.distanceMeters}m)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#64748B]">Tricycle Tariff</span>
                  <span className="font-mono tabular-nums font-medium text-[#0F172A]">
                    {activeListing.trikeFarePhp === 0
                      ? '₱0 (Direct Walk)'
                      : `₱${activeListing.trikeFarePhp} Regular`}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#64748B]">Monsoon Flood Profile</span>
                  <span
                    className={`font-medium ${
                      activeListing.floodRisk === 'Low'
                        ? 'text-[#15803D]'
                        : activeListing.floodRisk === 'Medium'
                        ? 'text-[#B45309]'
                        : 'text-[#B91C1C]'
                    }`}
                  >
                    {activeListing.floodRisk} (+{activeListing.elevationMetersAboveStreet}m elev.)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#64748B]">BFP Fire Clearance</span>
                  <span className="font-mono text-[#15803D] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{activeListing.bfpCertNumber || 'Verified'}</span>
                  </span>
                </div>
              </div>

              <p className="mt-3.5 text-xs text-[#475569] bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D8]">
                {activeListing.floodHistoryNote}
              </p>

              {/* Actions */}
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => onOpenListing(activeListing)}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-[#0F172A] text-[#FAF8F5] text-xs font-semibold rounded-xl hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  Inspect Full Safety & Room Details
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${activeListing.landlordPhone.replace(/[^0-9+]/g, '')}`}
                    className="min-h-[42px] py-2 px-3 bg-white border border-[#E5E0D8] text-[#0F172A] text-xs font-medium rounded-xl hover:bg-[#F3F0EA] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Call {activeListing.landlordLocalCallName}</span>
                  </a>
                  <a
                    href={`sms:${activeListing.landlordPhone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(
                      `Maayong adlaw ${activeListing.landlordLocalCallName}! Saw ${activeListing.title} on BalayCapiz. Is a slot still available?`
                    )}`}
                    className="min-h-[42px] py-2 px-3 bg-[#FEF3C7] border border-[#FDE68A] text-[#78350F] text-xs font-semibold rounded-xl hover:bg-[#FDE68A] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    Send SMS
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-[#64748B]">No listings match current filter.</div>
          )}

          {/* Desktop Quick Jump Strip of Pins */}
          <div className="hidden lg:block mt-5 pt-4 border-t border-[#E5E0D8]">
            <div className="text-xs font-semibold text-[#64748B] mb-2 flex items-center justify-between">
              <span>Jump to Property Pin</span>
              <span className="font-mono tabular-nums">{listings.length} shown</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
              {listings.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveListingId(item.id);
                    mapInstanceRef.current?.panTo([item.lat, item.lng], { animate: true });
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    item.id === activeListing?.id
                      ? 'bg-[#0F172A] text-[#FAF8F5] font-medium'
                      : 'hover:bg-[#F3F0EA] text-[#0F172A]'
                  }`}
                >
                  <span className="truncate pr-2">
                    <Navigation className="w-3 h-3 inline mr-1.5 opacity-75" />
                    {item.title}
                  </span>
                  <span className="font-mono tabular-nums shrink-0">
                    ₱{item.monthlyRentPhp.toLocaleString()} · {item.distanceMeters}m
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
