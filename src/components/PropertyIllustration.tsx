import React from 'react';
import { BoardingHouseListing } from '../data/roxasHousingData';

interface PropertyIllustrationProps {
  listing: BoardingHouseListing;
  sceneIndex?: number; // 0: Exterior & Flood Elevation, 1: Room & Study Desk, 2: BFP Fire Exit & Hallway, 3: CAPELCO Sub-meter & Utility
  className?: string;
}

export const SCENE_LABELS = [
  'Exterior & Street Elevation',
  'Room Layout & Study Desk',
  'BFP Fire Exit & Corridor',
  'CAPELCO Sub-Meter & Utility'
];

export const PropertyIllustration: React.FC<PropertyIllustrationProps> = ({
  listing,
  sceneIndex = 0,
  className = 'w-full h-full'
}) => {
  const { visualPalette, elevationMetersAboveStreet, declaredKwhRate, bfpCertNumber, roomType, waterIncluded } = listing;

  if (sceneIndex === 1) {
    // Scene 1: Room Interior & Study Desk View
    return (
      <svg
        viewBox="0 0 480 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={`${listing.title} — ${roomType} interior layout and study desk`}
      >
        {/* Warm interior wall backdrop */}
        <rect width="480" height="300" fill="#F5F2EB" />
        {/* Side wall perspective */}
        <polygon points="0,0 110,45 110,235 0,300" fill="#EAE4D7" />
        {/* Floor */}
        <polygon points="0,300 110,235 480,235 480,300" fill="#D9D0C1" />
        {/* Floor tile grid lines */}
        <line x1="110" y1="235" x2="480" y2="235" stroke="#C5B9A5" strokeWidth="1.5" />
        <line x1="65" y1="262" x2="480" y2="262" stroke="#CEC3B0" strokeWidth="1" />
        <line x1="180" y1="235" x2="140" y2="300" stroke="#CEC3B0" strokeWidth="1" />
        <line x1="290" y1="235" x2="275" y2="300" stroke="#CEC3B0" strokeWidth="1" />
        <line x1="400" y1="235" x2="410" y2="300" stroke="#CEC3B0" strokeWidth="1" />

        {/* Capiz-style jalousie/sliding window with tropical daylight */}
        <rect x="165" y="42" width="145" height="96" rx="3" fill="#E0F2FE" stroke="#0F172A" strokeWidth="2" />
        {/* Tropical trees outside window */}
        <circle cx="205" cy="95" r="28" fill="#86EFAC" opacity="0.65" />
        <circle cx="265" cy="88" r="34" fill="#4ADE80" opacity="0.55" />
        {/* Window mullions */}
        <line x1="237" y1="42" x2="237" y2="138" stroke="#0F172A" strokeWidth="2" />
        <line x1="165" y1="74" x2="310" y2="74" stroke="#0F172A" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="165" y1="106" x2="310" y2="106" stroke="#0F172A" strokeWidth="1" strokeOpacity="0.4" />

        {/* Bed / Bunk Structure */}
        <rect x="26" y="148" width="168" height="106" rx="4" fill={visualPalette.roofColor} />
        <rect x="32" y="176" width="156" height="44" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Pillow & Blanket */}
        <rect x="40" y="166" width="44" height="16" rx="4" fill="#FAF8F5" stroke="#94A3B8" strokeWidth="1.2" />
        <rect x="94" y="176" width="94" height="44" rx="2" fill={visualPalette.accentColor} fillOpacity="0.85" />
        {roomType === 'Bedspace' && (
          <>
            {/* Upper bunk for bedspace */}
            <rect x="26" y="88" width="168" height="12" rx="2" fill={visualPalette.roofColor} />
            <rect x="32" y="68" width="156" height="24" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
            <line x1="176" y1="88" x2="176" y2="254" stroke="#0F172A" strokeWidth="4" />
            <line x1="162" y1="88" x2="162" y2="254" stroke="#0F172A" strokeWidth="3" />
            <line x1="162" y1="115" x2="176" y2="115" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="162" y1="145" x2="176" y2="145" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="162" y1="175" x2="176" y2="175" stroke="#0F172A" strokeWidth="2.5" />
          </>
        )}

        {/* Student Study Desk & Laptop */}
        <rect x="245" y="168" width="150" height="10" rx="2" fill="#78350F" />
        <rect x="255" y="178" width="8" height="72" fill="#451A03" />
        <rect x="377" y="178" width="8" height="72" fill="#451A03" />
        {/* Laptop on desk */}
        <polygon points="285,142 328,142 332,166 281,166" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <rect x="276" y="165" width="60" height="3" rx="1" fill="#475569" />
        {/* Stand Fan (55W) */}
        <circle cx="422" cy="152" r="22" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        <circle cx="422" cy="152" r="6" fill={visualPalette.accentColor} />
        <line x1="422" y1="174" x2="422" y2="244" stroke="#0F172A" strokeWidth="4" />
        <rect x="404" y="244" width="36" height="7" rx="3" fill="#0F172A" />

        {/* Architectural Spec Callout Banner */}
        <rect x="16" y="14" width="215" height="24" rx="4" fill="#0F172A" fillOpacity="0.88" />
        <text x="26" y="30" fill="#FAF8F5" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="500">
          {roomType.toUpperCase()} · {listing.wifiIncluded ? 'FIBER WI-FI' : '5G READY'}
        </text>
      </svg>
    );
  }

  if (sceneIndex === 2) {
    // Scene 2: BFP Fire Exit & Hallway Inspection View
    return (
      <svg
        viewBox="0 0 480 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={`${listing.title} — BFP Fire Safety Inspection and Emergency Exit`}
      >
        <rect width="480" height="300" fill="#F1F5F9" />
        {/* Corridor perspective walls */}
        <polygon points="0,0 135,55 135,230 0,300" fill="#E2E8F0" />
        <polygon points="480,0 345,55 345,230 480,300" fill="#E2E8F0" />
        <polygon points="0,300 135,230 345,230 480,300" fill="#CBD5E1" />
        {/* Illuminated Green EXIT Sign */}
        <rect x="195" y="22" width="90" height="26" rx="3" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />
        <text x="218" y="39" fill="#FFFFFF" fontSize="13" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" letterSpacing="2">
          EXIT
        </text>
        {/* Steel Fire Exit Door */}
        <rect x="175" y="62" width="130" height="168" rx="3" fill="#DCFCE7" stroke="#15803D" strokeWidth="2.5" />
        <rect x="192" y="80" width="96" height="46" rx="2" fill="#E0F2FE" stroke="#15803D" strokeWidth="1.5" />
        {/* Panic bar */}
        <rect x="188" y="148" width="104" height="8" rx="3" fill="#0F172A" />

        {/* Wall-mounted BFP Red Fire Extinguisher */}
        <rect x="82" y="132" width="24" height="54" rx="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
        <rect x="89" y="122" width="10" height="10" fill="#0F172A" />
        <rect x="86" y="146" width="16" height="18" rx="1" fill="#FEF2F2" />

        {/* Emergency Dual-Head Battery Lamp */}
        <rect x="368" y="88" width="38" height="22" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="377" cy="82" r="6" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="397" cy="82" r="6" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />

        {/* BFP Certificate Tag */}
        <rect x="16" y="14" width="290" height="24" rx="4" fill="#14532D" />
        <text x="26" y="30" fill="#F0FDF4" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="500">
          BFP CLEARED · {bfpCertNumber || 'FSIC VERIFIED'}
        </text>
      </svg>
    );
  }

  if (sceneIndex === 3) {
    // Scene 3: CAPELCO Sub-meter & Utility Transparency View
    return (
      <svg
        viewBox="0 0 480 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={`${listing.title} — CAPELCO sub-meter and utility station`}
      >
        <rect width="480" height="300" fill="#F8FAFC" />
        {/* Concrete Utility Wall */}
        <rect x="0" y="0" width="480" height="300" fill="#F1F5F9" />
        <line x1="0" y1="100" x2="480" y2="100" stroke="#E2E8F0" strokeWidth="1" />
        <line x1="0" y1="200" x2="480" y2="200" stroke="#E2E8F0" strokeWidth="1" />

        {/* Electrical Conduit Pipes */}
        <rect x="115" y="0" width="8" height="90" fill="#64748B" />
        <rect x="255" y="0" width="8" height="90" fill="#64748B" />

        {/* Sub-meter Box 1 (Highlighted Room Meter) */}
        <rect x="68" y="82" width="104" height="128" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        <circle cx="120" cy="134" r="34" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
        <rect x="96" y="122" width="48" height="20" rx="2" fill="#0F172A" />
        <text x="101" y="136" fill="#F8FAFC" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
          0142.8
        </text>
        <text x="90" y="188" fill="#0F172A" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
          RM 04 METER
        </text>

        {/* Sub-meter Box 2 */}
        <rect x="208" y="82" width="104" height="128" rx="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
        <circle cx="260" cy="134" r="34" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
        <rect x="236" y="122" width="48" height="20" rx="2" fill="#334155" />
        <text x="241" y="136" fill="#F8FAFC" fontSize="10" fontFamily="IBM Plex Mono, monospace">
          0098.4
        </text>
        <text x="230" y="188" fill="#475569" fontSize="10" fontFamily="IBM Plex Mono, monospace">
          RM 05 METER
        </text>

        {/* Overhead MRWD Water Tank Indicator on Right */}
        <rect x="342" y="70" width="102" height="145" rx="12" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2" />
        <line x1="342" y1="108" x2="444" y2="108" stroke="#93C5FD" strokeWidth="1.5" />
        <line x1="342" y1="168" x2="444" y2="168" stroke="#93C5FD" strokeWidth="1.5" />
        <text x="358" y="138" fill="#1E3A8A" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
          MRWD TANK
        </text>
        <text x="358" y="154" fill="#1D4ED8" fontSize="10" fontFamily="IBM Plex Mono, monospace">
          {waterIncluded ? 'INCLUDED' : 'METERED'}
        </text>

        {/* Rate Banner */}
        <rect x="16" y="14" width="310" height="24" rx="4" fill="#1E3A8A" />
        <text x="26" y="30" fill="#FFFFFF" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="500">
          RATE: ₱{declaredKwhRate.toFixed(2)}/kWh · {listing.capelcoStandard ? 'CAPELCO PASS-THROUGH' : 'SUB-METER'}
        </text>
      </svg>
    );
  }

  // Default Scene 0: Exterior Facade, Gate & Flood Elevation above Roxas Street Level
  return (
    <svg
      viewBox="0 0 480 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`${listing.title} in Brgy. ${listing.barangay}, Roxas City`}
    >
      {/* Capiz Daylight Sky Backdrop */}
      <rect width="480" height="300" fill="#EDE9FE" fillOpacity="0.25" />
      <rect width="480" height="225" fill="#F3F0EA" />

      {/* Subtle architectural elevation grid lines */}
      <line x1="0" y1="75" x2="480" y2="75" stroke="#E5E0D8" strokeDasharray="3 3" />
      <line x1="0" y1="150" x2="480" y2="150" stroke="#E5E0D8" strokeDasharray="3 3" />

      {/* Background Tropical Palms / Acacia Foliage */}
      <circle cx="72" cy="145" r="46" fill={visualPalette.foliageTone} fillOpacity="0.18" />
      <circle cx="418" cy="138" r="52" fill={visualPalette.foliageTone} fillOpacity="0.15" />
      <circle cx="390" cy="165" r="34" fill={visualPalette.foliageTone} fillOpacity="0.24" />

      {/* Elevated Concrete Foundation Plinth (Shows Flood Protection!) */}
      <rect x="88" y="206" width="304" height="22" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />
      {/* Steps up from street level */}
      <rect x="212" y="212" width="56" height="8" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="206" y="220" width="68" height="8" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.2" />

      {/* Main Boarding House Structure */}
      <rect
        x="102"
        y="78"
        width="276"
        width-stroke="2"
        height="128"
        fill={visualPalette.wallColor}
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* Second Floor Balcony / Horizontal Slab */}
      <rect x="96" y="140" width="288" height="8" fill={visualPalette.roofColor} />
      {/* Balcony Railing */}
      <line x1="108" y1="124" x2="372" y2="124" stroke="#0F172A" strokeWidth="1.5" />
      {Array.from({ length: 18 }).map((_, idx) => (
        <line
          key={idx}
          x1={114 + idx * 15}
          y1={124}
          x2={114 + idx * 15}
          y2={140}
          stroke="#0F172A"
          strokeWidth="1.2"
        />
      ))}

      {/* Pitched Tropical GI Sheet Roof */}
      <polygon
        points="82,78 240,32 398,78"
        fill={visualPalette.roofColor}
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* Capiz Shell / Jalousie Windows — Upper Floor */}
      {[124, 192, 260, 318].map((wx, i) => (
        <g key={i}>
          <rect
            x={wx}
            y="92"
            width="38"
            height="32"
            rx="2"
            fill="#E0F2FE"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
          <line x1={wx + 19} y1="92" x2={wx + 19} y2="124" stroke="#0F172A" strokeWidth="1.2" />
          <line x1={wx} y1="108" x2={wx + 38} y2="108" stroke="#0F172A" strokeWidth="1" />
        </g>
      ))}

      {/* Ground Floor Windows & Secure Steel Gate Entrance */}
      <rect x="124" y="158" width="46" height="32" rx="2" fill="#E0F2FE" stroke="#0F172A" strokeWidth="1.5" />
      <rect x="310" y="158" width="46" height="32" rx="2" fill="#E0F2FE" stroke="#0F172A" strokeWidth="1.5" />

      {/* Center Steel Gate & Archway */}
      <rect
        x="212"
        y="154"
        width="56"
        height="52"
        rx="2"
        fill={visualPalette.accentColor}
        fillOpacity="0.18"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <line x1="240" y1="154" x2="240" y2="206" stroke="#0F172A" strokeWidth="2" />
      <line x1="226" y1="154" x2="226" y2="206" stroke="#0F172A" strokeWidth="1.2" />
      <line x1="254" y1="154" x2="254" y2="206" stroke="#0F172A" strokeWidth="1.2" />

      {/* Overhead Water Tank Tower on Right Side */}
      {listing.hasWaterTank && (
        <g>
          <line x1="406" y1="115" x2="402" y2="206" stroke="#334155" strokeWidth="2.5" />
          <line x1="432" y1="115" x2="436" y2="206" stroke="#334155" strokeWidth="2.5" />
          <line x1="404" y1="155" x2="434" y2="155" stroke="#334155" strokeWidth="1.5" />
          <rect x="398" y="76" width="42" height="40" rx="6" fill="#1D4ED8" stroke="#0F172A" strokeWidth="1.5" />
        </g>
      )}

      {/* Street Road Surface */}
      <rect x="0" y="228" width="480" height="72" fill="#E5E0D8" />
      <line x1="0" y1="228" x2="480" y2="228" stroke="#0F172A" strokeWidth="2" />

      {/* Elevation & Distance Architectural Callout */}
      <g>
        <rect x="16" y="242" width="448" height="42" rx="4" fill="#FAF8F5" stroke="#0F172A" strokeWidth="1.2" />
        <text x="28" y="260" fill="#0F172A" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
          BRGY. {listing.barangay.toUpperCase()} · +{elevationMetersAboveStreet.toFixed(2)}m ELEVATION ABOVE STREET
        </text>
        <text x="28" y="275" fill="#475569" fontSize="10" fontFamily="DM Sans, sans-serif">
          {listing.distanceMeters}m to campus gate ({listing.walkMinutes} min walk) · {listing.gateSecurity}
        </text>
      </g>
    </svg>
  );
};
