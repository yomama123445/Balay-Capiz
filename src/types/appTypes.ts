import { CampusId } from '../data/roxasHousingData';

export interface InspectionChecklist {
  checkedSubMeter: boolean;
  testedMorningWater: boolean;
  verifiedFireExit: boolean;
  checkedCellSignal: boolean;
}

export interface ScheduledVisit {
  id: string;
  listingId: string;
  listingTitle: string;
  barangay: string;
  streetAddress: string;
  landlordName: string;
  landlordCallName: string;
  landlordPhone: string;
  monthlyRentPhp: number;
  visitDate: string;
  visitTimeSlot: string;
  studentName: string;
  studentPhone: string;
  studentCampus: Exclude<CampusId, 'all'>;
  occupantsCount: number;
  status: 'Confirmed' | 'Pending Landlord' | 'Visited & Inspected' | 'Cancelled';
  inspectionNotes: string;
  checklist: InspectionChecklist;
  createdAt: string;
}

export interface StudentPreferences {
  homeCampus: CampusId;
  targetMaxRent: number;
  occupantsSplit: number; // 1 = solo, 2 = 2 sharing, 3 = 3 sharing
  estimatedMonthlyKwh: number;
}

export const INITIAL_SCHEDULED_VISITS: ScheduledVisit[] = [
  {
    id: 'visit-101',
    listingId: 'lawaan-student-haven',
    listingTitle: 'Lawaan Student Haven',
    barangay: 'Lawaan',
    streetAddress: '12 San Roque Extension, Km. 1 Lawaan, Roxas City',
    landlordName: 'Mrs. Elena Villanueva',
    landlordCallName: 'Nanay Elena',
    landlordPhone: '0917-542-8810',
    monthlyRentPhp: 2200,
    visitDate: '2026-10-24',
    visitTimeSlot: '10:00 AM – 11:00 AM (Saturday)',
    studentName: 'Andrea Borro',
    studentPhone: '0918-441-9023',
    studentCampus: 'hercor-lawaan',
    occupantsCount: 1,
    status: 'Confirmed',
    inspectionNotes: 'Ask Nanay Elena to show Room 04 digital sub-meter and check PLDT Fibr speed on 2nd floor.',
    checklist: {
      checkedSubMeter: true,
      testedMorningWater: true,
      verifiedFireExit: true,
      checkedCellSignal: false,
    },
    createdAt: 'Oct 20, 2026',
  },
  {
    id: 'visit-102',
    listingId: 'casa-verde-lawaan',
    listingTitle: 'Casa Verde Bedspace & Study Dorm',
    barangay: 'Lawaan',
    streetAddress: 'Lot 4 Block 2, Villa Lawaan Subd., Roxas City',
    landlordName: 'Engr. Roberto & Tita Lorna Reyes',
    landlordCallName: 'Tita Lorna',
    landlordPhone: '0928-319-4402',
    monthlyRentPhp: 1500,
    visitDate: '2026-10-25',
    visitTimeSlot: '2:30 PM – 3:30 PM (Sunday)',
    studentName: 'Andrea Borro',
    studentPhone: '0918-441-9023',
    studentCampus: 'hercor-lawaan',
    occupantsCount: 2,
    status: 'Pending Landlord',
    inspectionNotes: 'Check study lounge solar backup outlets and lower bunk availability.',
    checklist: {
      checkedSubMeter: false,
      testedMorningWater: false,
      verifiedFireExit: false,
      checkedCellSignal: false,
    },
    createdAt: 'Oct 21, 2026',
  },
];
