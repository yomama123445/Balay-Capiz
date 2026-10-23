export type CampusId = 'all' | 'hercor-lawaan' | 'capsu-main' | 'filamer' | 'hercor-riverside';

export type RoomType = 'Bedspace' | 'Single Room' | 'Shared Room' | 'Studio w/ CR';

export type FloodRiskLevel = 'Low' | 'Medium' | 'High';

export type GenderPolicy = 'Women Only' | 'Men Only' | 'Co-ed (Separate Floors)' | 'Any';

export interface CampusInfo {
  id: Exclude<CampusId, 'all'>;
  name: string;
  shortName: string;
  barangay: string;
  address: string;
  lat: number;
  lng: number;
  studentCountNote: string;
  trikeNote: string;
}

export interface TenantReview {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  programAndYear: string;
  stayPeriod: string;
  rating: number;
  title: string;
  comment: string;
  reportedKwhRate: number;
  verificationMethod: 'Student ID + Receipt Verified' | 'Rental Receipt Verified' | 'Enrollment Form + Receipt';
  verifiedDate: string;
  landlordReply?: {
    respondedAt: string;
    message: string;
  };
}

export interface BoardingHouseListing {
  id: string;
  title: string;
  localSubtitle: string;
  barangay: string;
  streetAddress: string;
  nearestCampus: Exclude<CampusId, 'all'>;
  distanceMeters: number;
  walkMinutes: number;
  trikeFarePhp: number;
  lat: number;
  lng: number;
  monthlyRentPhp: number;
  roomType: RoomType;
  genderPolicy: GenderPolicy;
  totalSlots: number;
  availableSlots: number;
  waterIncluded: boolean;
  waterNote: string;
  // Safety & Compliance (BalayCapiz core differentiator)
  capelcoStandard: boolean;
  declaredKwhRate: number;
  crowdsourcedKwhRate: number;
  meteringType: 'Individual CAPELCO Sub-meter' | 'Direct CAPELCO Meter' | 'Shared Sub-meter (Divided Equally)' | 'Fixed Appliance Rate';
  floodRisk: FloodRiskLevel;
  floodHistoryNote: string;
  elevationMetersAboveStreet: number;
  bfpVerified: boolean;
  bfpCertNumber?: string;
  bfpInspectionDate?: string;
  fireExtinguishersCount: number;
  hasDedicatedFireExit: boolean;
  gateSecurity: string;
  curfewPolicy: string;
  visitorPolicy: string;
  brownoutBackup: string;
  // Amenities
  wifiIncluded: boolean;
  wifiSpeedNote: string;
  hasStudyArea: boolean;
  hasKitchenAccess: boolean;
  hasLaundryArea: boolean;
  hasPrivateCR: boolean;
  hasWaterTank: boolean;
  hasCoveredMotoParking: boolean;
  // Landlord info
  landlordName: string;
  landlordLocalCallName: string;
  landlordInitials: string;
  landlordSinceYear: number;
  landlordPhone: string;
  landlordKycVerified: boolean;
  landlordResponseNote: string;
  // Lifecycle / 30-day auto-expiry
  daysUntilExpiry: number;
  lastUpdatedDate: string;
  // Architectural visual theme for bespoke SVG illustrations
  visualPalette: {
    roofColor: string;
    wallColor: string;
    accentColor: string;
    foliageTone: string;
    architecturalStyle: 'concrete-two-storey' | 'capiz-heritage-modern' | 'courtyard-bungalow' | 'modern-studio-block';
  };
  reviews: TenantReview[];
}

export const CAPELCO_BASELINE_RATE_PHP = 11.42; // Oct 2026 CAPELCO Residential Rate per kWh

export const CAMPUSES: CampusInfo[] = [
  {
    id: 'hercor-lawaan',
    name: 'Hercor College — Lawaan Campus',
    shortName: 'Hercor Lawaan',
    barangay: 'Brgy. Lawaan',
    address: 'Km. 1, Lawaan Highway, Roxas City, Capiz',
    lat: 11.5584,
    lng: 122.7538,
    studentCountNote: 'Primary CS, IT, Criminology & Engineering hub',
    trikeNote: '₱15 standard tricycle fare from Robinson\'s / Lawaan terminal'
  },
  {
    id: 'capsu-main',
    name: 'Capiz State University — Main Campus',
    shortName: 'CapSU Main',
    barangay: 'Fuentes Drive',
    address: 'Fuentes Drive, Brgy. IX / Tiza, Roxas City, Capiz',
    lat: 11.5836,
    lng: 122.7556,
    studentCountNote: 'Education, Architecture, Industrial Tech & Arts',
    trikeNote: 'Walkable corridor along Fuentes Drive, Tiza & Banica'
  },
  {
    id: 'filamer',
    name: 'Filamer Christian University',
    shortName: 'Filamer (FCU)',
    barangay: 'Roxas Avenue',
    address: 'Roxas Avenue, Brgy. VIII, Roxas City, Capiz',
    lat: 11.5888,
    lng: 122.7525,
    studentCountNote: 'Nursing, Medical Tech, Business & Hospitality',
    trikeNote: 'Central downtown corridor near Panay River bridge'
  },
  {
    id: 'hercor-riverside',
    name: 'Hercor College — Riverside Campus',
    shortName: 'Hercor Riverside',
    barangay: 'Roxas Avenue',
    address: 'Roxas Avenue, Downtown Roxas City, Capiz',
    lat: 11.5853,
    lng: 122.7512,
    studentCountNote: 'Healthcare, Senior High & Maritime programs',
    trikeNote: '400m south of Filamer along Roxas Avenue'
  }
];

export const INITIAL_LISTINGS: BoardingHouseListing[] = [
  {
    id: 'lawaan-student-haven',
    title: 'Lawaan Student Haven',
    localSubtitle: 'Balay Villanueva · Concrete 2-Storey Dormitory',
    barangay: 'Lawaan',
    streetAddress: '12 San Roque Extension, Km. 1 Lawaan, Roxas City',
    nearestCampus: 'hercor-lawaan',
    distanceMeters: 350,
    walkMinutes: 4,
    trikeFarePhp: 0,
    lat: 11.5608,
    lng: 122.7549,
    monthlyRentPhp: 2200,
    roomType: 'Single Room',
    genderPolicy: 'Women Only',
    totalSlots: 12,
    availableSlots: 2,
    waterIncluded: true,
    waterNote: 'MRWD water + 1,500L overhead pressure tank included in rent',
    capelcoStandard: true,
    declaredKwhRate: 11.42,
    crowdsourcedKwhRate: 11.45,
    meteringType: 'Individual CAPELCO Sub-meter',
    floodRisk: 'Low',
    floodHistoryNote: 'Dry during 2024–2025 monsoon & Typhoon Kristine; ground floor elevated 0.9m above Lawaan road level.',
    elevationMetersAboveStreet: 0.9,
    bfpVerified: true,
    bfpCertNumber: 'FSIC-R6-RXS-2026-0418',
    bfpInspectionDate: 'August 14, 2026',
    fireExtinguishersCount: 4,
    hasDedicatedFireExit: true,
    gateSecurity: '24/7 Steel Gate + CCTV at Entrance',
    curfewPolicy: '10:00 PM curfew (duplicate key provided for night-shift / OJT students)',
    visitorPolicy: 'Parents & siblings welcome in ground-floor receiving lounge until 8:00 PM',
    brownoutBackup: 'Automatic emergency LED hallway lights + solar charging station for phones/laptops',
    wifiIncluded: true,
    wifiSpeedNote: 'PLDT Fibr 200 Mbps (dual mesh routers per floor)',
    hasStudyArea: true,
    hasKitchenAccess: true,
    hasLaundryArea: true,
    hasPrivateCR: true,
    hasWaterTank: true,
    hasCoveredMotoParking: true,
    landlordName: 'Mrs. Elena Villanueva',
    landlordLocalCallName: 'Nanay Elena',
    landlordInitials: 'EV',
    landlordSinceYear: 2019,
    landlordPhone: '0917-542-8810',
    landlordKycVerified: true,
    landlordResponseNote: 'Lives on the ground floor; typically replies to SMS within 15 minutes',
    daysUntilExpiry: 12,
    lastUpdatedDate: 'October 9, 2026',
    visualPalette: {
      roofColor: '#1E293B',
      wallColor: '#F8FAFC',
      accentColor: '#D97706',
      foliageTone: '#15803D',
      architecturalStyle: 'concrete-two-storey'
    },
    reviews: [
      {
        id: 'rev-1',
        reviewerName: 'Maria Angelica S.',
        reviewerInitials: 'MS',
        programAndYear: 'BS Computer Science · 3rd Year (Hercor)',
        stayPeriod: 'AY 2025–2026 (10 months)',
        rating: 5,
        title: 'Zero sub-meter markup and walkable even when raining',
        comment: 'Nanay Elena shows us the actual monthly CAPELCO paper bill and reads our room sub-meter with us. With a clip fan, laptop, and phone charger, I only pay around ₱180 to ₱220 a month for electricity. The street outside never flooded during heavy classes.',
        reportedKwhRate: 11.42,
        verificationMethod: 'Student ID + Receipt Verified',
        verifiedDate: 'September 18, 2026',
        landlordReply: {
          respondedAt: 'September 19, 2026',
          message: 'Salamat gid, Maria! Good luck on your FE101 and thesis defense this semester. We always post the monthly CAPELCO billing sheet on the kitchen bulletin board.'
        }
      },
      {
        id: 'rev-2',
        reviewerName: 'Jessa Mae D.',
        reviewerInitials: 'JD',
        programAndYear: 'BS Criminology · 2nd Year (Hercor)',
        stayPeriod: 'Jan 2026 – Present',
        rating: 4,
        title: 'Safe gate lock and reliable water pressure in the morning',
        comment: 'Unlike my old boarding house where water ran out at 6:30 AM before 7:30 AM class, the overhead water tank here always has pressure. Room is compact but has a built-in wall desk and emergency exit.',
        reportedKwhRate: 11.50,
        verificationMethod: 'Rental Receipt Verified',
        verifiedDate: 'August 30, 2026'
      }
    ]
  },
  {
    id: 'casa-verde-lawaan',
    title: 'Casa Verde Bedspace & Study Dorm',
    localSubtitle: 'Compound of Engr. & Mrs. Borro · Shaded Garden Courtyard',
    barangay: 'Lawaan',
    streetAddress: 'Lot 4 Block 2, Villa Lawaan Subd., Roxas City',
    nearestCampus: 'hercor-lawaan',
    distanceMeters: 220,
    walkMinutes: 3,
    trikeFarePhp: 0,
    lat: 11.5596,
    lng: 122.7529,
    monthlyRentPhp: 1500,
    roomType: 'Bedspace',
    genderPolicy: 'Women Only',
    totalSlots: 16,
    availableSlots: 3,
    waterIncluded: true,
    waterNote: 'Free water + purified drinking water dispenser in common study hall',
    capelcoStandard: true,
    declaredKwhRate: 11.42,
    crowdsourcedKwhRate: 11.42,
    meteringType: 'Shared Sub-meter (Divided Equally)',
    floodRisk: 'Low',
    floodHistoryNote: 'Located on high-ground subdivision lot near Hercor back gate; zero flood history.',
    elevationMetersAboveStreet: 1.2,
    bfpVerified: true,
    bfpCertNumber: 'FSIC-R6-RXS-2026-0291',
    bfpInspectionDate: 'July 22, 2026',
    fireExtinguishersCount: 3,
    hasDedicatedFireExit: true,
    gateSecurity: 'Biometric / Keycard Gate + Resident Caretaker',
    curfewPolicy: '9:30 PM curfew (notify caretaker via SMS for late academic projects)',
    visitorPolicy: 'Visitors allowed in garden gazebo until 7:00 PM',
    brownoutBackup: '300W LiFePO4 Solar Power Station in study area for Wi-Fi router & laptop charging',
    wifiIncluded: true,
    wifiSpeedNote: 'Converge ICT 300 Mbps + backup Globe 5G failover',
    hasStudyArea: true,
    hasKitchenAccess: true,
    hasLaundryArea: true,
    hasPrivateCR: false,
    hasWaterTank: true,
    hasCoveredMotoParking: false,
    landlordName: 'Engr. Roberto & Tita Lorna Reyes',
    landlordLocalCallName: 'Tita Lorna',
    landlordInitials: 'LR',
    landlordSinceYear: 2021,
    landlordPhone: '0928-319-4402',
    landlordKycVerified: true,
    landlordResponseNote: 'Prefers SMS during daytime; calls welcome 8 AM – 7 PM',
    daysUntilExpiry: 26,
    lastUpdatedDate: 'October 17, 2026',
    visualPalette: {
      roofColor: '#14532D',
      wallColor: '#F0FDF4',
      accentColor: '#15803D',
      foliageTone: '#166534',
      architecturalStyle: 'courtyard-bungalow'
    },
    reviews: [
      {
        id: 'rev-3',
        reviewerName: 'Kyla Marie T.',
        reviewerInitials: 'KT',
        programAndYear: 'BS Information Technology · 4th Year (Hercor)',
        stayPeriod: 'AY 2024–2026',
        rating: 5,
        title: 'Best study hall when CAPELCO has a scheduled Saturday brownout',
        comment: 'Whenever CAPELCO has a scheduled feeder maintenance, Tita Lorna turns on the solar battery in the study lounge so our Wi-Fi stays online and we can finish coding assignments.',
        reportedKwhRate: 11.42,
        verificationMethod: 'Student ID + Receipt Verified',
        verifiedDate: 'October 2, 2026'
      }
    ]
  },
  {
    id: 'fuentes-scholars-residence',
    title: 'Fuentes Drive Scholars\' Residence',
    localSubtitle: 'Tita Bebot\'s Boarding House · Across CapSU Main',
    barangay: 'Tiza / Fuentes Drive',
    streetAddress: '84 Fuentes Drive, Brgy. Tiza, Roxas City',
    nearestCampus: 'capsu-main',
    distanceMeters: 190,
    walkMinutes: 2,
    trikeFarePhp: 0,
    lat: 11.5825,
    lng: 122.7564,
    monthlyRentPhp: 1850,
    roomType: 'Shared Room',
    genderPolicy: 'Co-ed (Separate Floors)',
    totalSlots: 20,
    availableSlots: 4,
    waterIncluded: true,
    waterNote: 'MRWD water included + 2 free gallons of mineral drinking water per room monthly',
    capelcoStandard: true,
    declaredKwhRate: 11.42,
    crowdsourcedKwhRate: 11.60,
    meteringType: 'Individual CAPELCO Sub-meter',
    floodRisk: 'Low',
    floodHistoryNote: 'Main structure sits 0.75m above Fuentes sidewalk; inner drainage upgraded in 2025.',
    elevationMetersAboveStreet: 0.75,
    bfpVerified: true,
    bfpCertNumber: 'FSIC-R6-RXS-2026-0512',
    bfpInspectionDate: 'September 3, 2026',
    fireExtinguishersCount: 5,
    hasDedicatedFireExit: true,
    gateSecurity: '24/7 Padlocked Iron Grille + Caretaker on Duty',
    curfewPolicy: '10:30 PM curfew (Architecture & drafting students given late pass)',
    visitorPolicy: 'Study partners allowed in 1st floor drafting table area 8 AM – 7 PM',
    brownoutBackup: 'Emergency rechargeable lamps in every corridor and stairwell',
    wifiIncluded: true,
    wifiSpeedNote: 'PLDT Fibr 150 Mbps included',
    hasStudyArea: true,
    hasKitchenAccess: true,
    hasLaundryArea: true,
    hasPrivateCR: false,
    hasWaterTank: true,
    hasCoveredMotoParking: true,
    landlordName: 'Mrs. Maribel "Bebot" Dela Cruz',
    landlordLocalCallName: 'Tita Bebot',
    landlordInitials: 'MD',
    landlordSinceYear: 2016,
    landlordPhone: '0919-884-2109',
    landlordKycVerified: true,
    landlordResponseNote: 'Very active on SMS and phone calls; accepts GCash or cash rent',
    daysUntilExpiry: 19,
    lastUpdatedDate: 'October 10, 2026',
    visualPalette: {
      roofColor: '#334155',
      wallColor: '#FEFCE8',
      accentColor: '#B45309',
      foliageTone: '#15803D',
      architecturalStyle: 'capiz-heritage-modern'
    },
    reviews: [
      {
        id: 'rev-4',
        reviewerName: 'Christian Paul A.',
        reviewerInitials: 'CA',
        programAndYear: 'BS Architecture · 3rd Year (CapSU Main)',
        stayPeriod: 'AY 2025–2026',
        rating: 5,
        title: 'Wide drafting tables downstairs and literally 2 minutes to CapSU gate',
        comment: 'You can wake up at 7:10 AM and still make your 7:30 AM class at CapSU Main. Tita Bebot even put long tables on the ground floor so Architecture students can work on plates without crowding the bedspace.',
        reportedKwhRate: 11.60,
        verificationMethod: 'Student ID + Receipt Verified',
        verifiedDate: 'September 11, 2026'
      }
    ]
  },
  {
    id: 'roxas-ave-nursing-suites',
    title: 'Roxas Avenue Heritage Dormitory',
    localSubtitle: 'Balay Del Rosario · Walkable to Filamer & Hercor Riverside',
    barangay: 'Brgy. VIII (Roxas Ave)',
    streetAddress: '41 Roxas Avenue Interior, Brgy. VIII, Roxas City',
    nearestCampus: 'filamer',
    distanceMeters: 160,
    walkMinutes: 2,
    trikeFarePhp: 0,
    lat: 11.5879,
    lng: 122.7518,
    monthlyRentPhp: 2600,
    roomType: 'Single Room',
    genderPolicy: 'Women Only',
    totalSlots: 10,
    availableSlots: 1,
    waterIncluded: true,
    waterNote: 'Water included; pressurized booster pump for 2nd and 3rd floors',
    capelcoStandard: true,
    declaredKwhRate: 11.42,
    crowdsourcedKwhRate: 11.42,
    meteringType: 'Individual CAPELCO Sub-meter',
    floodRisk: 'Low',
    floodHistoryNote: 'Interior lot is elevated; stayed completely dry during 2025 Panay River high water.',
    elevationMetersAboveStreet: 1.0,
    bfpVerified: true,
    bfpCertNumber: 'FSIC-R6-RXS-2026-0184',
    bfpInspectionDate: 'June 19, 2026',
    fireExtinguishersCount: 4,
    hasDedicatedFireExit: true,
    gateSecurity: '24/7 Guarded Compound Gate (Hospital Duty Friendly)',
    curfewPolicy: 'Flexible for Nursing & MedTech students on 11 PM / 7 AM hospital duty shifts',
    visitorPolicy: 'Family members only in lobby area',
    brownoutBackup: 'Silent inverter generator runs lights & outlets during 6 PM – 10 PM outages',
    wifiIncluded: true,
    wifiSpeedNote: 'PLDT Enterprise Fibr 300 Mbps with VLAN per floor',
    hasStudyArea: true,
    hasKitchenAccess: true,
    hasLaundryArea: true,
    hasPrivateCR: true,
    hasWaterTank: true,
    hasCoveredMotoParking: false,
    landlordName: 'Dr. & Mrs. Arturo Del Rosario',
    landlordLocalCallName: 'Ma\'am Claire',
    landlordInitials: 'CD',
    landlordSinceYear: 2018,
    landlordPhone: '0917-903-6614',
    landlordKycVerified: true,
    landlordResponseNote: 'Managed by Ma\'am Claire; ideal for nursing/allied health students',
    daysUntilExpiry: 23,
    lastUpdatedDate: 'October 14, 2026',
    visualPalette: {
      roofColor: '#0F172A',
      wallColor: '#FAF8F5',
      accentColor: '#1D4ED8',
      foliageTone: '#047857',
      architecturalStyle: 'capiz-heritage-modern'
    },
    reviews: [
      {
        id: 'rev-5',
        reviewerName: 'Hannah Grace V.',
        reviewerInitials: 'HV',
        programAndYear: 'BS Nursing · 3rd Year (Filamer)',
        stayPeriod: 'AY 2025–2026',
        rating: 5,
        title: 'Hospital duty friendly and very quiet after 9 PM',
        comment: 'When we have 6:00 AM clinical duty at Roxas Memorial Provincial Hospital or Capiz Emmanuel Hospital, the gate is easy to access safely and the quiet hours policy lets us sleep after night shifts.',
        reportedKwhRate: 11.42,
        verificationMethod: 'Student ID + Receipt Verified',
        verifiedDate: 'October 4, 2026'
      }
    ]
  },
  {
    id: 'banica-boarding-house',
    title: 'Banica Budget Boarding House',
    localSubtitle: 'Manong Jun\'s Student Rooms · Near Banica Public Market',
    barangay: 'Banica',
    streetAddress: 'Purok 3, Sitio Dulunan, Brgy. Banica, Roxas City',
    nearestCampus: 'capsu-main',
    distanceMeters: 480,
    walkMinutes: 6,
    trikeFarePhp: 15,
    lat: 11.5801,
    lng: 122.7612,
    monthlyRentPhp: 1350,
    roomType: 'Bedspace',
    genderPolicy: 'Men Only',
    totalSlots: 14,
    availableSlots: 5,
    waterIncluded: true,
    waterNote: 'Water included; deep well for laundry + MRWD line for bathing',
    capelcoStandard: false,
    declaredKwhRate: 13.50,
    crowdsourcedKwhRate: 13.50,
    meteringType: 'Shared Sub-meter (Divided Equally)',
    floodRisk: 'Medium',
    floodHistoryNote: 'Access lane experiences ankle-deep water (15–20cm) for 3–4 hours during heavy typhoon + high tide; rooms are on 2nd floor.',
    elevationMetersAboveStreet: 0.3,
    bfpVerified: true,
    bfpCertNumber: 'FSIC-R6-RXS-2026-0309',
    bfpInspectionDate: 'July 29, 2026',
    fireExtinguishersCount: 2,
    hasDedicatedFireExit: true,
    gateSecurity: 'Padlocked Steel Gate (Each tenant gets a key)',
    curfewPolicy: 'No strict curfew (Gate must be locked after 10 PM)',
    visitorPolicy: 'Visitors allowed on ground porch until 8:00 PM',
    brownoutBackup: 'Rechargeable hallway emergency lights',
    wifiIncluded: false,
    wifiSpeedNote: 'Strong Smart/DITO 5G signal; optional ₱150/mo shared fiber voucher',
    hasStudyArea: false,
    hasKitchenAccess: true,
    hasLaundryArea: true,
    hasPrivateCR: false,
    hasWaterTank: false,
    hasCoveredMotoParking: true,
    landlordName: 'Mr. Ernesto "Manong Jun" Tibudan',
    landlordLocalCallName: 'Manong Jun',
    landlordInitials: 'ET',
    landlordSinceYear: 2020,
    landlordPhone: '0939-412-7731',
    landlordKycVerified: true,
    landlordResponseNote: 'Transparent about ₱13.50/kWh sub-meter rate (covers common porch lights & water pump)',
    daysUntilExpiry: 7,
    lastUpdatedDate: 'September 28, 2026',
    visualPalette: {
      roofColor: '#7C2D12',
      wallColor: '#FFFBEB',
      accentColor: '#B45309',
      foliageTone: '#15803D',
      architecturalStyle: 'concrete-two-storey'
    },
    reviews: [
      {
        id: 'rev-6',
        reviewerName: 'Mark Anthony B.',
        reviewerInitials: 'MB',
        programAndYear: 'BS Industrial Technology · 2nd Year (CapSU)',
        stayPeriod: 'AY 2025–2026',
        rating: 4,
        title: 'Honest budget option right next to cheap carinderias in Banica',
        comment: 'Rent is only ₱1,350 and Banica market talipapa is 1 minute away so food is super cheap. During heavy rain the small street outside gets ankle-deep water, so bring slippers/boots, though our sleeping rooms are dry upstairs.',
        reportedKwhRate: 13.50,
        verificationMethod: 'Rental Receipt Verified',
        verifiedDate: 'September 25, 2026',
        landlordReply: {
          respondedAt: 'September 26, 2026',
          message: 'Salamat Mark! We added concrete stepping blocks along the side gate this month so boarders don\'t step in puddles during heavy rain.'
        }
      }
    ]
  },
  {
    id: 'km1-lawaan-courtyard',
    title: 'Km. 1 Lawaan Courtyard Rooms',
    localSubtitle: 'Manong Roel\'s Compound · Motorcycle-Friendly Boarding House',
    barangay: 'Lawaan',
    streetAddress: 'Km. 1 Interior (Behind Shell Station), Brgy. Lawaan, Roxas City',
    nearestCampus: 'hercor-lawaan',
    distanceMeters: 310,
    walkMinutes: 4,
    trikeFarePhp: 0,
    lat: 11.5572,
    lng: 122.7544,
    monthlyRentPhp: 1900,
    roomType: 'Shared Room',
    genderPolicy: 'Men Only',
    totalSlots: 8,
    availableSlots: 2,
    waterIncluded: true,
    waterNote: 'MRWD water included + free motorcycle washing hose on Saturdays',
    capelcoStandard: true,
    declaredKwhRate: 11.42,
    crowdsourcedKwhRate: 11.42,
    meteringType: 'Individual CAPELCO Sub-meter',
    floodRisk: 'Low',
    floodHistoryNote: 'Sloped concrete driveway drains directly to main highway culvert; never flooded.',
    elevationMetersAboveStreet: 0.85,
    bfpVerified: true,
    bfpCertNumber: 'FSIC-R6-RXS-2026-0445',
    bfpInspectionDate: 'August 25, 2026',
    fireExtinguishersCount: 3,
    hasDedicatedFireExit: true,
    gateSecurity: 'Heavy-Duty Sliding Gate + Motion Floodlights',
    curfewPolicy: '10:30 PM gate lock (keys issued to tenants with motorcycles)',
    visitorPolicy: 'Classmates allowed in covered courtyard table until 8:00 PM',
    brownoutBackup: 'Emergency LED corridor lights',
    wifiIncluded: true,
    wifiSpeedNote: 'Converge Fibr 200 Mbps included',
    hasStudyArea: true,
    hasKitchenAccess: true,
    hasLaundryArea: true,
    hasPrivateCR: true,
    hasWaterTank: true,
    hasCoveredMotoParking: true,
    landlordName: 'Mr. Roel & Mrs. Gina Dumaniel',
    landlordLocalCallName: 'Manong Roel',
    landlordInitials: 'RD',
    landlordSinceYear: 2020,
    landlordPhone: '0908-772-5519',
    landlordKycVerified: true,
    landlordResponseNote: 'Great for students commuting from Panitan, Pontevedra, or Ivisan with motorcycles',
    daysUntilExpiry: 28,
    lastUpdatedDate: 'October 19, 2026',
    visualPalette: {
      roofColor: '#1E293B',
      wallColor: '#F3F0EA',
      accentColor: '#0F172A',
      foliageTone: '#15803D',
      architecturalStyle: 'courtyard-bungalow'
    },
    reviews: [
      {
        id: 'rev-7',
        reviewerName: 'John Lloyd D.',
        reviewerInitials: 'JD',
        programAndYear: 'BS Computer Science · 3rd Year (Hercor Lawaan)',
        stayPeriod: 'AY 2025–2026',
        rating: 5,
        title: 'Secure roofed parking for motorcycles and exact CAPELCO rate',
        comment: 'I go home to Pontevedra on weekends and bring my motorcycle to Lawaan on Mondays. Having a locked gate with roofed parking plus exact ₱11.42/kWh electricity makes this the best spot near Hercor.',
        reportedKwhRate: 11.42,
        verificationMethod: 'Student ID + Receipt Verified',
        verifiedDate: 'October 12, 2026'
      }
    ]
  },
  {
    id: 'pueblo-edge-studios',
    title: 'Lawaan North Solo Studio Units',
    localSubtitle: 'Modern Concrete Studio Block · Private CR & Kitchenette',
    barangay: 'Lawaan',
    streetAddress: 'Sacred Heart Ave. Corner Lawaan Bypass, Roxas City',
    nearestCampus: 'hercor-lawaan',
    distanceMeters: 460,
    walkMinutes: 6,
    trikeFarePhp: 15,
    lat: 11.5621,
    lng: 122.7518,
    monthlyRentPhp: 3500,
    roomType: 'Studio w/ CR',
    genderPolicy: 'Any',
    totalSlots: 8,
    availableSlots: 1,
    waterIncluded: false,
    waterNote: 'Own MRWD water sub-meter (approx. ₱120–₱150/month)',
    capelcoStandard: true,
    declaredKwhRate: 11.42,
    crowdsourcedKwhRate: 11.42,
    meteringType: 'Direct CAPELCO Meter',
    floodRisk: 'Low',
    floodHistoryNote: 'Elevated commercial-grade foundation near Pueblo de Panay perimeter; zero flood risk.',
    elevationMetersAboveStreet: 1.4,
    bfpVerified: true,
    bfpCertNumber: 'FSIC-R6-RXS-2026-0601',
    bfpInspectionDate: 'September 29, 2026',
    fireExtinguishersCount: 6,
    hasDedicatedFireExit: true,
    gateSecurity: '24/7 Smart PIN Lock + Perimeter Cameras',
    curfewPolicy: 'No curfew (24/7 independent tenant access)',
    visitorPolicy: 'Registered visitors allowed until 9:00 PM',
    brownoutBackup: 'Dedicated hallway generator + surge-protected circuit breakers',
    wifiIncluded: true,
    wifiSpeedNote: 'PLDT Fibr 400 Mbps + Ethernet LAN port on study desk',
    hasStudyArea: true,
    hasKitchenAccess: true,
    hasLaundryArea: true,
    hasPrivateCR: true,
    hasWaterTank: true,
    hasCoveredMotoParking: true,
    landlordName: 'Ms. Patricia Aldea-Santos',
    landlordLocalCallName: 'Ma\'am Pat',
    landlordInitials: 'PA',
    landlordSinceYear: 2023,
    landlordPhone: '0917-610-3390',
    landlordKycVerified: true,
    landlordResponseNote: 'Each studio has its own official CAPELCO meter billed directly by the cooperative',
    daysUntilExpiry: 29,
    lastUpdatedDate: 'October 20, 2026',
    visualPalette: {
      roofColor: '#0F172A',
      wallColor: '#FFFFFF',
      accentColor: '#0284C7',
      foliageTone: '#15803D',
      architecturalStyle: 'modern-studio-block'
    },
    reviews: [
      {
        id: 'rev-8',
        reviewerName: 'cheska_mae',
        reviewerInitials: 'CM',
        programAndYear: 'BS Accountancy · 4th Year (FCU / Hercor Reviewee)',
        stayPeriod: 'AY 2025–2026',
        rating: 5,
        title: 'Direct CAPELCO bill in your own unit and LAN port for online exams',
        comment: 'Shared by two sisters so we split the ₱3,500 rent (₱1,750 each). Having a direct CAPELCO meter means zero arguments over utility bills, and the private sink/CR saves so much time.',
        reportedKwhRate: 11.42,
        verificationMethod: 'Enrollment Form + Receipt',
        verifiedDate: 'October 8, 2026'
      }
    ]
  }
];

export interface ApplianceItem {
  id: string;
  name: string;
  localExample: string;
  watts: number;
  defaultHoursPerDay: number;
  defaultEnabled: boolean;
}

export const STUDENT_APPLIANCES: ApplianceItem[] = [
  {
    id: 'stand-fan',
    name: '16" Stand / Desk Fan',
    localExample: 'Asahi / Camel 55W fan (overnight + study)',
    watts: 55,
    defaultHoursPerDay: 10,
    defaultEnabled: true
  },
  {
    id: 'laptop',
    name: 'Student Laptop',
    localExample: '65W charger (coding, thesis & lectures)',
    watts: 45,
    defaultHoursPerDay: 5,
    defaultEnabled: true
  },
  {
    id: 'phone-led',
    name: 'Smartphone + Desk LED Lamp',
    localExample: 'Daily charging + evening study light',
    watts: 18,
    defaultHoursPerDay: 4,
    defaultEnabled: true
  },
  {
    id: 'rice-cooker',
    name: 'Mini Rice Cooker (0.6L)',
    localExample: '350W solo pot (2x daily cooking, ~40 mins total)',
    watts: 350,
    defaultHoursPerDay: 0.7,
    defaultEnabled: false
  },
  {
    id: 'electric-kettle',
    name: 'Electric Kettle / Thermos',
    localExample: 'Coffee / noodles morning boil (~15 mins/day)',
    watts: 800,
    defaultHoursPerDay: 0.25,
    defaultEnabled: false
  },
  {
    id: 'window-aircon',
    name: '0.6 HP Inverter Window Aircon',
    localExample: 'Studio rooms only (6 hours night sleep)',
    watts: 480,
    defaultHoursPerDay: 6,
    defaultEnabled: false
  }
];
